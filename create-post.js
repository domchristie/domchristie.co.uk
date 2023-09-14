const fs = require('fs')
const { exec } = require('child_process')

module.exports = function createPost ({ title, emoji, tags, slug } = { title: 'Untitled' }) {
  const content = [
    '---',
    `title: ${title}`,
    `pubDate: ${currentDate()} ${currentTime()}`,
    `emoji: ${emoji || ''}`,
    `tags:${tags ? ' \n' + formatTags(tags) : ''}`,
    '---',
    ''
  ].join('\n')

  const fileName = `src/pages/posts/${slug || slugify(title)}-${currentDate()}.md`

  fs.writeFile(fileName, content, () => {
    exec(`code ${fileName}`, () => {})
  })
}

function currentDate () {
  const now = new Date
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join('-')
}

function currentTime () {
  const now = new Date
  return [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join(':')
}

function pad (number) {
  return number < 10 ? '0' + number : number.toString()
}

function formatTags (tags = []) {
  return tags.map(tag => `  - ${tag}`).join('\n')
}

function slugify (string) {
	return string
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}
