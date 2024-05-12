---
title: Hotwire Back Button
description: A back button using Stimulus and Turbo's History state
pubDate: 2024-05-12 11:08:45
emoji: ⚡️
tags:
  - hotwire
  - turbo
  - stimulus
---

A Stimulus back button for full-screen progressive web apps (where the browser's own back button is not visible), or wherever you need back functionality within your own user interface.

```html
<a
  href="/dashboard"
  data-controller="navigation"
  data-action="navigation#back"
  data-turbo-action="replace">Back</a>
```

```js
import { Controller } from '@hotwired/stimulus'

export default class NavigationController extends Controller {
  back (event) {
    if (this.#shouldRestore) {
      event.preventDefault()
      window.history.back()
    }
  }

  get #shouldRestore () {
    return !this.#isFirstHistoryEntry
  }

  get #isFirstHistoryEntry () {
    return !window.history.state.turbo ||
      window.history.state.turbo.restorationIndex === 0
  }
}
```

When a user navigates from page-to-page within your Turbo-driven app, this back button (or link) behaves just like a browser back button, taking the user back to where they came from.

When a user arrives at a page from an external site, this back button visits the link's URL, replacing the browser's history entry, leading to a consistent information architecture.

---

This works by using Turbo's history state. We can determine if the current page is the first visited page when the user lands on our app. If it is, we need to follow the back button's URL, keeping the user within our app; otherwise we can just traverse the history.

What's more, this works even if the page is reloaded: history state is preserved across reloads (🤯). So if a user navigates and reloads, we can still determine how this back button should behave as before.
