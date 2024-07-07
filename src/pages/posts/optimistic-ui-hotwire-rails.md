---
title: Optimistic UI with Ruby on Rails & Hotwire
description: A proof-of-concept for optimistic UI with Hotwire and Rails
pubDate: 2024-07-07 14:53:50
emoji: 🤞
tags:
  - hotwire
  - ruby
  - ruby on rails
---

_This post details a proof-of-concept for optimistic UI. If you want to just browse the source, check out the [optimistic-ui-hotwire-rails GitHub repository](https://github.com/domchristie/optimistic-ui-hotwire-rails)_.

<blockquote><p>Optimistic UI enhances perceived speed and responsiveness by immediately updating the UI with an expected state before the server's response is received. This approach is used when the application can predict the outcome of an action based on context and user input, allowing for an immediate response to actions.</p>
<cite><a href="https://remix.run/docs/en/main/discussion/pending-ui">Pending and Optimistic UI</a> on the Remix Docs</cite></blockquote>

Optimistic UI is tricky for apps that predominantly render their HTML on the server. However, in simple cases where we can reasonably predict the outcome of a user action, we can achieve a [Good Enough](https://www.youtube.com/watch?t=701&v=SWEts0rlezA)™️ experience.

The Hotwire example below takes the follow approach:

1. Pre-render the HTML with placeholders for content
2. When a form is submitted, replace the placeholders with real content
3. Use Turbo Stream Actions to insert the new HTML
4. The server re-renders the page, displaying the persisted comment

## Optimistic Comments

Let's create a basic form that lets users submit a comment. Our `comments/index.html.erb` template might look like:

```erb
<%= turbo_refreshes_with scroll: :preserve %>

<%= form_with model: @comment do |form| %>
  <%= form.text_field :body, autofocus: true %>
  <%= form.submit "Send" %>
<% end %>

<div id="comments">
  <%= render @comments %>
</div>
```

… backed by a controller:

```ruby
class CommentsController < ApplicationController
  def index
    @comment = Comment.new
    @comments = Comment.all.order(created_at: :desc)
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.save
    redirect_back_or_to comments_path
  end

  private

  def comment_params
    params.require(:comment).permit(:body)
  end
end
```

And finally our `comments/_comment.html.erb` partial:

```erb
<article>
  <div class="comment-body">
    <div class="bubble">
      <%= simple_format comment.body %>
    </div>
  </div>

  <footer>
    <%= comment.created_at.to_fs(:short) %>
  </footer>
</article>
```

We're now ready to get optimistic. Our optimistic UI will prepend a new comment immediately, before the server responds and updates the page. But first, we need to refactor `comments/_comment.html.erb` so that it can be pre-rendered with placeholders.

## A Reusable Comment Partial

Our current `_comment.html.erb` partial depends on a `Comment` instance, but for the pre-rendering stage, we don't have one. We could create a dummy `Comment` object that contains placeholders for the body and footer, but I've found it useful to layer up partials like so:

```erb
<%# app/views/application/_comment.html.erb %>
<article>
  <div class="comment-body">
    <div class="bubble">
      <%= body %>
    </div>
  </div>

  <footer>
    <%= footer %>
  </footer>
</article>
```

```erb
<%# app/views/comments/_comment.html.erb %>
<%= render "application/comment", {
  body: simple_format(comment.body),
  footer: comment.created_at.to_fs(:short)
} %>
```

In this way, you have a reusable `application/_comment.html.erb` partial that can be used in any context—whether it's rendered with a `Comment` or not.
_Note: I've used local variables here, but you may wish to use a library that supports slots, like [nice_partials](https://github.com/bullet-train-co/nice_partials) or [ViewComponent](https://viewcomponent.org/)._

## Pre-rendering with Placeholders

Returning to our comment form, we can now pre-render a comment and set out how it will be inserted with a Turbo Stream Action.

Our optimistic comment will simply display "Sending…" in the footer. The body will be dynamic, populated with the value of the form's `comment[body]` input. We'll hook this up later in our Stimulus controller.

```erb
<%# `app/views/comments/index.html.erb` %>
<%# … %>
<%= form_with model: @comment, data: {controller: "optimistic-form", action: "optimistic-form#performActions"} do |form| %>
  <%= form.text_field :body, autofocus: true %>
  <%= form.submit "Send" %>

  <template data-optimistic-form-target="actions">
    <%= turbo_stream.prepend "comments", partial: "application/comment", locals: {
      body: "${params['comment[body]']}",
      footer: "Sending…"
    } %>
  </template>
<% end %>
```

We render a Turbo Stream Action that prepends the pre-rendered comment. It's wrapped in a `<template>` element so it isn't executed immediately. In this case, we're only performing a single action, but this template can contain multiple Turbo Stream Actions if needed.

Our form is controlled by an `optimistic-form` Stimulus controller, which we'll set up next. On submit, we call `optimistic-form#performActions` which activates the actions in the template.

Finally, we set the `body` and `footer` locals. The `body` uses JavaScript template literal placeholder syntax (`${}`). This is important as it will allow us to dynamically insert the form's `comment[body]` value.

## Stimulus Controller

With all this in place, our Stimulus controller just needs to fill the pre-rendered comment with the form's content, then activate the Turbo Stream Action.

```js
// app/javascript/controllers/optimistic_form_controller.js
import { Controller } from '@hotwired/stimulus'
import { fill, escape, raw } from '@domchristie/composite'

export default class OptimisticFormController extends Controller {
  static targets = ['actions']

  async performActions () {
    this.element.insertAdjacentHTML(
      'beforeend',
      fill(this.actionsTarget, { params: this.params })
    )
  }

  get params () {
    return Object.fromEntries(new FormData(this.element))
  }
}
```

[@domchristie/composite](https://github.com/domchristie/composite) is a tiny library that takes a `<template>`, converts its content to a template literal, and fills the placeholders with the given data. Here, we create the data from the form's `FormData`, and pass it to Composite's `fill` function as `params`. The comment body is contained in a field named `comment[body]`, so we can reference it as `params['comment[body]']`.

Finally, we can activate the Turbo Stream Actions by appending them to the form using `insertAdjacentHTML`.

## Comment Formatting

This works, but the comment body is not formatted like that in `comments/_comment.html.erb` which uses Rails' `simple_format`. So when the page is replaced with the server-rendered version, the change might be jarring.

We can fix this by [porting Rails' `simple_format` helper to JavaScript](https://gist.github.com/kares/740162). (Thanks [Karol Bucek](https://github.com/kares)!), and providing access to it in the pre-rendered template, via the controller. Note that we're passing in the controller (`this`) into the `fill` function to make it available. We'll use Composite's `escape` and `raw` functions to help with this.

```js
// app/javascript/controllers/optimistic_form_controller.js
import { Controller } from '@hotwired/stimulus'
import { fill, escape, raw } from '@domchristie/composite'

export default class OptimisticFormController extends Controller {
  static targets = ['actions']

  async performActions () {
    this.element.insertAdjacentHTML(
      'beforeend',
      fill(this.actionsTarget, {
        params: this.params,
        controller: this
      })
    )
  }

  get params () {
    return Object.fromEntries(new FormData(this.element))
  }

  simpleFormat (text) {
    text = escape(text)
    text = text
      .replace(/\r\n?/g, '\n')
      .replace(/\n\n+/g, '</p>\n\n<p>')
      .replace(/([^\n]\n)(?=[^\n])/g, '$1<br/>')
    return raw(`<p>${text}</p>`)
  }
}
```

Now we can access the `controller` in our template, and call `controller.simpleFormat`:

```erb
<%# `app/views/comments/index.html.erb` %>
<%# … %>
<%= form_with model: @comment, … do |form| %>
  <%# … %>
  <template data-optimistic-form-target="actions">
    <%= turbo_stream.prepend "comments", partial: "application/comment", locals: {
      body: "${controller.simpleFormat(params['comment[body]'])}",
      footer: "Sending…"
    } %>
  </template>
<% end %>
```

## Styling Optimistic Comments

To communicate whether a comment is optimistic or persisted, we can add a `data-optimistic` attribute to the comment, allowing us to style it accordingly.

```erb
<%# `app/views/application/_comment.html.erb` %>
<article <%= "data-optimistic" if local_assigns[:optimistic] %>>
  <div class="comment-body">
    <div class="bubble">
      <%= body %>
    </div>
  </div>

  <footer>
    <%= footer %>
  </footer>
</article>
```

```erb
<%# `app/views/comments/index.html.erb` %>
<%# … %>
<%= form_with model: @comment, … do |form| %>
  <%# … %>
  <template data-optimistic-form-target="actions">
    <%= turbo_stream.prepend "comments", partial: "application/comment", locals: {
      body: "${controller.simpleFormat(params['comment[body]'])}",
      footer: "Sending…",
      optimistic: true
    } %>
  </template>
<% end %>
```

```css
/* app/assets/stylesheets/application.css */
article[data-optimistic] .bubble {
  color: #666;
  border-color: #e6e6e6;
  background-color: #f9f9f9;
}
```

## The Final Result

<figure>
  <video controls src="/optimistic-ui.mov"></video>
</figure>

## Downsides

This approach works best with simple updates: simple components with straightforward markup, and minimal DOM operations—like adding a single comment. Rendering complex elements with dynamic content might be tricky.

If your optimistic component includes lots of logic, it probably won't work so well. If your update includes lots of DOM updates, it'll be hard to keep it in-sync with the server-rendered version. If your template uses lots of helpers (like `simple_format`), you may find yourself reimplementing each one in JavaScript. And finally, this currently relies on server-rendered error pages if things go wrong; probably fine if the device is online, but not great otherwise.

If optimistic UI is a crucial part of your experience and you begin to feel the issues above, then it might be worth exploring alternatives. [Mustache](http://mustache.github.io) offers a shared templating system, allowing you to render the same template in different languages. Alternatively you could implement your feature with a client-side framework.

## Conclusion

Optimistic UI can be achieved in server-rendered apps with Hotwire. By pre-rendering the UI on the client, filling its content with dynamic (form) data, and activating Turbo Stream Actions, we can get a _good enough_ experience without the complexity of a client-side framework.

However, this approach has its limitations. It works best for simple updates, and can be tricky to extend to more complex components. If you find yourself reimplementing lots of Rails helpers in JavaScript, or struggling to keep the client updates and server-rendered version in sync, it might be worth considering a different approach.
