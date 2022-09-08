---
title: "Using Backbone.js Class Properties as Data Stores"
pubDate: Thu Aug 30 2012 20:15:33 GMT+0100 (BST)
tags:
  - javascript
  - backbone.js
---

<div class="alert">
<p>Update: a Backbone plugin version of the following pattern can be found on the <a href="https://github.com/domchristie/backbone-modelling">backbone-modelling GitHub repo</a>.</p>
</div>

<p>I've been looking into <a href="http://emberjs.com/">ember.js</a> recently and really liked the look of <a href="https://github.com/emberjs/data">Ember Data</a>: a library for loading and storing models from a persistence layer. It has a nice <a href="http://guides.rubyonrails.org/active_record_querying.html">ActiveRecord</a>-like API for querying models, fetching any models from the server that have not been created or stored locally.</p>

<p>It's something I've emulated (very basically) in previous <a href="http://backbonejs.org/">Backbone.js</a> projects, so it's nice to see it implemented so completely.</p>

<p>Inspired on the Ember Data API, I thought it may be worth improving my own implementation, making use of Backbone's class properties, like so:</p>

```js
window.Blog = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {}
};

Blog.Collections.Posts = Backbone.Collection.extend({
  model: Blog.Models.Post // this will be undefined
});

Blog.Models.Post = Backbone.Model.extend({
  initialize: function() {
    this.constructor.store.add(this);
  }
}, {
  store: new Blog.Collections.Posts()
});
```

<p>First we set up the collection, <s>referencing the Post model</s> (Update: this will be undefined, causing potential problems down the line. See update below). Then we define the Post model itself, which includes a store (as a class property) and adds each instance to this store on initialize. It's worth noting that this method makes use of Backbone's <code>extend</code> function for Backbone classes (see <a href="http://backbonejs.org/docs/backbone.html#section-160">annotated source code</a>), which differs from underscore's <code>extend</code> function: instance properties are extended with the first parameter, class properties in the second.</p>

<p>This sets up a basic store, allowing us to do things like:</p>

```js
Blog.Models.Post.store.length; // 0
var post = new Blog.Models.Post();
Blog.Models.Post.store.length; // 1
Blog.Models.Post.store.first() == post; // true
```

<p>Of course, all the <a href="http://backbonejs.org/#Collection-Underscore-Methods">Underscore collection methods</a> are available on the <code>store</code> property. Fetching models that are not stored or created locally shouldn't be too hard to add: a feature for another blog post, perhaps&#x2026;</p>

<h2>Update: Adding the model property and memoizing the store</h2>

<p>This implementation is ok, but it doesn't allow the Post model to be referenced in the store's collection. Not ideal.</p>

<p>To fix this we will include the model property when the collection is instantiated. This requires us to convert the store property to a function that returns the collection, memoizing the collection (in <code>Blog.Model.Post._store</code>) in the process:</p>

```js
Blog.Models.Post = Backbone.Model.extend({
  initialize: function() {
    this.constructor.store().add(this);
  }
}, {
  store: function() {
    return this._store = this._store ||
      new Blog.Collections.Posts(null, { model: this });
  }
});
```
