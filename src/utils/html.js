export function stripTags (html) {
  return html.replace(/\s+/gm, ' ').replace(/<[^>]*>/gm, '')
}

export function imgCount (html) {
  return html.match(/<img/gi)?.length ?? 0
}
