---
title: "Improving TfL’s Live Bus Timetables: Uncle Gus"
pubDate: Fri Aug 09 2013 13:24:31 GMT+0100 (BST)
tags:
  - projects
  - design
---

<p><strong>tl;dr:</strong> I've created a simple London bus timetable web app: <a href="http://unclegus.net?link=tldr">Uncle Gus</a> (requires a <a href="http://zeptojs.com/#platforms">reasonably modern browser</a> e.g. Safari, Chrome, Firefox).</p>

<p>If you have ever used any of TfL&#x2019;s live bus displays, you'll have probably seen one in a state that offers very little, if any, relevant information about the bus you hope to catch.</p>

<p>The current displays page-through imminent arrivals about every 10 seconds, four buses at a time. The most imminent bus (from any route) is always displayed at the top. This seems pretty logical, until you start using them &#x2026;</p>

<img src="https://domchristie.s3.amazonaws.com/uncle-gus-before.png" alt="" title="">

<p style="margin-top: -1em;"><small><strong>Above:</strong> an example TfL live bus timetable (without pagination).</small></p>

<p>If you want to know when your next bus is going to arrive, it has to either be the most imminent arrival, or the display has to be showing the first page of results <em>and</em> your bus has to be in the top four arrivals. Unfortunately this is rarely the case, so you end staring at the display, waiting for that first page to come around, making sure to keep track of your bus's earliest arrival in case it&#x2019;s not on the first page. (More often than not, I end up getting bored, look away, and miss that all-important first page!)</p>

<p>So I started thinking about how these displays could be improved. The result is <a href="http://unclegus.net">Uncle Gus</a>.</p>

<p>For a given stop, it formats each route on a single row, accompanied with the next 3 arrivals. It removes the (now unnecessary) order number and shortens &#x201C;min&#x201D; to just &#x201C;m&#x201D;. So the same data as above could be displayed as:</p>

<img src="https://domchristie.s3.amazonaws.com/uncle-gus-after.png" alt="" title="">

<p>Ah, that&#x2019;s better. <a href="http://unclegus.net?link=try">Give it a try!</a></p>
