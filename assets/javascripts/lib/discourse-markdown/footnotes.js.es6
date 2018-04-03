import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => opts.features["footnotes"] = true);

export function setup(helper) {

  helper.whiteList([
    'ol.footnotes-list',
    'hr.footnotes-sep',
    'li.footnot-item'
  ]);


  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === 'a' || tag === 'li') && name === 'id') {
        return value.indexOf("fn") === 0;
      }
    }
  });

  helper.registerPlugin(window.markdownitFootnote);

}
