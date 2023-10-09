---
title: Tailwind Utopia
description: Breakpoint-free fluid type and spacing with Tailwind and the utopia.fyi approach
pubDate: 2023-10-09 07:32:43
emoji: 🍃
tags:
  - tailwind
  - utopia
  - css
---

[Tailwind Utopia](https://github.com/domchristie/tailwind-utopia) is a Tailwind CSS plugin for generating fluid type and space scales based on [Utopia](https://utopia.fyi/).

[James Gilyead's introductory blog post](https://utopia.fyi/blog/designing-with-fluid-type-scales) explains this best, but the idea is that breakpoint-based design feels like creating fixed layouts for an abitrary number of sizes. The Utopia approach encourages designers to design type and space scales for the smallest and largest screens, then let _maths_ design the sizes inbetween. No breakpoints, just an algorithm that interpolates between the two scales.

[Utopia's CSS space generator](https://utopia.fyi/space/calculator/) creates sizing variables that fluidly scale. For example:

```css
:root {
  --space-s: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem); /* 18px-20px */
  --space-m: clamp(1.6875rem, 1.6223rem + 0.3261vw, 1.875rem); /* 27px-30px */
  --space-l: clamp(2.25rem, 2.163rem + 0.4348vw, 2.5rem); /* 36px-40px */
}
```

Spacing pairs can also be generated, taking the fluid value for the smallest size, and scaling it to a larger value. For example:

```css
:root {
  …
  --space-s-m: clamp(1.125rem, 0.8641rem + 1.3043vw, 1.875rem); /* 18px-30px */
  --space-s-l: clamp(1.125rem, 0.6467rem + 2.3913vw, 2.5rem); /* 18px-40px */
}
```

The benefit of using a CSS generator like Tailwind, is that any number of these spacing pairs can be generated on-the-fly. Simply apply the fluid class names the HTML, and the spacing pair is generated:

```html
<h1 class="mt-fl-sm-lg">Hello, world!</h1><!-- fluid margin top from sm-lg -->
```

So this is what [Tailwind Utopia](https://github.com/domchristie/tailwind-utopia) does.

The [original tailwind-utopia plugin](https://github.com/cwsdigital/tailwind-utopia) was developed by [Chris Pymm](https://www.chrispymm.co.uk/) and [CWS Digital](https://cwsdigital.com/), and rewritten by me to work with Tailwind's <abbr title="just-in-time">JIT</abbr> compiler.
