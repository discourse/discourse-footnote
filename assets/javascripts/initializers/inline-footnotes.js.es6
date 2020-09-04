import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

function showFootnote() {
  let id = $(this).prev().find("a")[0].href;
  id = "#" + id.split("#")[1];
  let html = $(this).parents(".cooked").find(id).html();

  $("#footnote-tooltip").remove();

  let $elip = $(this);
  let $post = $elip.offsetParent();

  let pos = $elip.offset();
  let delta = $post.offset();

  pos.top -= delta.top;
  pos.left -= delta.left;

  let retina =
    window.devicePixelRatio && window.devicePixelRatio > 1
      ? "class='retina'"
      : "";

  $(this).after(
    "<div id='footnote-tooltip' " +
      retina +
      "><div class='footnote-tooltip-pointer'></div><div class='footnote-tooltip-content'>" +
      html +
      "</div></div>"
  );

  $(window).on("click.footnote", (e) => {
    if ($(e.target).closest("#footnote-tooltip").length === 0) {
      $("#footnote-tooltip").remove();
      $(window).off("click.footnote");
    }
    return true;
  });

  let $tooltip = $("#footnote-tooltip");
  $tooltip.css({ top: 0, left: 0 });

  let left = pos.left - $tooltip.width() / 2 + $elip.width() + 3;
  if (left < 0) {
    $("#footnote-tooltip .footnote-tooltip-pointer").css({
      "margin-left": left * 2 + "px",
    });
    left = 0;
  }

  // also do a right margin fix
  let topicWidth = $post.width();
  if (left + $tooltip.width() > topicWidth) {
    let oldLeft = left;
    left = topicWidth - $tooltip.width();

    $("#footnote-tooltip .footnote-tooltip-pointer").css({
      "margin-left": (oldLeft - left) * 2 + "px",
    });
  }

  $tooltip.css({
    top: pos.top + 5 + "px",
    left: left + "px",
    visibility: "visible",
  });

  return false;
}

function inlineFootnotes($elem) {
  if ($elem.hasClass("d-editor-preview")) {
    return;
  }

  $elem
    .find("sup.footnote-ref")
    .after(
      `<button class="expand-footnote btn btn-icon no-text">${iconHTML(
        "ellipsis-h"
      )}</btn>`
    )
    .next()
    .on("click", showFootnote);

  $elem.addClass("inline-footnotes");
}

export default {
  name: "inline-footnotes",

  initialize(container) {
    if (!container.lookup("site-settings:main").display_footnotes_inline) {
      return;
    }

    withPluginApi("0.8.9", (api) => {
      api.decorateCooked(
        ($elem) => {
          inlineFootnotes($elem);
        },
        { id: "inline-footnotes" }
      );
    });
  },
};
