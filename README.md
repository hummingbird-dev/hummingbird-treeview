# hummingbird-treeview

A tiny and fast jQuery treeview plugin

#### [Visit demo page ](https://hummingbird-dev.000webhostapp.com/hummingbird-treeview)

## Features

- Display hierarchical tree structures.
- Based on simple HTML lists.
- Tri-state logic.
- Manual and programmatical check, uncheck, collapse, expand, etc.
- Supports n-tuple nodes, i.e. doubles, triplets, etc.
- Supports disabled nodes, checked or unchecked.
- Get checked/unchecked items programmatically.
- Supports HTML5 data-* attribute to embed custom data.
- Supports Font Awesome icons.
- Search function.


## Dependencies

- jQuery v3.1.1 or newer
- font-awesome v4.7.0 or newer


## Example 

![alt text](./hummingbird-treeview.png "hummingbird-treeview example")


## Getting started
### Usage

Add the following resources for the hummingbird-treeview to function correctly:

```html
	
    <!-- Required Stylesheets -->
    <link href="/path/to/font-awesome.css" rel="stylesheet">
    <link href="/path/to/hummingbird-treeview.css" rel="stylesheet">

    <!-- Required Javascript -->
    <script src="/path/to/jquery.js"></script>
    <script src="/path/to/hummingbird-treeview.js"></script>

```

Bind the hummingbird-treeview to a scrollable DOM element:

```html

     <div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;">
     <!-- treeview structure/data here -->
     <div>

```

Create treeview structure/data:	

```html

    <div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;">
    	<ul id="treeview" class="hummingbird-base">
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
				    <input class="hummingbird-end-node" id="xnode-0-1-1" data-id="custom-0-1-1" type="checkbox" /> node-0-1-1
				</label>
			    </li>
			    <li>
				<label>
				    <input class="hummingbird-end-node" id="xnode-0-1-2" data-id="custom-0-1-2" type="checkbox" /> node-0-1-2
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
				    <input class="hummingbird-end-node" id="xnode-0-2-1" data-id="custom-0-2-1" type="checkbox" /> node-0-2-1
				</label>
			    </li>
			    <li>
				<label>
				    <input class="hummingbird-end-node" id="xnode-0-2-2" data-id="custom-0-2-2" type="checkbox" /> node-0-2-2
				</label>
			    </li>
			</ul>
		    </li>
		</ul>
	    </li>
	</ul>
    </div>

```

Only change the following:
### Treeview structure and node properties

- **div id**<br>
  The `<div id="treeview_container"` ... can be chosen arbitrarily, but of course must be referred to consistently.
  
- **ul id**<br>
The `<ul id="treeview"` ... can be chosen.

- **ul class="hummingbird-base"**<br>
The base `ul` must be assigned to the "hummingbird-base" class: `<ul id="treeview" class="hummingbird-base">`

- **input id's and data-id's**<br>
  The input id's and data-id's
  e.g. `<input id="xnode-0" data-id="custom-0"` ... can be set. The
  data-id can be any text. It is important for the support of
  the n-tuple (doubles, triplets, ...) nodes. That means you can have more than one node with
  the same data-id's but different id's. Thus every node can be
  addressed via the unique id. And all copies of a node including
  itself can be addressed via the common data-id.

- **input class="hummingbird-end-node"**<br>
  Add this to every node, which is
  not a parent, i.e. which has no children or nodes below.
  
Do not change the "fa fa-plus", do this via the options (see below).

Change **font-size**, **line-height**, checkbox
**width** and **height** directly in the
hummingbird-treeview.css.

Set options, e.g.:

```javascript

$.fn.hummingbird.defaults.collapsedSymbol= "fa-arrow-circle-o-right";
$.fn.hummingbird.defaults.expandedSymbol= "fa-arrow-circle-o-down";
$.fn.hummingbird.defaults.checkDoubles= true; 
...

```    

Initialize hummingbird-treeview:

```javascript

$("#treeview").hummingbird();

```

Congratulations, you are done, your HTML list has now treeview functionality.



## Options
As you have seen above, options can be adjusted by calling

```javascript

$.fn.hummingbird.defaults.option= value;

```

Following options are available:

- **collapsedSymbol**<br>
  String, default="fa-plus". This can be any icon
  from the <a href="http://fontawesome.io/icons/">Font Awesome</a> icons.

- **expandedSymbol**<br>
  String, default="fa-minus". This can be any icon
  from the <a href="http://fontawesome.io/icons/">Font Awesome</a> icons.

- **collapseAll**<br>
  Boolean, default=true. On initialization, all
  nodes are collapsed. Change this to false to expand the nodes on initialisation.

- **checkboxes**<br>
  String, default="enabled". Checkboxes are used per
  default. Set this to "disabled" to get a
  treeview without checkboxes.

