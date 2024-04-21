---
title: Turbo Refreshes, Frames, and Streams
description: A guide for when to use each Turbo feature
pubDate: 2024-04-21 10:15:00
emoji: ⚡️
tags:
  - hotwire
  - turbo
  - ruby on rails
---

A guide for when to use each Turbo feature.

<figure>
  <img src="/turbo-streams-frames-refreshes.png" alt="A flow diagram containing the considerations for when to use each Turbo feature. To summarise: if the page response only makes a small number of changes, use Turbo Streams; otherwise, if the response updates a distinct area of the page, use Turbo Frames; otherwise, use a Turbo Refresh. If the update requires that lots of UI state is to be kept (e.g. live input values), use a Morph refresh, otherwise a plain Replace Refresh will do.">
</figure>

## Turbo Refreshes

Turbo Refreshes update the entire current page in place while keeping some UI state e.g. the page's scroll position. This might seem like overkill in some cases and they're slower that Turbo Streams, but they can really simplify response code (and the performance hit may not matter anyway).

Refreshes let you customise whether the page's scroll position is reset or preserved, and/or whether the page's content is replaced or "morphed". The simplest refresh enhancement just maintains the scroll position and replaces the content:

```erb
<%# With Ruby on Rails %>
<%= turbo_refreshes_with scroll: :preserve %>

<%# or with plain HTML in the <head> %>
<meta name="turbo-refresh-scroll" content="preserve">
```

### Morphs

For advanced cases you can also "morph" the page's content. This updates only the elements that have changed, leaving the rest untouched. Morphing is useful when you need to maintain UI state such as the content of input fields, element scroll positions, or if you're remotely updating another connected client via a broadcasted (Web Socket) Turbo Stream.

```erb
<%# With Ruby on Rails %>
<%= turbo_refreshes_with scroll: :preserve, method: :morph %>

<%# or with plain HTML in the <head> %>
<meta name="turbo-refresh-scroll" content="preserve">
<meta name="turbo-refresh-method" content="morph">
```

**Note**: Morphs can reset elements to their server state, reverting changes that have been made locally. Fixing these issues may require knowledge of DOM-diffing algorithms. [`data-turbo-permanent`](https://turbo.hotwired.dev/handbook/page_refreshes#exclude-sections-from-morphing) provides a solution to opt-out of morphing for those elements, but dotting this around arbitrarily feels like a bit of a code-smell.

## Turbo Frames

Use Turbo Frames for parts of the page that have a distinct independent context. This becomes clearer with experience, but their features provide some hints. Turbo Frame contents are _navigable_ from links and forms, and they can be loaded asynchronously from the rest of the page load. If you don't feel your interface benefits from these features, then consider a Refresh or Streams.

## Turbo Streams

Turbo Streams are inviting because they fit a simple procedural mindset: _"when I press this button, I want to update X, Y, and Z"_. However this can easily escalate, and your responses become an unstructured mess of arbitrary Turbo Stream actions. If you're rendering more than a few Turbo Stream actions, consider Frames or Refreshes.

To update multiple clients in realtime, you'll need to broadcast a Turbo Stream over a Web Socket connection. The same principles diagrammed above apply in this case too: if the response makes multiple updates, broadcast a Turbo Stream Refresh, otherwise broadcast Turbo Stream actions.
