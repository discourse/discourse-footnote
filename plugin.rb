# frozen_string_literal: true
# transpile_js: true
# name: discourse-footnote
# about: Adds markdown.it footnote support to Discourse
# version: 0.2
# authors: Sam Saffron, Vitaly Puzrin
# url: https://github.com/discourse/discourse-footnote

after_initialize do
  AdminDashboardData.add_problem_check do
    I18n.t(
      "The discourse-footnote plugin has been integrated into discourse core. Please remove the plugin from your app.yml and rebuild your container.",
    )
  end
end