- **checkboxesGroups**<br> String, default="enabled". Set this to
  "disabled" to disable all checkboxes from nodes that are parents,
  i.e. which have child nodes.  Set this to "disabled_grayed" to also
  apply a "grayed" font color to the node text. Note that disabling
  parent nodes means that they are not clickable, but still provide
  tri-state functionality. Thus, if a child of a disabled parent has
  been checked, the parent node is set to the indeterminate state to
  indicate that a child has been checked.

- **checkDoubles**<br> Boolean, default=false. Set this to true to
  enable the functionality to account for n-tuples (doubles,
  triplets, ...). That means, if we have e.g. two equal nodes (i.e. same data-id)
  and one of these is checked then the other will be checked
  automatically. The same applies for triplets, quadruplets, etc. By
  enabling this option, also the full tri-state functionality accounts for the n-tuples.



## Methods
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

- **collapseAll()**<br>
  Collapses all nodes.

```javascript

$("#treeview").hummingbird("collapseAll");

```

- **expandAll()**<br>
  Expands all nodes.

```javascript

$("#treeview").hummingbird("expandAll");

```

- **checkNode(attr,name,{expandParents})**<br>
  Checks a node, which is identified by its
  id or data-id, which has to be defined in
  the attr parameter. The name parameter
  holds the name of the id or data-id. Set
  optionally expandParents to true, if the
  parents of this node should be expanded on
  checking. Default of expandParents is
  false.

```javascript

$("#treeview").hummingbird("checkNode",{attr:"id",name: "node-0-1-1-2",expandParents:false});

```

- **uncheckNode(attr,name,{collapseChildren})**<br>
  Unchecks a node, which is identified by its
  id or data-id, which has to be defined in
  the attr parameter. The name parameter
  holds the name of the id or data-id. Set
  optionally collapseChildren to true, if the
  children of this node should be collapsed on
  unchecking. Default of collapseChildren is
  false.

```javascript

$("#treeview").hummingbird("checkNode",{attr:"id",name: "node-0-1-1-2",collapseChildren:false});

```

- **expandNode(attr,name,{expandParents})**<br>
  Expands a node, which is identified by its
  id or data-id, which has to be defined in
  the attr parameter. The name parameter
  holds the name of the id or data-id. Set
  optionally expandParents to true, if the
  parents of this node should be
  expanded. Default of expandParents is
  false.

```javascript

$("#treeview").hummingbird("expandNode",{attr:"id",name: "node-0-1-1-2",expandParents:true});

```

- **collapseNode(attr,name,{collapseChildren})**<br>
  Collapses a node, which is identified by its
  id or data-id, which has to be defined in
  the attr parameter. The name parameter
  holds the name of the id or data-id. Set
  optionally collapseChildren to true, if the
  children of this node should be
  collapsed. Default of collapseChildren is
  false.

```javascript

$("#treeview").hummingbird("collapseNode",{attr:"id",name: "node-0-1-1-2",collapseChildren:true});

```

- **disableNode(attr,name,state,{disableChildren})**<br> Disables a
  node, which is identified by its id or data-id, which has to be
  defined in the attr parameter. The name parameter holds the name of
  the id or data-id.  Set state to true if the node should be disabled
  and checked, set it to false if the node should be disabled and
  unchecked. Optionally set disableChildren to false or true, default
  is true. Note that full tri-state functionality is provided also for
  disabled nodes, although that they are not clickable. Additionally
  if all children of a parent node are disabled, that parent is
  automatically disabled. Although it looks like introducing a logic
  conflict, a parent node can be disabled, while the children are
  enabled. In such a case full tri-state functionality is applied to
  that parent, but it is still not clickable, i.e. disabled.

```javascript

$("#treeview").hummingbird("disableNode",{attr:"id",name: "node-0-1-1-2",state:true,disableChildren:true});

```

- **enableNode(attr,name,state,{enableChildren})**<br> Enables a
  former disabled node, which is identified by its id or data-id,
  which has to be defined in the attr parameter. The name parameter
  holds the name of the id or data-id.  Set state to true if the node
  should be enabled and checked, set it to false if the node should be
  enabled and unchecked. Optionally set enableChildren to false or
  true, default is true. Additionally, enabling a parent nodes with
  all children disabled (enableChildren=false) is not allowed. Similar
  to the disableNode above it is possible to have a parent node
  disabled, while the children are enabled. In such a case full
  tri-state functionality is applied to that parent, but it is still
  not clickable, i.e. disabled.

```javascript

$("#treeview").hummingbird("enableNode",{attr:"id",name: "node-0-1-1-2",state:false,enableChildren:true});

```

