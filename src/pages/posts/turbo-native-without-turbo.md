---
title: Turbo Native without Turbo?
description: Use Turbo Native adapters with client-side libraries other than Turbo
pubDate: 2024-07-19 09:27:51
emoji: 📱
tags:
  - hotwire
  - turbo
  - turbo-ios
  - turbo-native
  - htmx
---

[Native navigation with web content](https://signalvnoise.com/posts/3743-hybrid-sweet-spot-native-navigation-web-content) is a popular approach to building mobile apps. It's used by some of the biggest companies in the world, including BBC and Amazon.

[37signals](https://37signals.com) have open-source adapters using this idea, enabling web apps that use [Turbo](https://github.com/hotwired/turbo) on the front-end to create native navigation experiences on [iOS](https://github.com/hotwired/turbo-ios) and [Android](https://github.com/hotwired/turbo-android). These depend on Turbo, but what if you prefer another client-side library, such as [htmx](http://htmx.org/), or [Inertia.js](https://inertiajs.com)?

Turbo's process is quite straightforward: intercept link clicks, fetch the content, and render the new content. This forms the concept of a Turbo `Visit`. Turbo triggers `Visit` lifecycle events that are sent to the native adapter, which then can update the navigation stack. Libraries such as htmx and Inertia.js  follow similar approach, so as long as these libraries offer a comprehensive event system, is should be possible to create a translation layer.

I have been experimenting with creating a translation layer for htmx, and it looks like it's possible. It consists of two parts:

1. [turbo-native-htmx-driver](https://github.com/domchristie/turbo-native-htmx-driver): translates htmx events into Turbo Native adapter method calls.
2. [turbo-shim](https://github.com/domchristie/turbo-shim): a universal shim that implements the basic methods required for the Turbo Native adapters. It provides the way to register drivers.

I've targeted iOS for now, and here it is working with the Turbo Native demo:

![A screen capture of an iOS navigation stack](/turbo-htmx.gif)

If you're interested in this idea, please get in touch.
