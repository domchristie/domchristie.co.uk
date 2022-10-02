const fs = require('fs')
const { exec } = require('child_process')

const now = new Date
const date = [
  now.getFullYear(),
  pad(now.getMonth() + 1),
  pad(now.getDate())
].join('-')
const time = [
  pad(now.getHours()),
  pad(now.getMinutes()),
  pad(now.getSeconds())
].join(':')

const content = `---
title: Today I Learned
pubDate: ${date} ${time}
emoji: 📚
tags:
  - til
---

`
const fileName = `src/pages/posts/til-${date}.md`

function pad (number) {
  return number < 10 ? '0' + number : number.toString()
}

fs.writeFile(fileName, content, () => {
  exec(`code ${fileName}`, () => {})
})
