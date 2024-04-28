---
title: Turbo & Progressive Enhancement
description: A tip on writing Hotwire code that feels right
pubDate: 2024-04-28 08:21:00
emoji: ⚡️
tags:
  - hotwire
  - turbo
  - ruby on rails
  - progressive enhancement
  - open-closed principle
  - sandi metz
---

Before jumping into composing Turbo Streams or wrapping elements in Turbo Frames, consider what the experience might be without any JavaScript or Hotwire. While a no-JS flow may not be commonly experienced, thinking in this way can lead to cleaner, more robust solutions.

Let's say we have a button that toggles a post's `publish` column, and we want to update the screen in-place. Our response could just return the user back to the page they were on, with the button updated:

```rb
class Post::PublishesController < ApplicationController
  def create
    post = Post.find(params[:post_id])
    post.publish!
    redirect_back_or_to post, status: :see_other
  end

  def destroy
    post = Post.find(params[:post_id])
    post.unpublish!
    redirect_back_or_to post, status: :see_other
  end
end
```

This would work without any JavaScript, but if the user had scrolled the page, their scroll position would be reset.

## Enhance!

The simplest enhancement is to maintain the user's scroll position by adding `<meta name="turbo-refresh-scroll" content="preserve">` to the `<head>`. We don't need to change any controller code, everything is handled by Turbo. What's more, if the UI augments over time and includes more elements that require dynamic updates (e.g. a published post count), we don't need to account for them in our response since the entire content is refreshed. (Compare with Turbo Stream actions that may require modification with each UI change.)

Next, if we need to preserve more of the UI state, we could morph the refresh by adding `<meta name="turbo-refresh-method" content="morph">` to the `<head>`.

A final benefit of this code is that it's usable in different contexts. `redirect_back_or_to` is really handy for these situations. We can create a publish toggle button on another page, point it to this controller, and it will work in the same way—again without having to add or change any controller code, or fiddle about with Turbo Stream actions.

---

Concepts demonstrated:

- [Open-closed principle](https://en.wikipedia.org/wiki/Open–closed_principle): our UI is open for extension without having to modify existing controller code
- Sandi Metz's <abbr title="Transparent, Reasonable, Useful, and Exemplary">TRUE</abbr> principles from [Practical Object-Oriented Design](https://sandimetz.com/products): our controller action is _Useful_ in different contexts
