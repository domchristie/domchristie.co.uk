---
title: UI Context and Rails Variants
pubDate: 2023-09-07 08:35:52
emoji: 🛤️
tags:
  - ruby on rails
  - ruby
  - ui
---

This is a follow-up to [Scoping Rails Controllers by UI Context](/posts/scoping-controllers-by-ui-context/), where I suggested a controller architecture for handling the same action in multiple contexts.

For example, in Apple's iOS Mail app, you can delete a message in at least 3 different places: when reading the message itself, by swiping in a list, or deleting via a context menu. In each case, the code to delete the message might be the same, but the visual response differs.

The previous post suggested a 1:1 mapping between routes and controller actions to handle each case, scoped by the UI context:

- `DELETE /messages/:id => messages#destroy` (default case)
- `DELETE /list_items/messages/:id => list_items/messages#destroy`
- `DELETE /context_menus/messages/:id => context_menus/messages#destroy`

The deletion code could be shared through inheritance or composition, but the responses would vary.

## Variants

After I shared this on [Kasper's Discord](http://discord.gg/NNN3TAD5jQ), [Kasper](https://ruby.social/@kaspth) suggested an approach using variants. Rather than a 1:1 mapping of routes to controller actions, Kasper suggested mapping different routes to a single controller action, and switching the response based on the variant. The variant could be sent as a default param and set in the controller. For example, the routes might look as follows:

```rb
# config/routes.rb
Rails.application.routes.draw do
  resources :messages

  scope :list_items, as: :list_items, defaults: {variant: :list_items} do
    resources :messages
  end

  scope :context_menus, as: :context_menus, defaults: {variant: :context_menus} do
    resources :messages
  end
  # …
end
# (Yes, there is repetition here, which could be cleaned up)
```

With this in place, we have the following routes that all map to `messages#destroy`, but each has a different `params[:variant]`.

- `DELETE /messages/:id => messages#destroy`
- `DELETE /list_items/messages/:id => messages#destroy`
- `DELETE /context_menus/messages/:id => messages#destroy`

The request variant could then be set as follows:

```rb
class ApplicationController < ActionController::Base
  before_action :set_variant

  VARIANTS = [:list_items, :context_menus]

  def set_variant
    request.variant << params[:variant].to_sym if params[:variant].in?(VARIANTS)
  end
  # …
end
```

From here we can customise our responses. We could do this via templates or via a `respond_to` call:

```rb
class MessagesController < ApplicationController
  def destroy
    @message = Message.find(params[:id])
    @message.destroy!

    respond_to do |format|
      format.turbo_stream.none {…}
      format.turbo_stream.list_items {…}
      format.turbo_stream.context_menus {…}
    end
  end
  # …
end
```

---

Overall, I really like the variants approach. Routing different paths to a single controller action feels cleaner and more manageable. I think the only downside is if we needed additional device-specific variants i.e. if we also wanted to render a different context menu on desktop vs mobile, it might be tricky.
