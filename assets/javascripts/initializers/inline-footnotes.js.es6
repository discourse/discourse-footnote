import { createPopper } from "@popperjs/core";
import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

let inlineFootnotePopper;

function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.id = "footnote-tooltip";

  if (window.devicePixelRatio && window.devicePixelRatio > 1) {
    tooltip.classList.add("retina");
  }

  const pointer = document.createElement("div");
  pointer.classList.add("footnote-tooltip-pointer");
  tooltip.append(pointer);

  const content = document.createElement("div");
  content.classList.add("footnote-tooltip-content");
  tooltip.append(content);

  document.body.append(tooltip);

  return tooltip;
}

function showFootnote(event) {
  inlineFootnotePopper?.destroy();

  let tooltip = document.querySelector("#footnote-tooltip");

  tooltip && tooltip.classList.remove("is-expanded");

  if (!event.target.classList.contains("expand-footnote")) {
    return;
  }

  const button = event.target;
  const cooked = button.closest(".cooked");

  tooltip = tooltip || createTooltip();
  tooltip.classList.add("is-expanded");

  const footnoteId = button.dataset.footnoteId;
  const footnoteContent = tooltip.querySelector(".footnote-tooltip-content");
  const newContent = cooked.querySelector(`#footnote-${footnoteId}`);
  footnoteContent.innerHTML = newContent.innerHTML;

  // eslint-disable-next-line
  inlineFootnotePopper = createPopper(button, tooltip, {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 12],
        },
      },
    ],
  });
}

function inlineFootnotes(elem) {
  const footnoteRefs = elem.querySelectorAll("sup.footnote-ref");

  footnoteRefs.forEach((footnoteRef) => {
    const button = document.createElement("button");
    button.classList.add("expand-footnote", "btn", "btn-icon", "no-text");
    button.innerHTML = iconHTML("ellipsis-h");
    button.dataset.footnoteId = footnoteRef
      .querySelector("a")
      .id.replace("footnote-ref-", "");

    footnoteRef.after(button);
  });

  if (footnoteRefs.length) {
    elem.classList.add("inline-footnotes");
  }
}

function clearPopper() {
  inlineFootnotePopper?.destroy();
  inlineFootnotePopper = null;
}

export default {
  name: "inline-footnotes",

  initialize(container) {
    if (!container.lookup("site-settings:main").display_footnotes_inline) {
      return;
    }

    withPluginApi("0.8.9", (api) => {
      api.decorateCookedElement((elem) => inlineFootnotes(elem), {
        onlyStream: true,
        id: "inline-footnotes",
      });

      api.cleanupStream(() => clearPopper);
    });

    const main = document.querySelector("#main");

    if (main) {
      main.addEventListener("click", showFootnote);
    }
  },

  teardown() {
    const main = document.querySelector("#main");

    if (main) {
      main.removeEventListener("click", showFootnote);
    }

    clearPopper();
  },
};
