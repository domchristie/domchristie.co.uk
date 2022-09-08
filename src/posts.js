/** @return { (import type { MarkdownInstance } from 'astro')[] } */
export async function Posts () {
  const result = import.meta.glob('/src/pages/posts/*.md')
  const entries = [...Object.values(result)]
  const files = await Promise.all(entries.map(fn => fn()))
  return files.sort((a, b) =>
		new Date(b.frontmatter.pubDate).valueOf() -
		new Date(a.frontmatter.pubDate).valueOf()
	)
}

export function isShort (post) {
  const MAX_IMAGES = 1
  const MAX_CHAR_COUNT = 320
  const content = post.compiledContent()
  return (
    stripTags(content).length <= MAX_CHAR_COUNT &&
    imgCount(content) <= MAX_IMAGES
  )
}

function stripTags (html) {
  return html.replace(/\s+/gm, ' ').replace(/<[^>]*>/gm, '')
}

function imgCount (html) {
  return html.match(/<img/gi)?.length ?? 0
}
