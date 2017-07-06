# hummingbird-treeview
A tiny and fast jQuery treeview plugin


<h2>Features</h2>
<ul>
<li>Display hierarchical tree structures.</li>
<li>Based on simple HTML lists.</li>
<li>Three state logic.</li>
<li>Manual and programmatical check, uncheck, collapse, expand, etc.</li>
<li>Supports "multi-doubles".</li>
<li>Supports disabled nodes, checked or unchecked.</li>
<li>Get checked/unchecked items programmatically.</li>
<li>Supports HTML5 data-* attribute to embed custom data.</li>
<li>Supports Font Awesome icons.</li>
<li>Search function.</li>
</ul>

<h2>Dependencies</h2>
<ul>
<li>jQuery v3.1.1 or newer</li>
<li>font-awesome v4.7.0 or newer</li>
</ul>

<h2>Example</h2>
<img src="hummingbird-treeview.png"/>

<h2>Getting started</h2>
<h3>Usage</h3>
Add the following resources for the hummingbird-treeview to function correctly:

    &#60;!-- Required Stylesheets --&#62;
    &#60;link href="/path/to/font-awesome.css" rel="stylesheet"&#62;
    &#60;link href="/path/to/hummingbird-treeview.css" rel="stylesheet"&#62;

    &#60;!-- Required Javascript --&#62;
    &#60;script src="/path/to/jquery.js"&#62;&#60;/script&#62;
    &#60;script src="/path/to/hummingbird-treeview.js"&#62;&#60;/script&#62;
<br>
Bind the hummingbird-treeview to a scrollable DOM element:

     &#60;div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;"&#62;
     &#60;!-- treeview structure/data here --&#62;
     &#60;div&#62;
<br>
