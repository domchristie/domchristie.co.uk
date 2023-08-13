---
title: Scoping Controllers by UI Context
pubDate: 2023-08-12 16:00:32
emoji: 🛤️
tags:
  - ruby on rails
  - ruby
  - ui
---

Rails' generators encourage developers to think about their controllers in terms of domain models. Running `rails generate resource Message …` will create the `Message` model along with a `MessagesController`. This setup works for simple cases, but when our user interfaces become more complex, trying to stuff all our actions into the `MessagesController` can lead to unmaintainable fat controllers.

## Example: Deleting in Different Contexts

Consider how we might model deleting a message in Apple's iOS Mail app. There are at least 3 ways to delete a single message:

1. Tapping the trash icon in the toolbar when viewing the message
2. Swiping on the message in a list
3. Long-pressing on the message in a list to bring up a context menu

<div class="grid gap-fl-xs grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
  <figure class="!m-0">
    <img src="/message-delete-show.PNG" width="563" height="200">
    <figcaption>
      Deleting a message when viewing it
    </figacaption>
  </figure>
  <figure class="!m-0">
    <img src="/message-delete-list-item.PNG" width="563" height="200">
    <figcaption>
      Deleting by swiping
    </figacaption>
  </figure>
  <figure class="!m-0">
    <img src="/message-delete-context-menu.PNG" width="563" height="200">
    <figcaption>
      Deleting via a context menu
    </figacaption>
  </figure>
</div>

Each case deletes a message, but the visual outcomes vary:
- when viewing the message, deleting removes the entire message, then displays the next message in the list
- swiping removes the list item in place
- deleting via the context menu hides the menu then removes the list item in place

Handling the first case is straightforward. We could display the trash button on our `show` view which destroys the record. Our `MessagesController#destroy` action could handle that:

```rb
class MessagesController < ApplicationController
  def index
    @messages = Message.all
  end

  def show
    @message = Message.find(params[:id])
  end

  def destroy
    @message = Message.find(params[:id])
    @message.destroy!
    redirect_to next_message || messages_path
  end

  private

  def next_message
    Message
      .where("created_at < ?", @message.created_at)
      .order(created_at: :desc)
      .first
  end
end
```

For the other cases, there are few approaches.

First, we might be tempted to reuse and expand our `destroy` action by switching the response based on the context. We could achieve this by setting a `context` param on our destroy form.

Alternatively we might choose to add further actions to our `MessagesController` (e.g.`destroy_in_list` or `destroy_in_context_menu`).

In my experience, these approaches lead to unsatisfactory solutions. Switch statements become unwieldy and hard to test, or view directories become filled with unconventional templates. Both feel messy.

## RESTful Nesting

When modelling user interfaces, I've found that sticking to [RESTful actions with nested controllers](http://jeromedalbert.com/how-dhh-organizes-his-rails-controllers/) works nicely, i.e. favouring `index`, `new`, `create`, `show`, `edit`, `update`, and `destroy` over custom actions, and nesting controllers in order to do so. This approach helps maintain a standard list of actions and templates and can aid with the discovery of other presentation objects.

When considering top-level naming, again, it's tempting to stick to domain object names, e.g. `Inboxes::MessagesController`, but this would not help us much in the example above. Messages in the inbox can be deleted in at least two ways: by swiping, as well as from the context menu, so we'd still need two `destroy` actions.

One approach I've been considering is scoping by UI context. For example we could add a `ListItems::MessagesController` and a `ContextMenus::MessagesController`. Each response could update the UI as required:

- `ListItems::MessagesController#destroy` could remove message list item
- `ContextMenus::MessagesController#destroy` could remove the context menu and message

```rb
# app/controllers/list_items/messages_controller.rb
class ListItems::MessagesController < ApplicationController
  def destroy
    @message = Message.find(params[:id])
    @message.destroy!

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to messages_path }
    end
  end
end
```

```rb
# app/controllers/context_menus/messages_controller.rb
class ContextMenus::MessagesController < ApplicationController
  def destroy
    @message = Message.find(params[:id])
    @message.destroy!

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to messages_path }
    end
  end
end
```

This feels nice for a couple of reasons.

First, you see a pattern emerge in these two actions—their code is identical. The only difference exists between the `turbo_stream` templates. Once we're confident that this pattern is is solid, we could extract it into a concern. The concern could even handle any `ActiveRecord` type by inferring the class and redirect-path from the controller name (see [Appendix](#appendix)).

Second, it paves the way for other resources to follow the same pattern. A top-level `ListItems` or `ContextMenus` namespace clarifies where subsequent controllers should live, and it's clearer than hiding a `context` parameter in a form, or implementing custom action names.

## Scope by UI Context or Domain Object?

Should it be `ListItems::MessagesController` or `Messages::ListItemsController`? For the deletion case, I prefer `ListItems::MessagesController`: we're destroying the message in the context of a list item, not the other way round. As mentioned above, it also clarifies the organisation for future list item controls.

However, for actions such as `index` and `show`, it doesn't work quite so well. For example, let's say we wanted an endpoint to render a context menu in a Turbo Frame, and we used `ContextMenus::MessagesController#show` to do so. This organisation communicates that this action _shows a message in the context of a list item_. As we're showing a context menu with a list of actions, this framing is a bit of a stretch. `Messages::ContextMenusController#show` might be preferrable in this case, or we could add another layer of nesting: `ContextMenus::Messages::ActionsController#index`.

It's still early days with this approach. I think I still prefer `ContextMenus::MessagesController#show`, and deal with how it might be a bit of a stretch, but I'll see how it goes…

---

Finally, for UI context naming inspiration, check out [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/), particularly [Menus and Actions](https://developer.apple.com/design/human-interface-guidelines/menus-and-actions)

---

## Appendix

A `Destroyable` controller concern with a `destroy` action that destroys a record and renders a corresponding `turbo_stream` or redirects.

```rb
# app/controllers/concerns/destroyable.rb
module Destroyable
  extend ActiveSupport::Concern

  def destroy
    @resource = resource_class.find(params[:id])
    @resource.destroy!

    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to send(fallback_path) }
    end
  end

  private

  def resource_class
    controller_name.classify
  end

  def fallback_path
    "#{controller_name}_path"
  end
end
```
