---
title: Ruby Emoji
pubDate: 2023-06-27 20:39:16
emoji: 🙂
tags:
  - emoji
  - ruby
---

Ruby's Regexp character properties provides a nice way to check for emoji characters:

```rb
"👍".match?(/\p{Emoji}/)
=> true
```

However, to check if a string consists entirely of emoji, the following does not work:

```rb
"❤️👍".match?(/^(\p{Emoji})$/)
=> false # ⁉️
```

❤️ is a compound emoji consisting of two characters: U+2764 (emoji), and a modifier U+FE0F (not emoji). So perform this check accurately, we use the `grapheme_clusters` string method. As implied, this splits the string into clusters of characters including their modifiers:

```rb
"❤️👍".grapheme_clusters
=> ["❤️", "👍"]
```

Modifiers come after the initial emoji, so if we check each cluster starts with an emoji we achieve the expected result:

```rb
"❤️👍".grapheme_clusters.all? { |e| e.match?(/^\p{Emoji}/) }
=> true
```
