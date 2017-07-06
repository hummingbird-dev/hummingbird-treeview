# hummingbird-treeview
A tiny and fast jQuery treeview plugin


## Features

- Display hierarchical tree structures.
- Based on simple HTML lists.
- Three state logic.
- Manual and programmatical check, uncheck, collapse, expand, etc.
- Supports "multi-doubles".
- Supports disabled nodes, checked or unchecked.
- Get checked/unchecked items programmatically.
- Supports HTML5 data-* attribute to embed custom data.
- Supports Font Awesome icons.
- Search function.


## Dependencies

- jQuery v3.1.1 or newer
- font-awesome v4.7.0 or newer


## Example

./hummingbird-treeview.png

<h2>Getting started</h2>
<h3>Usage</h3>
Add the following resources for the hummingbird-treeview to function correctly:

```html
	
    <!-- Required Stylesheets -->
    <link href="/path/to/font-awesome.css" rel="stylesheet">
    <link href="/path/to/hummingbird-treeview.css" rel="stylesheet">

    <!-- Required Javascript -->
    <script src="/path/to/jquery.js"></script>
    <script src="/path/to/hummingbird-treeview.js"></script>

```

<br>
Bind the hummingbird-treeview to a scrollable DOM element:

```html

     <div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;">
     <!-- treeview structure/data here -->
     <div>

```

<br>
Create treeview structure/data:	

```html

    <div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;">
	<ul id="treeview">
	    <li>
		<i class="fa fa-plus"></i>
		<label>
		    <input id="xnode-0" data-id="custom-0" type="checkbox" /> node-0
		</label>
		<ul>
		    <li>
			<i class="fa fa-plus"></i>
			<label>
			    <input  id="xnode-0-1" data-id="custom-0-1" type="checkbox" /> node-0-1
			</label>
			<ul>
			    <li>
				<label>
				    <input class="hummingbirdNoParent" id="xnode-0-1-1" data-id="custom-0-1-1" type="checkbox" /> node-0-1-1
				</label>
			    </li>
			    <li>
				<label>
				    <input class="hummingbirdNoParent" id="xnode-0-1-2" data-id="custom-0-1-2" type="checkbox" /> node-0-1-2
				</label>
			    </li>
			</ul>
		    </li>
		    <li>
			<i class="fa fa-plus"></i>
			<label>
			    <input  id="xnode-0-2" data-id="custom-0-2" type="checkbox" /> node-0-2
			</label>
			<ul>
			    <li>
				<label>
				    <input class="hummingbirdNoParent" id="xnode-0-2-1" data-id="custom-0-2-1" type="checkbox" /> node-0-2-1
				</label>
			    </li>
			    <li>
				<label>
				    <input class="hummingbirdNoParent" id="xnode-0-2-2" data-id="custom-0-2-2" type="checkbox" /> node-0-2-2
				</label>
			    </li>
			</ul>
		    </li>
		</ul>
	    </li>
	</ul>
    </div>

```

<br>
It must be adhered to this HTML format.
Only change the following:
<h3>Treeview structure and node properties</h3>
<ul>
<li><b>div id</b><br>
The <i>&#60;div id="treeview_container"</i>
... can be chosen arbitrarily, but of course
must be referred to consistently.</li>
<li><b>ul id</b><br>
The <i>&#60;ul id="treeview"</i> ... can be chosen.</li>
<li><b>input id' and data-id's</b><br>
The input id's and data-id's
e.g. <i>&#60;input id="xnode-0"
data-id="custom-0"</i> ... can be set. The
data-id can be any text. It is important
for the support of multi-double
nodes. That means you can have
multi-double nodes with similar data-id's
but different id's. Thus every node can be
addressed via the unique id. And all
copies of a node including itself can be
addressed via the common data-id.</li>
<li><b>input class="hummingbirdNoParent"</b><br>
Add this to every node, which is not a
parent, i.e. which has no children or
nodes below.</li>
</ul>
Do not change the "fa fa-plus", do this via the options (see below).
<br>
Change <b>font-size</b>, <b>line-height</b>, checkbox <b>width</b> and <b>height</b> directly
in the hummingbird-treeview.css.<br>
<br>
Set options, e.g.:

```javascript

$.fn.hummingbird.defaults.collapsedSymbol= "fa-arrow-circle-o-right";
$.fn.hummingbird.defaults.expandedSymbol= "fa-arrow-circle-o-down";
$.fn.hummingbird.defaults.checkDoubles= true; 
$.fn.hummingbird.defaults.checkDisabled= true;
...


```    

<br>
Initialize hummingbird-treeview:

```javascript

$("#treeview").hummingbird();

```

<br>
Congratulations, you are done, your HTML list has now treeview functionality.
<br>
<br>
<br>

<h2>Options</h2>
As you have seen above, options can be adjusted by calling
<pre><code>
$.fn.hummingbird.defaults.option= value;
</code></pre>
Following options are available:
<ul>
<li><b>collapsedSymbol</b><br>
Default="fa-plus". This can be any icon
from the <a href="http://fontawesome.io/icons/">Font Awesome</a> icons.</li>
<li><b>expandedSymbol</b><br>
Default="fa-minus". This can be any icon
from the <a href="http://fontawesome.io/icons/">Font Awesome</a> icons.</li>
<li><b>collapseAll</b><br>
Default="true". On initialization, all
nodes are collapsed. Change this to false to expand the nodes on initialisation.</li>
<li><b>checkboxes</b><br>
Default="enabled". Checkboxes are used per
default. Set this to "disabled" to get a
treeview without checkboxes.</li>
<li><b>checkDoubles</b><br>
Default="false". Set this to "true" to enable the functionality to account for multi-doubles.</li>
<li><b>checkDisabled</b><br>
Default="false". Set this to "true" to enable the functionality to account for disabled nodes.</li>		
</ul>
<br>
<h2>Methods</h2>
Methods are used to interact with the treeview programmatically. Following methods are available:

- **checkAll()**<br>
  Checks all nodes including full support for disabled nodes.

```javascript

$("#treeview").hummingbird("checkAll");

```

- **uncheckAll()**<br>
  Unchecks all nodes including full support for disabled nodes.

```javascript

$("#treeview").hummingbird("uncheckAll");

```








































