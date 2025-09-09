import { existsSync } from 'fs'
import { defineConfig } from 'astro/config'
import tailwind from "@astrojs/tailwind"

function defaultLayoutPlugin () {
  const layouts = new Set

  return function (tree, file) {
    const fileName = file.history[0]
    const directory = fileName.split('/').slice(-2)[0]
    const layout = (
      directory.charAt(0).toUpperCase() + directory.slice(1) + '.astro'
    )
    if (layouts.has(layout) || existsSync(`./src/layouts/${layout}`)) {
      layouts.add(layout)
      file.data.astro.frontmatter.layout = `$layouts/${layout}`
    }
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://domchristie.co.uk',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [defaultLayoutPlugin]
  },
  integrations: [
    tailwind({ applyBaseStyles: false })
  ]
})
