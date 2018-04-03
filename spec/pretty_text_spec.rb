require 'rails_helper'

describe PrettyText do

  it "supports normal footnotes" do
    markdown = <<~MD
      Here is a footnote, [^1] and another. [^test]

      [^1] I am one

      [^test] I am one

       test multiline
    MD

    html = <<~HTML
    HTML

    cooked = PrettyText.cook markdown
    expect(cooked).to eq(html.strip)
  end

end
