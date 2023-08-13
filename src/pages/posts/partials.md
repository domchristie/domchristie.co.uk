---
title: Partials
pubDate: 2022-11-17 11:41:29
emoji: ✂️
tags:
  - partials
  - ruby on rails
  - ruby
---

Counterarguments to [Joel Drapper's thoughts on Rails Partials](https://twitter.com/joeldrapper/status/1592826867027161088?cxt=HHwWgMDR3ZXm7ZosAAAA). Joel's points are quoted in <i>italics</i>.

## Leakiness

<q>[Partials are] leaky — instance variables are implicitly shared with all other views and the controller.</q>

I don't think this is _that_ bad. Controller instance variables are basically template globals, and just as general wisdom advises to "avoid globals", we can solve this with a simple design rule: _don't use instance variables in partials_.

## View Logic

<q>it’s difficult to create partials that encapsulate view logic — they’re like a procedural script with no clear way to extract methods, attributes and calculations.</q>

Borrowing from the design of Svelte and [Astro components](https://github.com/domchristie/domchristie.co.uk/tree/3cb385569f38c5ef2d11a67d0c419835839f0090/src/components), I like to run a bit of embedded Ruby setup at the top, then include the markup below. It is procedural, but if the setup becomes unwieldy, then it might be time to refactor (perhaps with view models/presenters). Most my setup code is destructuring locals and setting defaults, so Rails 7.1's strict locals (see [Interface](#interface) below), combined with [Ruby's new destructuring capabilities](https://domchristie.co.uk/posts/destructuring-js-ruby/), will result in some pretty tidy code.

## Inheritance & Composition

<q>there’s no inheritance or ability to share concerns between different partials without hitting the leaky problem again.</q>

<q>It's one-partial-per-file, so you can’t break a partial down into related parts and use composition.</q>

Partials can render other partials, providing both inheritence and composition. For example a domain partial, `_post.html.erb` could render a low-level `_card.html.erb` (inheritence), and include `_date.html.erb` (composition).

```erb
<%# _card.html.erb %>
<article>
  <img src="<%= image_url %>">
  <h2><%= heading %><h2>
  <%= yield %>
</article>

<%# _date.html.erb %>
<time datetime="<%= date.to_fs(:iso8601) %>">
  <%= date.to_fs(:short) %>
</time>

<%# _post.html.erb %>
<%= render "card", heading: post.title, image_url: post.image_url do %>
  <%= render "date", date: post.published_at %>
  by <%= post.author %>
<% end %>
```

## Interface

<q>Partials never had a way to define an explicit interface or default “assigns” — I think this might be possible with “strict locals” now, but magic comments are far from ideal and they’re **yet another syntax to learn.**</q>

[Rails 7.1's strict locals](https://edgeguides.rubyonrails.org/action_view_overview.html#strict-locals) are a pragmatic solution to this and the syntax isn't hard to learn (see below). I'd argue that learning to adapt partials is easier than learning the principles and syntax of another view library.

```erb
<%# locals: (message: "Hello, world!") -%>
<%= message %>
```

## Slots

<q>Partials don’t have slots. You can yield exactly one block into them.</q>

It's relatively straightforward to augment partials to support multiple slots by passing in an object to a partial's `yield`. This is effectively what [nice_partials](https://github.com/bullet-train-co/nice_partials) does, but it's also possible to roll your own solution in around 30 lines-of-code. (I'll share this snippet at some point.)</q>

## Conclusion

Your mileage may vary, but for the apps I've worked on, partials feel like a good fit. They may have been misused in the past, but with a few conventions and enhancements, they can be a really powerful tool for composing templates. I do wish they were a little faster, and were easier to test, but perhaps I just need to dig a bit deeper into caching and view testing.
