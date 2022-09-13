---
title: "Destructuring: JavaScript vs. Ruby"
pubDate: 2022-09-12 18:09:29
emoji: 💎
tags:
  - ruby
  - javascript
  - destructuring
---

Combining Ruby 2.7's pattern matching, and Ruby 3's rightward assignment, we can achieve something similar to JavaScript's destructuring assignment. Jared White covers this well in [Everything You Need to Know About Destructuring in Ruby 3](https://www.fullstackruby.dev/ruby-3-fundamentals/2021/01/06/everything-you-need-to-know-about-destructuring-in-ruby-3/). For those familiar the JavaScript syntax, here are some comparisons for destructuring objects/hashes:

```js
// JavaScript
const { a } = { a: 1 } // a === 1
```

```rb
# Ruby
{a: 1} => {a:} # a == 1
```

(Rightward assignment might take some getting used to: variables on the right get assigned values from the left.)

## Variable Naming

```js
// JavaScript
const { a: b } = { a: 1 } // b === 1
```

```rb
# Ruby
{a: 1} => {a: b} # b == 1
```

## ...rest

```js
// JavaScript
const { a, ...rest } = { a: 1, b: 2 } // a === 1, rest === { b: 2 }
```

```rb
# Ruby
{a: 1, b: 2} => {a:, **rest} # a == 1, rest == {b: 2}
```

## Default Values

There's currently no Ruby syntax equivalent to that of JavaScript for setting default values whilst destructuring. `merge` is probably the best choice here. Let's say we wanted defaults of `a = 42` and `b = 2`:


```js
// JavaScript
const { a = 42, b = 2 } = { a: 1 } // a === 1, b === 2
```

```rb
# Ruby
{a: 42, b: 2}.merge({a: 1}) => {a:, b:} # a == 1, b == 2
```

## Nil Values

In JavaScript, attempting to destructure a key that does not exist on the source, results in a variable being `undefined`. In Ruby, pattern matching expects a pattern to match (obviously), so if a key does not exist on the source it will throw `NoMatchingPatternError`. However, we can mimic JavaScript's relaxed behaviour by defining a [`deconstruct_keys`](https://ruby-doc.org/core-3.1.2/doc/syntax/pattern_matching_rdoc.html#label-Matching+non-primitive+objects-3A+deconstruct+and+deconstruct_keys) method on our source, and merge any undefined keys.

```js
// JavaScript
const { a, b } = { a: 1 } // a === 1, b === undefined
```

```rb
class Props < Hash
  def deconstruct_keys(keys)
    Array(keys).to_h { |k| [k, nil] }.merge(self)
  end
end

Props[{a: 1}] => {a:, b:} # a == 1, b == nil
```

Thanks to [Elliot Crosby-McCullough](http://elliot.cm/) on the [StimulusReflex Discord](https://discord.com/invite/stimulus-reflex) for this idea and code snippet.
