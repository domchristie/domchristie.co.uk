---
title: Component Partials in Rails
description: A summary of my talk at Brighton Ruby meetup
pubDate: 2025-04-03 14:40:39
emoji: 🛤️
tags:
  - ruby on rails
  - ruby
  - partials
  - brighton ruby
---

I presented some thoughts about Rails partials at April's [Brighton Ruby meetup](https://www.meetup.com/brighton-ruby-group/).

The first half discussed various ways to render partials and collections of objects, including using `to_partial_path`. An example might be rendering a dynamic navigation bar where the navigation items differ depending on the user's role, e.g. if they're logged in, or paid, etc. We can create a plain old Ruby object with a `to_partial_path` method that returns the path of the partial to render. That class can include all the necessary logic, keeping the partial relatively clean:

```rb
# app/helpers/navigations_helper.rb
module NavigationsHelper
  def navigation(user)
    Navigation.new(user)
  end

  class Navigation
    def initialize(user)
      @user = user
    end

    def to_partial_path = "navigations/navigation"

    # decides which items to show based on user
    def items
      [Item.new("Home", root_path), …]
    end

    class Item
      #…
      def to_partial_path = "navigations/item"
    end
  end
end
```

```erb
<%# app/views/navigations/_navigation.html.erb %>
<nav>
  <ul>
    <%= render navigation.items %>
  </ul>
</nav>
```

Our call to render the navigation is also tidy:

```erb
<%# app/views/layouts/application.html.erb %>
<%= render navigation(current_user) %>
```

---

The second half of the talk demonstrated a derivation of a slotted partial system in around 20 lines-of-code:

```rb
module PartialsHelper
  def component_partial
    Partial.new(self)
  end

  class Partial
    def initialize(view_context)
      @view_context = view_context
      @contents = Hash.new { |h, k| h[k] = ActiveSupport::SafeBuffer.new }
    end

    def content_for(name, content = nil, &block)
      if content || block
        content = @view_context.capture(&block) if block
        @contents[name] << content.to_s
        nil
      else
        @contents[name].presence
      end
    end
  end
end
```

With usage as follows:

```erb
<%# app/views/components/_card.html.erb %>
<% yield partial = component_partial %>

<article>
  <div class="…">
    <%= partial.content_for(:image) %>
  </div>

  <h2><%= partial.content_for(:heading) %></h2>

  <div class="…">
    <%= partial.content_for(:description) %>
  </div>
</article>
```

```erb
<%# app/views/products/_product.html.erb %>

<%= render "card" do |partial| %>
  <% partial.content_for :image do %>
    <%= image_tag product.image %>
  <% end %>

  <% partial.content_for :heading, product.name %>

  <% partial.content_for :description do %>
    <%= simple_format product.description %>
  <% end %>
<% end %>
```

This pattern forms the basis of the [nice_partials gem](https://github.com/bullet-train-co/nice_partials), which includes a ton of extra niceties.
