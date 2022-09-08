---
title: "Backbone.js Patterns Pt.3: Excluding non-persisted attributes"
pubDate: Thu Sep 12 2013 08:50:07 GMT+0100 (BST)
tags:
  - javascript
  - backbone.js
---

<p>As I mentioned in <a href="http://domchristie.co.uk/posts/79">the previous post</a>, the <code>toJSON</code> method is used to customise the data sent to the server.</p>

<p>Often you&#x2019;ll have attributes on your model that you don&#x2019;t want to be persisted e.g. <code>isSelected</code>. You could customise the <code>toJSON</code> method on a model-by-model basis, but given that excluding attributes is quite common, we can just include a list of attributes we&#x2019;d like removed, and modify <code>Backbone.Model.prototype.toJSON</code>, to handle it.</p>

<p>First, we&#x2019;ll add an <code>excludeFromJSON</code> property to the class definition. This should be an array of attribute keys you'd like to exclude:</p>

```js
var Post = Backbone.Model.extend({
  excludeFromJSON: [ 'isSelected' ]
});
```

<p>We can then build on our previous <code>toJSON</code> method to exclude those attributes:</p>

```js
(function() {
  var oldToJSON = Backbone.Model.prototype.toJSON;
  Backbone.Model.prototype.toJSON = function() {
    var json = oldToJSON.apply(this, arguments),
        excludeFromJSON = this.excludeFromJSON;
    if(excludeFromJSON) {
      _.each(excludeFromJSON, function(key) {
        delete json[key];
      });
    }
    return humps.decamelizeKeys(json);
  };
})();
```

<p>This new <code>Backbone.Model.prototype.toJSON</code> calls the old method to retrieve a copy of the model's attributes, then deletes any properties whose keys are in the <code>excludeFromJSON</code> array. The modified attributes are finally &#x201C;decamelized&#x201D;. If you don&#x2019;t wish to include <a href="https://github.com/domchristie/humps">my humps library</a>, then just <code>return json;</code>.</p>

<p>Feedback/questions welcome via <a href="https://twitter.com/domchristie">Twitter</a>, or <a href="mailto:christiedom@gmail.com">email</a>.</p>
