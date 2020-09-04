export function setup(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["footnotes"] = !!siteSettings.enable_markdown_footnotes;
  });

  helper.whiteList([
    "ol.footnotes-list",
    "hr.footnotes-sep",
    "li.footnote-item",
    "a.footnote-backref",
    "sup.footnote-ref",
  ]);

  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "a" || tag === "li") && name === "id") {
        return !!value.match(/^fn(ref)?\d+$/);
      }
    },
  });

  helper.registerPlugin(window.markdownitFootnote);
}
