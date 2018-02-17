module Jekyll
  class CodeBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      @tag = markup
      super
    end

    def render(context)
      content = super

      output = '<div class="my">'

      blocks = content.split("```\n")[0...-1]
      blocks.each do |block|
        output += block.strip.gsub(/```([a-z]*)/, "{% highlight \\1 %}") + '{% endhighlight %}'
      end

      output += '</div>'

      output = Liquid::Template.parse(output).render(context)
      output
    end
  end
end

Liquid::Template.register_tag("code_block", Jekyll::CodeBlock)