import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => opts.features["footnote"] = true);

export function setup(helper) {

  helper.whiteList([
    'ol.footnotes-list',
    'hr.footnotes-sep',
    'li.footnote-item',
    'a.footnote-backref',
    'sup.footnote-ref'
  ]);


  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === 'a' || tag === 'li') && name === 'id') {
        return !!value.match(/^fn(ref)?\d+$/);
      }
    }
  });

  helper.registerPlugin(window.markdownitFootnote);
}
