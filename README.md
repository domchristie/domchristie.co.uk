# domchristie.co.uk

The [Astro](https://astro.build/) project behind [domchristie.co.uk](https://domchristie.co.uk/). It's built with [Tailwind CSS](https://tailwindcss.com/) and the [Utopia](https://utopia.fyi/) approach, using [tailwind-utopia](https://github.com/domchristie/tailwind-utopia).

## 🚀 Project Structure

You'll see the following folders and files:

```
/
├── public/
│   └── …
├── src/
│   ├── components/
│   │   └── …
│   │   └── posts
│   │   │   └── …
│   ├── layouts/
│   │   └── …
│   └── pages/
│       └── index.astro
│   │   └── posts
│   │   │   └── …
│   ├── posts.js
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

- `src/pages/index.astro` is the homepage, listing the most recent posts: short posts are displayed in full, longer ones link to the full post page
- `src/pages/posts/index.astro` lists each post grouped by year, and links to the full post page
- `src/posts.js` provides functions for querying posts and their content

Any static assets, like images, are placed in the `public/` directory.

## Customizations

To avoid awkward relative import referencing, aliases are set up in `tsconfig.json`:

- `src/components/` is aliased to `$components/`
- `src/layouts/` is aliased to `$layouts/`
- `src/utils/` is aliased to `$utils/`

This helps with setting default layouts. To avoid having to set a layout in every file, `astro.config.mjs` includes a remark plugin to automatically set `frontmatter.layout` depending on where the file exists, for example:

- `src/pages/about.md` will have a `frontmatter.layout` of `$layouts/Pages.astro`
- `src/pages/posts/hello-world.md` will have a `frontmatter.layout` of `$layouts/Posts.astro`

This can be overridden in the file's frontmatter.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm install`          | Installs dependencies                              |
| `npm run dev`          | Starts local dev server at `localhost:3000`        |
| `npm run build`        | Build your production site to `./dist/`            |
| `npm run preview`      | Preview your build locally, before deploying       |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `npm run astro --help` | Get help using the Astro CLI                       |
