---
title: Continuous Delivery
pubDate: 2022-10-27 10:33:34
emoji: 🔁
tags:
  - process
  - code
---

[Mike Coutermarsh](https://m--c.com)'s talk at [RailsSaaS](https://railssaas.com/) has had an immediate impact on how I think about what can be deployed to production. Releasing small code changes has always been an approach I've followed, but I've only applied this to small refactors, upgrades, or bug fixes, rather than large features.

Mike's approach recommends breaking down a feature into smaller, deployable elements, that can be hidden behind a feature flag (using something like [Flipper](https://www.flippercloud.io/)). One example was to deploy the initial blank screen as soon as possible. When it comes to launching the feature, it's a simple case of flipping the feature flag switch.

I'm curious to see how this will work in my practice. Often it's hard to know how to architect a feature until it's written in full, particularly in an established codebase where a refactor might be necessary. Tom MacWright puts it well:

<blockquote>
  <p>okay hear me out: i think the best way to do huge refactors is to try doing them all in one, gigantic pull request / chunk, which inevitably fails and needs to be split into smaller ones. if you start with smaller ones, you won't understand the general shape until much later.</p>
  <cite><a href="https://twitter.com/tmcw/status/1585371685133619201">Tom MacWright on Twitter</a></code>
</blockquote>

So I think it probably depends on the confidence in your small units of work, and how much of the existing codebase your new code will touch. If you feel like you're heading down a rabbit hole, then it might be worth exploring that to inform your approach.
