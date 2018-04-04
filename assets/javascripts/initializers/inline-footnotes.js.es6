import { withPluginApi } from 'discourse/lib/plugin-api';

function showFootnote() {
  let id = $(this).prev().find('a')[0].href;
  id = "#" + id.split('#')[1];
  let html = $(id).html();

  $('#footnote-tooltip').remove();

  let pos = $(this).position();

  let retina = window.devicePixelRatio && window.devicePixelRatio > 1 ? "class='retina'" : "";

  $(this).after("<div id='footnote-tooltip' " + retina + "><div class='footnote-tooltip-pointer'></div><div class='footnote-tooltip-content'>" + html + "</div></div>");

  $(window).on('click.footnote', (e) => {
    if ($(e.target).closest('#footnote-tooltip').length === 0) {
      $('#footnote-tooltip').remove();
      $(window).off('click.footnote');
    }
    return true;
  });


  let tooltip = $('#footnote-tooltip');

  let left = (pos.left - (tooltip.width() / 2) + $(this).width() + 6);
  if (left < 0) {
    $('#footnote-tooltip .footnote-tooltip-pointer').css({
      "margin-left": left*2 + "px"
    });
    left = 0;
  }

  // also do a right margin fix
  let topicWidth = $(this).closest('.topic-body').width();
  if (left + tooltip.width() > topicWidth) {
    let oldLeft = left;
    left = topicWidth - tooltip.width();

    $('#footnote-tooltip .footnote-tooltip-pointer').css({
      "margin-left": (oldLeft - left) * 2 + "px"
    });
  }

  tooltip.css({
    top: pos.top + 5 + "px",
    left: left + "px",
    visibility: 'visible'
  });

  return false;
}

function inlineFootnotes($elem) {

  if ($elem.hasClass('d-editor-preview')) {
    return;
  }

  $elem.find('sup.footnote-ref')
    .after('<button class="expand-footnote btn btn-icon no-text"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></btn>')
    .next()
    .on('click', showFootnote);

  $elem.addClass('inline-footnotes');
}


export default {
  name: 'inline-footnotes',

  initialize(container) {

    if (!container.lookup('site-settings:main').display_footnotes_inline) {
      return;
    }

    withPluginApi('0.8.9', api => {
      api.decorateCooked($elem => {
        inlineFootnotes($elem);
      });
    });
  }
};
