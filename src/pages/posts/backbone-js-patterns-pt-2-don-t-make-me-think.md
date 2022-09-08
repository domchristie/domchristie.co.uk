---
title: "Backbone.js Patterns Pt.2: Don’t make me think"
pubDate: Thu Aug 29 2013 09:29:51 GMT+0100 (BST)
tags:
  - javascript
  - backbone.js
---

<p>Different programming languages have different naming conventions. When working with Ruby, for example, it is advised that you separate multi-word variables with underscores. In JavaScript, camelCasing is generally the norm. So when dealing with data that is shared across different environments, you may find yourself having to remember what style to use, e.g. <em>&#x201C;Was it <code>user.get('first_name')</code>, or <code>user.get('firstName')</code>?&#x201D;</em>.</p>

<p>This is where <strong>humps</strong> is your friend.</p>

<p><a href="https://github.com/domchristie/humps">humps</a> is a small JavaScript library (~100 LoC) that simply converts underscored object keys (and strings) to camelCased, and vice versa (as well as other styles, like PascalCase). By using humps in the <code>toJSON</code> and <code>parse</code> methods, we can seamlessly work with the conventions of each language.</p>

<p><code>toJSON</code> and <code>parse</code> are methods that are typically used to customise the data being sent to and from the server. <code>toJSON</code> should be used to prepare a model&#x2019;s attributes for synchronisation <sup><a href="#fn79.1" id="r79.1">[1]</a></sup>; whereas <code>parse</code> is typically called when data is sent <em>from</em> the server, and therefore can be used to prepare a model&#x2019;s attributes before they are set on the model itself.</p>

<p>Starting with the <code>parse</code> method, overwrite <code>Backbone.Model.prototype.parse</code>, passing the results of the old `parse` method into <code>humps.camelizeKeys</code>:</p>

```js
(function() {
  var oldParse = Backbone.Model.prototype.parse;
  Backbone.Model.prototype.parse = function() {
    var parsed = oldParse.apply(this, arguments);
    return humps.camelizeKeys(parsed);
  };
})();
```

<p>So now, the following JSON:</p>

```js
{ "first_name": "Jon", "last_name": "Snow", "is_steward": true }
```

<p>will be converted to camelCase and will be accessible on the model as follows:</p>

```js
// assuming user is an instance of a Backbone model
user.get('firstName'); // "Jon"
user.get('lastName'); // "Snow"
user.get('isSteward'); // true
```

<p>Remember, that <code>parse</code> is only called when a model&#x2019;s is updated via a <code>fetch</code> or <code>save</code>. If you are populating a model&#x2019;s attributes manually, you&#x2019;ll need to pass in <code>{ parse: true }</code>:</p>

```js
var user = new User({
  "first_name": "Jon"
}, { parse: true });
```

<p>It&#x2019;ll also work with nested objects.</p>

<p>The same pattern can be applied to <code>toJSON</code>, which will convert camelCased object keys (back) to underscored:</p>

```js
(function() {
  var oldToJSON = Backbone.Model.prototype.toJSON;
  Backbone.Model.prototype.toJSON = function() {
    var json = oldToJSON.apply(this, arguments);
    return humps.decamelizeKeys(json);
  };
})();
```
<p>Feedback welcome via <a href="https://twitter.com/domchristie">Twitter</a>, or <a href="mailto:christiedom@gmail.com">email</a>.</p>
<p>Part 3 in this miniseries will extend the <code>toJSON</code> method to exclude non-persisted attributes from its output.</p>

<section class="footnotes">
  <p id="fn79.1"><a href="#r79.1">[1]</a> The Backbone.js documentation for <code>toJSON</code> previously suggested that it could be used to clone a model&#x2019;s attributes for use in a template, as well as for persistence. Following a <a href="https://github.com/jashkenas/backbone/issues/2134">discussion on the purpose of <code>toJSON</code></a>, it was decided that this &#x201C;double duty&#x201D; should be simplified. It is now not recommended for preparing a model for rendering.</p>
</section>
