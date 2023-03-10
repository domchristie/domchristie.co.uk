---
title: Dynamic Viewport Height in Tailwind
pubDate: 2023-03-10 12:18:46
tags:
  - tailwind
  - css
---

I'm sure Tailwind will soon support [Dynamic Viewport Units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport) but in the meantime, here's a plugin that generates `.min-h-dscreen`/`.h-dscreen` utilities. Values use `100dvh` but fall back to `-webkit-fill-available` or environment calculations.

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  // …
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.min-h-dscreen': generate('minHeight'),
        '.h-dscreen': generate('height')
      })

      function generate (property) {
        return {
          [property]: [
            'calc(100vh - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0))',
            '100dvh'
          ],
          '@supports (-webkit-touch-callout: none)': {
            [property]: ['-webkit-fill-available', '100dvh']
          }
        }
      }
    })
  ]
}
```

## Example Output
```css
.min-h-dscreen {
  min-height: calc(100vh - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0));
  min-height: 100dvh;
}

@supports (-webkit-touch-callout: none) {
  .min-h-dscreen {
    min-height: -webkit-fill-available;
    min-height: 100dvh;
  }
}
```

Inspired by the [discussion on -webkit-fill-available](https://github.com/tailwindlabs/tailwindcss/discussions/4515#discussioncomment-2112460).
