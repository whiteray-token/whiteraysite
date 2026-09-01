(function () {
  function sameWidgetItems(root, selector) {
    return Array.prototype.filter.call(root.querySelectorAll(selector), function (item) {
      return item.closest(".elementor-tabs, .elementor-accordion") === root;
    });
  }

  function panelForTitle(title, root) {
    var contentId = title.getAttribute("aria-controls");
    if (!contentId) return null;

    if (root) {
      var localPanel = sameWidgetItems(root, ".elementor-tab-content").find(function (panel) {
        return panel.id === contentId;
      });
      if (localPanel) return localPanel;
    }

    if (title.parentElement) {
      var siblingPanel = Array.prototype.find.call(title.parentElement.children, function (item) {
        return item.id === contentId;
      });
      if (siblingPanel) return siblingPanel;
    }

    return document.getElementById(contentId);
  }

  function setExpanded(title, panel, expanded) {
    title.classList.toggle("elementor-active", expanded);
    title.setAttribute("aria-expanded", expanded ? "true" : "false");
    title.setAttribute("aria-selected", expanded ? "true" : "false");

    if (panel) {
      panel.classList.toggle("elementor-active", expanded);
      panel.hidden = !expanded;
      panel.style.display = expanded ? "block" : "none";
    }
  }

  function toggleAccordion(title) {
    var accordion = title.closest(".elementor-accordion");
    var content = panelForTitle(title, accordion);
    if (!accordion || !content) return;

    var shouldOpen = !title.classList.contains("elementor-active");

    sameWidgetItems(accordion, ".elementor-tab-title").forEach(function (item) {
      var panel = panelForTitle(item, accordion);
      setExpanded(item, panel, false);
    });

    setExpanded(title, content, shouldOpen);
  }

  function switchTabs(title) {
    var tabs = title.closest(".elementor-tabs");
    if (!tabs) return;

    var tabNumber = title.getAttribute("data-tab");
    var titles = sameWidgetItems(tabs, ".elementor-tab-title");
    var panels = sameWidgetItems(tabs, ".elementor-tab-content");

    titles.forEach(function (item) {
      var selected = item.getAttribute("data-tab") === tabNumber;
      item.classList.toggle("elementor-active", selected);
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.setAttribute("aria-expanded", selected ? "true" : "false");
      item.setAttribute("tabindex", selected ? "0" : "-1");
    });

    panels.forEach(function (panel) {
      var selected = panel.getAttribute("data-tab") === tabNumber;
      panel.classList.toggle("elementor-active", selected);
      panel.hidden = !selected;
      panel.style.display = selected ? "block" : "none";
    });
  }

  function revealStaticAnimatedElements() {
    document.querySelectorAll(".elementor-invisible").forEach(function (element) {
      element.classList.remove("elementor-invisible");
    });
  }

  function activateTitle(title) {
    var tabRoot = title.closest(".elementor-tabs");
    var accordionRoot = title.closest(".elementor-accordion");

    if (tabRoot && (!accordionRoot || tabRoot.contains(accordionRoot) === false)) {
      switchTabs(title);
      return;
    }

    if (accordionRoot) {
      toggleAccordion(title);
    }
  }

  function bindStaticControls() {
    var selector = [
      ".elementor-tabs > .elementor-tabs-wrapper > .elementor-tab-title",
      ".elementor-tabs > .elementor-tabs-content-wrapper > .elementor-tab-mobile-title",
      ".elementor-accordion > .elementor-accordion-item > .elementor-tab-title"
    ].join(", ");

    document.querySelectorAll(selector).forEach(function (title) {
      if (title.dataset.staticInteractionBound === "true") return;
      title.dataset.staticInteractionBound = "true";

      title.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        activateTitle(title);
      }, true);
    });
  }

  document.addEventListener("click", function (event) {
    var title = event.target.closest(".elementor-tab-title[data-static-interaction-bound='true']");
    if (!title) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    activateTitle(title);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;

    var title = event.target.closest(".elementor-tab-title");
    if (!title) return;

    event.preventDefault();
    activateTitle(title);
  });

  document.addEventListener("DOMContentLoaded", function () {
    revealStaticAnimatedElements();
    bindStaticControls();
  });

  window.addEventListener("load", function () {
    revealStaticAnimatedElements();
    bindStaticControls();
  });
})();
