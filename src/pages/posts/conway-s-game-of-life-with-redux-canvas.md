---
title: "Conway’s Game of Life with Redux + Canvas"
pubDate: Wed Mar 09 2016 09:43:13 GMT+0000 (GMT)
tags:
  - javascript
  - redux
---

<a href="http://jsbin.com/cijefu"><img src="https://s3-eu-west-1.amazonaws.com/domchristie/conways-game-of-life-redux.png" alt="Animation of Conway&#x2019;s Game of Life"></a>

<p>In the past few weeks I&#x2019;ve been doing a fair bit of work with <a href="http://redux.js.org">Redux</a>, a library which helps manage data and state in JavaScript applications. There&#x2019;s an emphasis on functional programming and immutable data, which takes a little getting used to, but it does feel like a suitable approach&#x2014;particularly for implementing Conway&#x2019;s Game of Life&#x2026;</p>

<blockquote>
<p>each generation is a pure function of the preceding one</p>
<cite><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules">Conway&#x2019;s Game of Life on Wikipedia</a></cite>
</blockquote>

<p>This fits nicely with Redux&#x2019;s concept of &#x201C;reducers&#x201D;, which take in the current state and an &#x201C;action&#x201D;, and return a new state.</p>

<p>The app state is just the grid: an array of arrays containing cell values (1s and 0s). There is just a single action, a <code>'TICK'</code>, and when a <code>'TICK'</code> is dispatched, the <code>grid</code> reducer generates a new grid based on the current grid:</p>

```js
function grid (state, action) {
  if (typeof state === 'undefined') return randomGrid()

  switch (action.type) {
    case 'TICK':
      return nextGrid(state)
    default:
      return state
  }
}

function nextGrid (grid) {
  return grid.reduce(function (nextGrid, currentRow, y) {
    var newRow = currentRow.map(function (value, x) {
      return nextValue(x, y, value, grid)
    })

    nextGrid.push(newRow)

    return nextGrid
  }, [])
}
```

<p>The grid values for the next tick are computed based on the neighbouring values (as per <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules">the rules</a>):</p>

```js
function nextValue (x, y, value, grid) {
  var neighbours = neighboursOf(x, y, grid)

  var livingNeighbours = neighbours.filter(function (value) {
    return !!value
  }).length

  return +willLive(value, livingNeighbours)
}

function willLive (value, livingNeighbours) {
  return value
    ? livingNeighbours === 2 || livingNeighbours === 3
    : livingNeighbours === 3
}

function neighboursOf (x, y, grid) {
  return [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0], /*x,y*/  [1,  0],
    [-1,  1], [0,  1], [1,  1]
  ].map(function (coords) {
    return valueAt(x + coords[0], y + coords[1], grid)
  })
}

function valueAt (x, y, grid) { return grid[y] &amp;&amp; grid[y][x] }
```

<p>The <code>render</code> function redraws the state on a <code>&lt;canvas&gt;</code> whenever it changes, and a <code>'TICK'</code> is dispatched every 100ms to generate the next state: </p>

```js
var store = Redux.createStore(grid)
store.subscribe(render)

render()

setInterval(function () {
  store.dispatch({ type: 'TICK' })
}, 100)
```

<p>I&#x2019;m sure this could be improved, but it feels like a pretty nice solution.</p>

<p>See it in action: <a href="http://jsbin.com/cijefu">Conway&#x2019;s Game of Life with Redux and Canvas</a>, and <a href="http://jsbin.com/cijefu/edit?html,css,js,output">view the full source</a>.</p>

<p><small>Hat tip to <a href="https://github.com/alanrsoares">Alan R. Soares</a>. I had a peak at <a href="https://github.com/alanrsoares/redux-game-of-life">his implementation with React</a> and refined my <code>willLive</code> function a based on it.</small></p>
