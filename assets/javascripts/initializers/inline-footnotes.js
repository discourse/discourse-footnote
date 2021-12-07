import { createPopper } from "@popperjs/core";
import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

let inlineFootnotePopper;

function applyInlineFootnotes(elem) {
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

function buildTooltip() {
  let html = `
    <div id="footnote-tooltip" role="tooltip">
      <div class="footnote-tooltip-content"></div>
      <div id="arrow" data-popper-arrow></div>
    </div>
  `;

  let template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function footNoteEventHandler(event) {
  inlineFootnotePopper?.destroy();

  const tooltip = document.getElementById("footnote-tooltip");

  // reset state by hidding tooltip, it handles "click outside"
  // allowing to hide the tooltip when you click anywhere else
  if (tooltip) {
    tooltip.removeAttribute("data-show");
  }

  // if we didn't actually click a footnote button, exit early
  if (!event.target.classList.contains("expand-footnote")) {
    return;
  }

  // append footnote to tooltip body
  const button = event.target;
  const cooked = button.closest(".cooked");
  const footnoteId = button.dataset.footnoteId;
  const footnoteContent = tooltip.querySelector(".footnote-tooltip-content");
  const newContent = cooked.querySelector(`#footnote-${footnoteId}`);
  footnoteContent.innerHTML = newContent.innerHTML;

  // remove backref from tooltip
  const backRef = footnoteContent.querySelector(".footnote-backref");
  backRef.parentNode.removeChild(backRef);

  // display tooltip
  tooltip.dataset.show = "";

  // setup popper
  inlineFootnotePopper?.destroy();
  inlineFootnotePopper = createPopper(button, tooltip, {
    modifiers: [
      {
        name: "arrow",
        options: { element: tooltip.querySelector("#arrow") },
      },
      {
        name: "offset",
        options: {
          offset: [0, 12],
        },
      },
    ],
  });
}

export default {
  name: "inline-footnotes",

  initialize(container) {
    if (!container.lookup("site-settings:main").display_footnotes_inline) {
      return;
    }

    document.documentElement.append(buildTooltip());

    window.addEventListener("click", footNoteEventHandler);

    withPluginApi("0.8.9", (api) => {
      api.decorateCookedElement((elem) => applyInlineFootnotes(elem), {
        onlyStream: true,
        id: "inline-footnotes",
      });
    });
  },

  teardown() {
    inlineFootnotePopper?.destroy();
    window.removeEventListener("click", footNoteEventHandler);
    document.getElementById("footnote-tooltip")?.remove();
  },
};
