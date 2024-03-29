---
title: "Graphical Integrity in Data Visualisations"
pubDate: Sat Feb 21 2015 15:50:00 GMT+0000 (GMT)
tags:
  - design
  - data visualisation
  - edward tufte
---

<p>This infographic, highlighting quirks of the UK voting system, recently popped up in my Twitter feed. Whilst the accompanying article makes some valid points, the graphic is rather inaccurate.</p>

<div>
<figure><a href="https://domchristie.s3.amazonaws.com/may2015-votes-seats-original.png"><img src="https://domchristie.s3.amazonaws.com/may2015-votes-seats-original.png" alt="Infographic of forecast votes-to-seats for Ukip, Lib Dems, Greens, and SNP"></a><figcaption>Data Visualisation taken from <a href="http://may2015.com/featured/would-you-like-5-million-votes-and-4-seats-or-1-million-votes-and-56-seats/">May2015: Would you like 5 million votes and 4 seats, or 1 million votes and 56 seats?</a></figcaption></figure>
</div>

<p>Firstly, it uses circles (of two dimensions) to represent one-dimensional data. Edward Tufte discusses this in The Visual Display of Quantitative Information:</p>

<blockquote><p>There are considerable ambiguities in how people perceive a two-dimensional surface and then convert that perception into a one-dimensional number. Changes in physical area on the surface of a graphic do not reliably produce appropriately proportional changes in perceived areas.</p></blockquote>

<p>In this instance, the designer has varied the radius/diameter of the circles, which results in a surface area that exaggerates the data. For example, compare the circles for the Green Party and the SNP. If the Green Party circle represents 1 unit-squared, then you&#x2019;d expect the SNP&#x2019;s circle to be 56 units-squared. Instead, it is 3136 units-squared&#x2014;56-times greater than it should be.</p>

<p>Secondly, it encourages comparisons between values on different scales: percentage of votes, and number of seats.</p>

<p>The graphic gives the impression that the Lib Dems <strong>gain</strong> considerably from the voting system: 8% votes &#x2192; 26 seats. 26 seats actually represents just 4% of the total seats (650), so their votes are <strong>effectively halved</strong>! This distortion is also observed when comparing the Lib Dems&#x2019; &#x201C;votes&#x201D; circle to the SNP&#x2019;s &#x201C;seats&#x201D; circle. The SNP&#x2019;s 56 seats (8.61%) should be comparable to the Lib Dems votes (8%). It isn&#x2019;t.</p>

<div>
<figure><a href="https://domchristie.s3.amazonaws.com/may2015-votes-seats-annotated.png"><img src="https://domchristie.s3.amazonaws.com/may2015-votes-seats-annotated.png" alt="Infographic of forecast votes-to-seats for Ukip, Lib Dems, Greens, and SNP, highlighting inaccuracies"></a><figcaption>Annotated graphic highlighting distortions. The dark blue circle shows how big the SNP&#x2019;s circle would be if areas were proportionate.</figcaption></figure>
</div>

<p>What&#x2019;s more, there is a second graphic (not re-published here), making the same votes-to-seats comparisons but with the Labour, Conservative, and Ukip parties. However, this is on a different scale to the previous one, making any further comparisons impossible.</p>

<p>It would be more accurate to make comparisons based on percentages of seats, and include all the data in a single graphic. Perhaps a simple table would suffice?</p>

<p>The following table attempts to convey how much each party is set to gain/lose because of the voting system based on the forecast. A ratio greater than 1 indicates that a party gains from the system; ratio less than 1 indicates that a party loses from the system.</p>

<table>
  <thead>
    <tr>
      <th>Party</th>
      <th class="number">% of Votes</th>
      <th class="number">% of Seats</th>
      <th class="number">
        Ratio
        <div class="muted">
          <small>% Seats / % Votes</small>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Labour</td>
      <td class="number">33</td>
      <td class="number">42.31</td>
      <td class="number">1.28</td>
    </tr>
    <tr>
      <td>Conservatives</td>
      <td class="number">31</td>
      <td class="number">40.92</td>
      <td class="number">1.32</td>
    </tr>
    <tr>
      <td>Ukip</td>
      <td class="number">15</td>
      <td class="number">0.62</td>
      <td class="number">0.04</td>
    </tr>
    <tr>
      <td>Lib Dems</td>
      <td class="number">8</td>
      <td class="number">4.00</td>
      <td class="number">0.50</td>
    </tr>
    <tr>
      <td>Green</td>
      <td class="number">7</td>
      <td class="number">0.15</td>
      <td class="number">0.02</td>
    </tr>
    <tr>
      <td>SNP</td>
      <td class="number">4</td>
      <td class="number">8.62</td>
      <td class="number">2.15</td>
    </tr>
  </tbody>
</table>

<p>Ratios can be transformed into &#x201C;Advantages&#x201D; by taking logarithms: positive values indicate gain, negative values indicate loss.</p>

<table>
  <thead>
    <tr>
      <th>Party</th>
      <th class="number">% of Votes</th>
      <th class="number">% of Seats</th>
      <th class="number">
        Advantage
        <div class="muted">
          <small>log<sub>2</sub>(% Seats / % Votes)</small>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Labour</td>
      <td class="number">33</td>
      <td class="number">42.31</td>
      <td class="number">0.36 <!-- log2 1.28205128205128205125 --></td>
    </tr>
    <tr>
      <td>Conservatives</td>
      <td class="number">31</td>
      <td class="number">40.92</td>
      <td class="number">0.40 <!-- log2 1.32009925558312655083 --></td>
    </tr>
    <tr>
      <td>Ukip</td>
      <td class="number">15</td>
      <td class="number">0.62</td>
      <td class="number">-4.61 <!--log2  0.04102564102564102564 --></td>
    </tr>
    <tr>
      <td>Lib Dems</td>
      <td class="number">8</td>
      <td class="number">4.00</td>
      <td class="number">-1.00 <!-- log2 0.50 --></td>
    </tr>
    <tr>
      <td>Green</td>
      <td class="number">7</td>
      <td class="number">0.15</td>
      <td class="number">-5.51 <!-- log2 0.02197802197802197802 --></td>
    </tr>
    <tr>
      <td>SNP</td>
      <td class="number">4</td>
      <td class="number">8.62</td>
      <td class="number">1.11<!-- log2 2.1538461538461538461 --></td>
    </tr>
  </tbody>
</table>

<p>From these tables we can deduce that:</p>
<ul>
  <li>Labour and the Conservatives are set to gain a little from the voting system</li>
  <li>The SNP would gain as much proportionally as the Lib Dems lose: the voting system effectively doubles the SNP&#x2019;s seats, and halves the Lib Dems&#x2019;</li>
  <li>Ukip and the Greens are set to lose out the most, significantly more than any other loses or gains</li>
</ul>

<p>Got feedback? Email me: <a href="mailto:christiedom@gmail.com">christiedom@gmail.com</a></p>
