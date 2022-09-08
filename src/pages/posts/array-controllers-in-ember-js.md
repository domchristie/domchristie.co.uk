---
title: "Array Controllers in Ember.js"
pubDate: Fri Aug 29 2014 12:58:18 GMT+0100 (BST)
tags:
  - ember.js
---

<p>An array controller is a wrapper for a collection of objects, and provides convenient methods for dealing with its contents.</p>

<p>An array controller&#x2019;s <code>model</code> is typically set in a route, for example:</p>

```js
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return [
      {name: 'red'},
      {name: 'yellow'},
      {name: 'blue'}
    ];
  }
});
// (The Index ArrayController is setup implicitly)
```

<p>Setting an array controller&#x2019;s <code>model</code> sets up its <code>content</code> property, which forms the basis for other properties and methods.</p>

<h2>arrangedContent</h2>

<p><code>arrangedContent</code> is an important property, defined as &#x201C;the array that the [array controller] pretends to be&#x201D;. It provides a way for sorted/filtered content to be stored separately from the original <code>content</code>. In this way, sorting/filtering is not destructive, and the content (in its original form) can still be retrieved.</p>

<p>By default, when an array controller has no <code>sortProperties</code>, <code>arrangedContent</code> and <code>content</code> are the same. When <code>sortProperties</code> are added, the sorted content is stored in <code>arrangedContent</code> whilst the original <code>content</code> remains untouched.</p>

<p>It&#x2019;s important to note that <strong>an array controller should be treated just like an array</strong>, with its items referencing those in <code>arrangedContent</code>. Accessing items on an array controller itself, is <em>effectively</em> the same as accessing items in <code>arrangedContent</code> (an important difference is discussed in below).</p>

<p>This is best illustrated with some examples. Given the route above, the following <code>#each</code> loops all result in the same output:</p>

<p><code>index</code> template:</p>

```
{{#each}} {{name}} {{/each}}

{{#each content}} {{name}} {{/each}}

{{#each arrangedContent}} {{name}} {{/each}}
```

<a href="http://emberjs.jsbin.com/nuzoja/1/edit?html,js,output">http://emberjs.jsbin.com/nuzoja/1</a>

<p>Setting <code>sortProperties</code> results in sorted output from <code>arrangedProperty</code> and therefore from the array controller instance itself:</p>

```js
App.IndexController = Ember.ArrayController.extend({
  sortProperties: ['name']
});
```

<p><code>index</code> template:</p>

```
{{!-- Sorted by name --}}
{{#each}}

{{!-- Not Sorted --}}
{{#each content}}

{{!-- Sorted by name --}}
{{#each arrangedContent}}
```

<div class="caption"><a href="http://emberjs.jsbin.com/nuzoja/2/edit?html,js,output">http://emberjs.jsbin.com/nuzoja/2/edit</a></div>

<h2>Item Controllers</h2>

<p>Adding an <code>itemController</code> property to an array controller wraps each item in an instance of the referenced controller. However, this only applies when accessing items through the array controller instance itself. Items accessed via <code>arrangedContent</code> or <code>content</code> remain unwrapped. This is the key difference when accessing items via <code>arrangedContent</code> versus accessing them via the array controller instance itself.</p>

<p>The following example demonstrates this concept:</p>

```js
App.IndexController = Ember.ArrayController.extend({
  itemController: 'color'
});

App.ColorController = Ember.ObjectController.extend({
  isActive: true
});
```

<p><code>index</code> template:</p>

```
{{!-- Names rendered --}}
{{#each}}
  {{#if isActive}} {{name}} {{/if}}
{{/each}}

{{!-- Nothing rendered --}}
{{#each content}}
  {{#if isActive}} {{name}} {{/if}}
{{/each}}

{{!-- Nothing rendered --}}
{{#each arrangedContent}}
  {{#if isActive}} {{name}} {{/if}}
{{/each}}
```

<a href="http://emberjs.jsbin.com/nuzoja/3/edit?html,js,output">http://emberjs.jsbin.com/nuzoja/3/edit</a>

<p>Nothing is rendered in the loops that iterate over <code>content</code> or <code>arrangedContent</code> because the items are not wrapped in an item controller and therefore <code>isActive</code> is inaccessible.</p>

<h3><code>{{#each itemController='&#x2026;'}}</code></h3>

<p><code>{{#each}}</code> helpers, when supplied with an <code>itemController</code> property, wrap each item in <strong>a new instance</strong> of the referenced controller. This operates entirely independently from the <code>itemController</code> property on an array controller: an array controller will not have access to any item controller created via an <code>{{#each}}</code> helper.</p>

<p>This becomes particularly important when implementing a computed property on an array controller that depends on properties on an item controller. See <a href="http://emberjs.jsbin.com/nuzoja/9/edit?html,js,output">the example</a>.</p>

<p>For more information:</p>

<ul>
<li><a href="http://emberjs.com/api/classes/Ember.ArrayController.html">Ember.ArrayController Documentation</a></li>
<li><a href="http://ember.guru/2014/hidden-features-of-the-each-aka-loopedy-loop-helper">The <code>#each</code> helper post</a> on ember.guru</li>
<li><a href="http://www.confreaks.com/videos/3457-emberconf2014-array-computed-properties">Array Computed Properties</a> talk by David Hamilton</li>
</ul>
