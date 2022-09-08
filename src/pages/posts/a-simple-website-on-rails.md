---
title: "A Simple Website on Rails?"
pubDate: Sat Aug 06 2011 22:26:00 GMT+0100 (BST)
tags:
  - ruby
  - ruby on rails
---

<p>Ever since I started using Rails, Git and Heroku, I've been looking for a way to use these tools to create basic websites that have a nice interface for managing content.</p>

<p>I'd normally approach this kind of site with Wordpress. I like it's easy installation and the features it has out of the box; but getting it setup with Git and keeping development/production environments in sync (+ deployment) is a bit of a headache<sup><a href="#fn2.1" id="r2.1">[1]</a></sup>.</p>

<p>What's more, as with most content management systems I've used, I've often found myself using ugly fixes to force it do do what I want it to, or trawling through directories to find a plugin that's sure not to break when I upgrade the CMS.</p>

<p>I've briefly looked into <a href="http://radiantcms.org/">Radiant</a> and <a href="http://refinerycms.com/">Refinery</a>: Rails-based alternatives that work fine within a Git workflow; but while they maybe easy to learn, I'd rather be getting to know Rails better, rather than the particular workings of a CMS (I know, this sounds lazy!).</p>

<p>The best solution I've come across so far is <a href="https://github.com/sferik/rails_admin">Rails Admin</a>, which, as the name implies, provides a simple way to administer content on a Rails backend. Although I've only just started using it, it appears to have just the bare minimum features necessary to create/update content - allowing me to make the decisions about how my data is organised.</p>

<p>Installation is easy and getting something up and running couldn't be quicker. This is probably because I work more with Ruby/Rails than I do with php/Wordpress (or any other CMS); but it suits me - particularly as I can focus on creating web apps with Rails and learning Ruby (a bit nicer than php, in my humble opinion!)</p>

<section class="footnotes">
  <p id="fn2.1"><a href="#r2.1">[1]</a> For example, it's all too easy modify files outside of the Git workflow - what with the ability to update the CMS via the Wordpress interface.</p>
</section>
