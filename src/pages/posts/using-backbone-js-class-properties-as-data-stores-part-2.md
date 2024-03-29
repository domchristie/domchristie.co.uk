---
title: "Using Backbone.js Class Properties as Data Stores: Part 2"
pubDate: Fri Aug 31 2012 16:04:38 GMT+0100 (BST)
tags:
  - javascript
  - backbone.js
---

<div class="alert">
<p>A Backbone plugin version of the following can now be found on the <a href="https://github.com/domchristie/backbone-store-collection">backbone-store-collection GitHub repo</a>.</p>
</div>

<p>Previously I demonstrated <a href="http://domchristie.co.uk/posts/31">a pattern to add basic data stores to Backbone models</a>. In this post I'll improve this pattern, extending the store's <code>get</code> method to fetch a model from the server if it's not stored locally.</p>

<p>We'll want the API to look something like this:</p>

```js
var post = new Blog.Models.Post({ id: 1 });

Blog.Models.Post.store().get(1, {
  success: function(model, response) {
    // model returned from local collection
    model == post; // true
  }
});

Blog.Models.Post.store().get(2, {
  success: function(model, response) {
    // model fetched from the server
  },
  error: function(model, response) {
    // error
  }
});
```

<p>As you can see, the new <code>get</code> adds a second parameter, allowing for success/error callbacks.</p>

<p>First we'll try and retrieve the model from the local store, this requires calling the original <code>get</code> (super). If it's found, we just invoke the <code>success</code> callback. Otherwise we create a new model with the id that was passed in, fetch that model from the server, then invoke the appropriate callback. (On <code>error</code>, the blank model is removed from the store.)</p>

```js
Blog.Collections.Posts = Backbone.Collection.extend({

  get: function(id, options) {
    var modelFromStore =
      Backbone.Collection.prototype.get.call(this, id);

    if(modelFromStore) {
      options.success(modelFromStore);
    }
    else {
      var newModel = new this.model({ id: id }),
          _this = this;
      newModel.fetch({
        success: options.success,
        error: function(model, response) {
          _this.remove(model);
          options.error(model, response);
        }
      });
    }
  },

  url: '/posts'
});
```

<p>I've created Backbone plugin for this, available from the <a href="https://github.com/domchristie/backbone-store-collection">backbone-store-collection GitHub repo</a>. So rather than copying the code above, you can simply do something like:</p>

```js
Blog.Collections.Posts = Backbone.StoreCollection.extend({
  url: '/posts'
});
```

<p>Models still need to be manually added to the store: see the <a href="https://github.com/domchristie/backbone-store-collection/blob/master/README.md">project readme</a>.</p>
