---
title: Hotwire & Personalised Content
pubDate: 2023-09-06 08:05:10
emoji: ⚡️
tags:
  - hotwire
  - turbo
  - ruby on rails
  - ruby
---

Here's an alternative approach to that which James Adam describes in [TIL: Turbo Stream and personalised content](https://goodenough.us/blog/2023-08-02-til-turbo-stream-and-personalised-content/).

To recap the problem: how do you personalise content when rendering from a WebSocket Turbo Stream? The rendering is not in the context of a request, so customisations based on objects like `current_user` will fail. For example, consider a chat app where messages should display the author name or "You" when viewing your own messages:

```erb
<%# app/views/messages/_message.html.erb %>
<article id="<%= dom_id(message) %>">
  <%= current_user == message.author ? "You" : message.author.name %>:
  <%= message.body %>
</article>
```

James's solution is to flag potential customisations in the partial with data attributes, and then conditionally update them using a Stimulus controller.

We faced the same issue a while back with [Pusher](https://pusher.com/) (pre-Hotwire and pre-Action Cable), and my colleague, Sam Oliver, suggested an approach that works around the WebSocket rendering limitation. Here's how that idea might look with with Hotwire/Turbo.

## Rendering via Requests

Instead of using the WebSocket Turbo Stream to append newly created messages directly, we'll use it to instruct each client to make an HTTP request to `messages#show`. The response will be a Turbo Stream that appends the new message. The partial renderer now has access to a user-specific request, and can make personalisations as needed.

First, we'll create our [custom Turbo Stream action](https://turbo.hotwired.dev/handbook/streams#custom-actions). It includes the `fetch` action attribute and the URL to fetch<sup><a href="#fn1" id="r1">[1]</a></sup>.

```erb
<%# app/views/application/_fetch.turbo_stream.erb %>
<turbo-stream action="fetch" url="<%= url_for(url) %>"></turbo-stream>
```

The custom action JavaScript below creates a link with the given `url` attribute. This link includes a `data-turbo-stream` attribute to trigger a Turbo Stream response. It's appended to the body, programmatically clicked, then removed.

```js
// app/javascript/application.js
import { Turbo } from '@hotwired/turbo'

// <turbo-stream action="fetch" url="/messages/1"></turbo-stream>
Turbo.StreamActions.fetch = function () {
  const fetcher = document.createElement('a')
  fetcher.href = this.getAttribute('url')
  fetcher.dataset.turboStream = true
  document.body.appendChild(fetcher)
  fetcher.click()
  document.body.removeChild(fetcher)
}
// …
```

Next, we'll update the model to broadcast the custom `fetch` action:

```rb
class Message < ApplicationRecord
  after_create_commit -> {
    broadcast_render_to(:messages, partial: "fetch", locals: {url: self})
  }
  # …
end
```

Finally, we'll add a `messages#show` action that appends the message:

```rb
class MessagesController < ApplicationController
  def show
    @message = Message.find(params[:id])
    # authorize current_user can read message
  end
  # …
end
```

```erb
<%# app/views/messages/show.turbo_stream.erb %>
<%= turbo_stream.append :messages, render(@message) %>
```

To summarise this flow:

1. A user sends a message
2. A custom WebSocket Turbo Stream `fetch` action is transmitted to all connected clients
3. This action instructs each client to make a Turbo Stream HTTP request to the given message URL
4. The response appends the message partial using `turbo_stream.append`

In this way, there's no need to duplicate rendering logic in a Stimulus controller; all personalisation is declared in the message partial.

## Downsides

The main downside is that it incurs additional HTTP round-trips. To the sender of the message, it might feel a little laggy. In our own Pusher-based app, we append the user's message via the `messages#create` response, and only stream the fetch action to the recipient<sup><a href="#fn2" id="r2">[2]</a></sup>, which helps it feel snappier. The delay in appending the message could be remedied in other ways, e.g. with improved loading feedback, or even an optimistic update, whereby the message is provisionally appended on the client and then updated.

These additional requests will also impact the load on the server. For most cases, this probably won't be a problem, but at larger scales with many connected users, this might be a consideration.

---

<p id="fn1" class="text-fl-sm"><a class=" after:content-['⤴']" href="#r1">[1]</a> Using <a href="https://api.rubyonrails.org/classes/ActionDispatch/Routing/UrlFor.html#method-i-url_for"><code>url_for</code></a> means <code>url</code> can be either a string or Active Record object (or any other object that <code>url_for</code> supports). It’s particularly useful in our case as we can generate a URL for the newly created <code>Message</code> in our model, without having to call a URL helper.</p>

<p id="fn2" class="text-fl-sm"><a class=" after:content-['⤴']" href="#r2">[2]</a> Pusher has a feature that can filter out user-sent events, so the fetch event is not broadcast to the user and therefore the message does not get appended twice.</p>
