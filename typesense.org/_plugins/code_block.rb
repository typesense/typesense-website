module Jekyll
  class CodeBlock < Liquid::Block
    def initialize(tag_name, label, tokens)
      @label = label.strip
      super
    end

    def render(context)
      content = super
      blocks = content.split(/```$/)[0...-1]

      num_blocks = blocks.length
      output = "<ul class=\"nav nav-tabs mb-#{num_blocks}\" role=\"tablist\">"

      # First construct the tabbed navigation
      blocks.each_with_index do |block, index|
        lang = block.strip.scan(/```([a-z]*)/).first.first
        lang_proper = lang.capitalize
        active_class = if index == 0 then " active" else "" end
        is_selected = if index == 0 then "true" else "false" end

        output += '<li class="nav-item">'
        output += "<a class=\"nav-link#{active_class}\" id=\"#{@label}-#{lang}-tab\" data-toggle=\"tab\" href=\"##{@label}-#{lang}\" \
                      role=\"tab\" aria-controls=\"#{@label}-#{lang}\" aria-selected=\"#{is_selected}\">#{lang_proper}</a>\
                   </li>"
      end

      output += "</ul>"

      output += '<div class="tab-content">'

      blocks.each_with_index do |block, index|
        block = block.strip
        lang = block.scan(/```([a-z]*)/).first.first
        lang_proper = lang.capitalize
        active_class = if index == 0 then " active" else "" end

        lines = block.split("\n")
        num_leading_spaces = lines[1][/\A */].size
        new_lines = []
        lines.each_with_index do |line, index|
            if index != 0
                new_lines.push("#{line[num_leading_spaces..-1]}")
            else
                new_lines.push(line)
            end
        end

        block = new_lines.join("\n")

        output += "<div class=\"tab-pane fade show#{active_class}\" id=\"#{@label}-#{lang}\" role=\"tabpanel\" aria-labelledby=\"#{@label}-#{lang}-tab\">"
        output += block.gsub(/```([a-z]*)/, "{% highlight \\1 %}") + '{% endhighlight %}'
        output += "</div>"
      end

      output += '</div>'

      output = Liquid::Template.parse(output).render(context)
      output
    end
  end
end

Liquid::Template.register_tag("code_block", Jekyll::CodeBlock)