- **getChecked(attr,List,{onlyEndNodes})**<br>
  Get checked
  nodes. Retrieve the id, data-id or text, which is defined via the
  attr parameter. Thus, if you want to extract the text of a node set
  attr:"text". Set onlyEndNodes to true if you want to retrieve only
  that nodes identified by class="hummingbird-end-node", i.e. those
  nodes without children, so to speak the last instance. Default is
  false, which means that all checked nodes are retrieved.  Define an
  array, e.g. List, for the output of this method. Finally this List
  array can be bound to a DOM element and it is also straight forward
  to do other stuff with that array, e.g. retrieving the length of it.

```javascript

var List = [];
$("#treeview").hummingbird("getChecked",{attr:"id",list:List,onlyEndNodes:true});
$("#displayItems").html(List.join("<br>"));
var L = List.length;

```

- **getUnchecked(attr,List,{onlyEndNodes})**<br>
  Get unchecked
  nodes. Retrieve the id, data-id or text, which is defined via the
  attr parameter. Thus, if you want to extract the text of a node set
  attr:"text". Set onlyEndNodes to true if you want to retrieve only
  that nodes identified by class="hummingbird-end-node", i.e. those
  nodes without children, so to speak the last instance. Default is
  false, which means that all unchecked nodes are retrieved.  Define
  an array, e.g. List, for the output of this method. Finally this
  List array can be bound to a DOM element and it is also straight
  forward to do other stuff with that array, e.g. retrieving the
  length of it.

```javascript

var List = [];
$("#treeview").hummingbird("getUnchecked",{attr:"id",list:List,onlyEndNodes:true});
$("#displayItems").html(List.join("<br>"));
var L = List.length;

```

- **search(treeview_container,search_input,search_output,search_button,{scrollOffset, onlyEndNodes, dialog, EnterKey, enter_key_1, enter_key_2})**<br>
  If the treeview is embedded in a
  scrollable (css option: overflow-y:
  scroll;) container, this container must be
  identified here as the treeview_container
  (using the id). Otherwise
  treeview_container should be set to
  "body". The search_input parameter depicts
  the id of the input element for the search
  function. The search_output defines an
  element to bind the search results on
  (like the ul in the example below). The search_button is
  simply the button for the search. A
  scrollOffset in pixels (negative or
  positive) can be defined to adjust the
  automatic scoll position. The best value
  must be observed by
  testing. onlyEndNodes is per default
  false, thus set this to true if the search
  should include also parent nodes. The
  optional parameter dialog is per default
  empty (""). This parameter can be used for
  special cases, to bind the treeview to a
  dynamical created object like a bootstrap
  modal (pop-up). In such a case this
  parameter would be
  dialog:".modal-dialog". Three other
  optional parameters, EnterKey, enter_key_1
  and enter_key_2 are available. EnterKey is
  per default true and can be set to
  false. If true the search_button can be
  triggered with the Enter key. To avoid
  interference of the Enter key
  functionality it can be restricted and
  only be executable if enter_key_1 ==
  enter_key_2. These two parameters can be
  chosen arbitrarily.

```javascript

$("#treeview").hummingbird("search",{treeview_container:"treeview_container", search_input:"search_input", search_output:"search_output", search_button:"search_button", scrollOffset:-515, onlyEndNodes:false});

```

  As an example, the search functionality is here
  implemented using <a href="http://getbootstrap.com/">Bootstrap</a>. Other implementation are possible.

  HTML:
  
```html

<div class="dropdown">
    <div class="input-group stylish-input-group">
	<input id="search_input" type="text" class="form-control" placeholder="Search" onclick="this.select()">
	<span class="input-group-addon" style="border-left:0">
	    <button type="submit" id="search_button">
		<span class="glyphicon glyphicon-search"></span>
	    </button>
	</span>
	<ul class="dropdown-menu h-scroll" id="search_output">
	</ul>
    </div>
</div>

```

  CSS:

```css

.stylish-input-group .input-group-addon{
    background: white !important;
}
.stylish-input-group .form-control{
    //border-right:0;
    box-shadow:0 0 0;
    border-color:#ccc;
}
.stylish-input-group button{
    border:0;
    background:transparent;
}

.h-scroll {
    background-color: #fcfdfd;
    height: 260px; 
    overflow-y: scroll;
}

```


## Events
Events are fired on changes of the treeview state so that your application can respond:

- **nodeChecked**<br>
  This event is fired if a node has been checked and can be catched like this:

```javascript

$("#treeview").on("nodeChecked", function(){
   do something ...
});

```

- **nodeUnchecked**<br>
  This event is fired if a node has been unchecked and can be catched like this:

```javascript

$("#treeview").on("nodeUnchecked", function(){
   do something ...
});

```

- **CheckUncheckDone**<br>
  This event is fired if a node has been
  checked or unchecked and all treeview
  functionality is completed. This comprises
  checking / unchecking parents, children,
  checking for n-tuples and disabled etc.

```javascript

$("#treeview").on("CheckUncheckDone", function(){
   do something ...
});

```









































