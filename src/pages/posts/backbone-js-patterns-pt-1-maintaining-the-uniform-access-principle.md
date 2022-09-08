---
title: "Backbone.js Patterns Pt.1: Maintaining the Uniform Access Principle"
pubDate: Wed Aug 21 2013 10:11:25 GMT+0100 (BST)
tags:
  - javascript
  - backbone.js
---

<blockquote>The entire [Backbone.js] source is annotated with the explicit idea that you should be feeling free, if something is not working, to dig in and figure out how it works and also to dig in and overwrite things if you find the need. <cite>Jeremy Ashkenas <span class="lower byline">on</span> <a href="http://javascriptjabber.com/004-jsj-backbone-js-with-jeremy-ashkenas/">JavaScript Jabber 004</a></cite></blockquote>

<p>I thought I'd share a few patches that I've found useful when developing web apps with Backbone.js. The techniques overwrite prototype methods, but in a responsible way that keeps default behaviours unchanged.</p>

<p>This part takes pointers from <a href="http://stackoverflow.com/questions/6695503/whats-the-best-way-to-override-model-getattr-in-backbone-js">this Stack Overflow question</a> and the <a href="http://c2.com/cgi/wiki?UniformAccessPrinciple">Uniform Access Principle</a>:</p>

<blockquote><p>All services offered by a module should be available through a uniform notation, which does not betray whether they are implemented through storage or through computation</p><cite>Bertrand Meyer</cite></blockquote>

<p>Lets say you have a user model as follows:</p>

```js
App = {};
App.User = Backbone.Model.extend({
  defaults: {
    firstName: 'Jon',
    lastName: 'Snow'
  },

  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }
});
var user = new App.User();
```

<p><code>fullName</code> <em>could</em> be accessed by calling <code>user.fullName()</code>, but that would be inconsistent with accessing other attributes. What&#x2019;s more, if, for example, we decided to compute <code>fullName</code> on the server, we'd have to replace all occurrences of <code>user.fullName()</code> with <code>user.get('fullName')</code>.</p>

<p>It would be better to access <code>fullName</code> (and any <em>attribute-like</em> method) via <code>user.get('fullName')</code>. This can be achieved by overwriting <code>Backbone.Model.prototype.get</code>:</p>

```js
(function() {
  var oldGet = Backbone.Model.prototype.get;
  Backbone.Model.prototype.get = function(attr) {
    if(typeof this[attr] === 'function') {
      return this[attr]();
    }
    return oldGet.apply(this, arguments);
  };
})();
```

<p>This stores the original <code>get</code> method in <code>oldGet</code>, calls the requested method if it exists on the model, or calls the original <code>get</code> method if it doesn't.</p>

<p><code>Backbone.Model.prototype.escape</code> retrieves attributes by making a call to <code>Backbone.Model.prototype.get</code>, and so should also work with this technique.</p>

<p>Related: <a href="http://emberjs.com/guides/object-model/computed-properties/">computed properties in Ember.js</a>.</p>

<p>Feedback welcome via <a href="https://twitter.com/domchristie">Twitter</a>, or <a href="mailto:christiedom@gmail.com">email</a>.

</p><p>Part 2 will look at techniques for customising <code>toJSON</code> and <code>parse</code> for synchronising data with the server.</p>
