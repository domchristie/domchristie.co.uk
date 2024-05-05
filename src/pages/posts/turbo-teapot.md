---
title: Turbo Teapot
description: A reasonably legitimate use of HTTP Status 418, to work around Turbo's rendering limitation
pubDate: 2024-05-05 14:38:50
emoji: 🫖
tags:
  - turbo
  - hotwire
  - ruby on rails
  - i'm a teapot
---

You probably shouldn't do this, but I've been upgrading an app from Turbolinks to Turbo, and there are a number of controller actions that `render` successful responses after form submissions. Turbo expects the server to return an HTTP `303 See Other` response in these cases, so returning `2xx` won't render anything. However, Turbo does render error responses (`4xx` and `5xx`).

The HTTP status `418 I'm a teapot` April Fools' joke, so it's basically nonsense, but we can use it as a temporary workround for Turbo's requirements. For example:

```rb
class PostsController < ApplicationController
  def create
    if @post = Post.create(post_params)
      render status: (request.format.turbo_stream? ? 418 : :created)
    else
      render :new, status: :unprocessable_entity
    end
  end
end
```

My colleague Sam Oliver suggested wrapping this up in a patch, which ended up looking like this:

```rb
# lib/render_418_for_turbo.rb
module Render418ForTurbo
  def render(*args)
    message = "[Render418ForTurbo]: Responding with 418 status to work around Turbo's rendering limitation."

    if !request.get? && request.format.turbo_stream?
      if options = args.find { |arg| arg.is_a?(Hash) }
        unless options[:status]
          puts message # or my_logger.info message
          options[:status] = 418
        end
      else
        puts message # or my_logger.info message
        args.push(status: 418)
      end
    end

    super
  end
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  prepend Render418ForTurbo
end
```

This patch adds a `418` statuses for non-`GET` requests that were made via Turbo. It will only add the status if a status is not present, and will log the override.
