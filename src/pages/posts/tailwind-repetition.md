---
title: Tailwind Repetition
description: Approaches to dealing with repetitive Tailwind CSS classes
pubDate: 2024-07-01 21:23:28
emoji: 🔁
tags:
  - tailwind
  - css
  - ruby on rails
---

The biggest complaint about Tailwind CSS is that it results in long, ugly lists of class names that are difficult to maintain, particularly if they're repeated.

This popped up again the other day, with the following example…
_[How do you usually avoid this in #tailwind? #rubyonrails](https://x.com/coorasse/status/1802628126742086010):_

```erb
<%= link_to "Home", "/", class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<%= link_to "Projects", "/projects", class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<%= link_to "Monitor", "/monitor", class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<%= link_to "Dashboard", "/dashboard", class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
```

With a traditional CSS approach, it'd be common to create a `.nav-link` class, and set the styles in a separate stylesheet. With Tailwind, this approach can be achieved with `@apply`:

```erb
<%= link_to "Home", "/", class: "nav-link" %>
<%= link_to "Projects", "/projects", class: "nav-link" %>
<%= link_to "Monitor", "/monitor", class: "nav-link" %>
<%= link_to "Dashboard", "/dashboard", class: "nav-link" %>
```

```css
/* application.css */
@layer components {
  .nav-link {
    @apply text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500;
  }
}
```

However, one of the key benefits of just using Tailwind's classes is you don't have to worry about naming things, or architecting and maintaining your own CSS files. With `@apply`, you end up dealing with those considerations.

So, if `@apply` isn't recommended, what are the other options?

One of my favourite hidden features of Tailwind is that the ugliness of the class names encourages you to think about how to improve the structure of view code. Here's an analysis of some of the options mentioned in that thread.

## Alternative Approaches

### 1. Do Nothing

If this is the only place these classes used, it might be preferable to leave it as-is. The styles may only change very rarely (or not at all), and so updating the list of classes isn't a maintenance burden. Most editors support multi-cursor editing to help with this.

If the styles do change frequently, and updates are beginning to hurt, then consider another approach, but just because it's repetitive and ugly, it doesn't necessarily mean it's hard to maintain. While it might seem unsightly, there's value in patiently waiting for a good abstraction to present itself; _now_ might not be the right time to shift things around. I'd rather deal with long lists of classes over untangling specificity issues in arbitrarily organised CSS files.

The benefit here is that there's no misdirection and no naming decisions. All the styles are there to be seen and updated. What's more, if one of the links requires custom styles, it's easy to break out of the standard styles for that exception.

### 2. Local Variable

```erb
<% classes = "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<%= link_to "Home", "/", class: classes %>
<%= link_to "Projects", "/projects", class: classes %>
<%= link_to "Monitor", "/monitor", class: classes %>
<%= link_to "Dashboard", "/dashboard", class: classes %>
```

This is a good first step to avoiding the repetition. It's clear, and breaking out of the standard styles would be easy. However, there's still a fair bit of repetition outside of the class names: `<%= link_to "…, "…", class: classes %>`. If we really felt the need to <abbr title="Don't Repeat Yourself">DRY</abbr> it up, we could do better.

In fact, it looks like the original example failed to include the `data-active` attribute, so in reality, an updated version might be:

```erb
<% classes = "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<%= link_to "Home", "/", class: classes, data: {active: current_page?("/")} %>
<%= link_to "Projects", "/projects", class: classes, data: {active: current_page?("/projects")} %>
<%= link_to "Monitor", "/monitor", class: classes, data: {active: current_page?("/monitor")} %>
<%= link_to "Dashboard", "/dashboard", class: classes, data: {active: current_page?("/dashboard")} %>
```

This looks similar to the `@apply` approach, but it keeps the classes in the same file as the markup. However, we've only reduce the repetition of the CSS classes. The `current_page?` check is still repetitive. Adding another link would require adding link text, a path, and ensuring the `active` logic is correct.

## 3. Loop

```erb
<% [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["Monitor", "/monitor"],
  ["Dashboard", "/dashboard"]
].each do |text, path| %>
  <%= link_to text, path, class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500", data: {active: current_page?(path)} %>
<% end %>
```

This really cleans up the repetition. The classes and active attributes are only stated once. Adding links is just a case of modifying the array. Breaking out of the styles could be achieved with another option, e.g.

```erb
<% [
  ["Home", "/", "text-black text-bold …"],
  ["Projects", "/projects"],
  ["Monitor", "/monitor"],
  ["Dashboard", "/dashboard"]
].each do |text, path, classes| %>
  <%= link_to text, path, class: classes || "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<% end %>
```

But the deeper benefit is that the code is beginning to reveal potential improvements for how to model the UI. The collection of values suggests thee presence of an underlying object.

If the navigation requirements were to become more complex, you might consider encapsulating these values in a class and rendering them as follows:

```rb
# app/models/navigation_item.rb
class NavigationItem
  attr_reader :path, :text

  def initialize(path, text)
    @path = path
    @text = text
  end

  def self.all
    [
      ["Home", "/"],
      ["Projects", "/projects"],
      ["Monitor", "/monitor"],
      ["Dashboard", "/dashboard"]
    ].map {|text, path| new(path, text) }
  end
end
```

```erb
<% NavigationItem.all.each do |item| %>
  <%= link_to item.text, item.path, class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" %>
<% end %>
```

Then if the markup becomes complex, move it to a partial. By setting [`to_partial_path`](https://api.rubyonrails.org/classes/ActiveModel/Conversion.html#method-i-to_partial_path) in the class, Rails can automatically lookup and render the partials:

```rb
class NavigationItem
  # …
  def to_partial_path
    "navigations/item"
  end
end
```

```erb
<%# app/views/navigations/_item.html.erb %>
<%= link_to item.path, class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500" do %>
  <%# … %>
  <%= item.text %>
<% end %>
```

```erb
<%= render NavigationItem.all %>
```

The downside is that you've had to name the concept. However, by this stage, the UI concept is concrete and the naming decision is clear. The HTML can still be written in `html+erb` files, and hopefully the styles are established enough to not need frequent updating.

The best feature of this approach, is that there are clear options as the code grows and becomes more complex. We've gone from looping over a bit of data, to looping over objects that represent the data, to partials that are automatically rendered.

## 4. Custom `link_to`

```erb
<%= nav_link_to "Home", "/" %>
<%= nav_link_to "Projects", "/projects" %>
<%= nav_link_to "Monitor", "/monitor" %>
<%= nav_link_to "Dashboard", "/dashboard" %>
```

```rb
module UiHelper
  def nav_link_to(text, path)
    link_to text, path, class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500", data: {active: current_page?(path)}
  end
end
```

This is a straightforward approach that encapsulates the markup with the variables passed in. It looks tidy, but I've found it can be problematic.

First, it looks like Rails' own `link_to`, so there might be an expectation that it mirrors that API, but it doesn't. Of course we could create an identical API that wraps `link_to` and adds the classes, but that adds complexity. If Rails extends its `link_to` API, our code should follow suit to avoid confusion.

Second, writing markup in helpers is awkward. Fine for a single element, but too many more and you end up `concat`ing strings, or calling `html_safe`. As such, this approach isn't really open to extension.

Finally, you have to choose how you organise your helpers. Should this live in `ApplicationHelper`? Should I create a new helper? `UiHelper`? `NavigationsHelper`? You immediately end up with the same naming and architecture problems that Tailwind aims to solve.

## 5. ActionView::Attributes

```erb
<%= link_to "Home", "/", ui.nav_link("/") %>
<%= link_to "Projects", "/projects", ui.nav_link("/projects") %>
<%= link_to "Monitor", "/monitor", ui.nav_link("/monitor") %>
<%= link_to "Dashboard", "/dashboard", ui.nav_link("/dashboard") %>
```

```rb
module UiHelper
  def ui
    @ui ||= Ui.new(self)
  end

  class Ui
    delegate_missing_to :@view_context

    def initialize(view_context)
      @view_context = view_context
    end

    def nav_link(path)
      tag.attributes class: "text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 data-[active=true]:bg-gray-500", data: {active: current_page?(path)}
    end
  end
end
```

The [ActionView::Attributes gem](https://github.com/seanpdoyle/action_view-attributes) adds enhances Rails' `tag.attributes` helper. It makes it easy to build collections of HTML attributes for sharing in various contexts and elements. It's really smart about how attributes are merged. For example:

```rb
tag.attributes(class: "text-bold").merge(class: "text-blue-700")
# outputs: "class='text-bold text-blue-700'", no clobbering!
```

You can think of this as _composition_. For example, we can apply a set of button attributes (`ui.button`) like so:

```erb
<%= link_to "Get Started", new_user_path, ui.button %>
<%= button_to "Like", likes_path, ui.button %>
<%= submit_tag "Join", ui.button %>
<%= form.submit "Update", ui.button %>
```

This is preferable to "button" component as it enables developers to use the familiar Rails APIs they're used to (`link_to`, `button_to`, etc.) while maintaining consistent styling and behaviours.

Components work best when they share both elements and attributes; composing attributes works best when the attributes are shared amongst various elements.

The downside here is that you have to architect your attributes in a separate file. As such, it's better suited to established APIs, when you're reasonable confident of the set of attributes and how they fit into the broader UI.

## Conclusion

The explicit repetitiveness of Tailwind's classes pushes developers to look for ways improve their code structure. Combining Tailwind classes into single compound classes (like `.nav-link`) only reduces HTML `class` repetition—not repetition in the HTML, and exploring other approaches may reveal better ways to model the user interface.

My first thought to tidy repetitive Tailwind classes was to use ActionView::Attributes. It's a flexible approach, and very good for sharing attributes amongst different elements. However, when examining the benefits of a loop, it's probably a better fit for the original problem. Its extensibility helps guide you towards a more structured approach to their UI, and provides options as the code grows.

However, I'd encourage developers to tolerate a level of messiness. Only commit to a lower-repetition approach when it hurts to maintain consistent styles. That way you have a better understanding of the problem and can make a more informed decision as to the best approach.

See also: [Adam Wathan's flowchart for deciding when to extract a component with `@apply`](https://x.com/adamwathan/status/1308944904786268161/photo/1).
