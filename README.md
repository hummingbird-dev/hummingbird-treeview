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
		    <ul>
			<li><b>checkAll()</b><br>
			    Checks all nodes including full support for disabled nodes.

```javascript

$("#treeview").hummingbird("checkAll");

```

			</li>
			<li><b>uncheckAll()</b><br>
			    Unchecks all nodes including full support for disabled nodes.

```javascript

$("#treeview").hummingbird("uncheckAll");

```

			</li>
			<li><b>collapseAll()</b><br>
			    Collapses all nodes.

```javascript

$("#treeview").hummingbird("collapseAll");

```

			</li>
			<li><b>expandAll()</b><br>
			    Expands all nodes.

```javascript

$("#treeview").hummingbird("expandAll");

```

			</li>
			<li><b>checkNode(attr,name,{expandParents})</b><br>
			    Checks a node, which is identified by its
			    id or data-id, which has to be defined in
			    the attr parameter. The name parameter
			    holds the name of the id or data-id. Set
			    optionally expandParents to true, if the
			    parents of this node should be expanded on
			    checking. Default of expandParents is
			    false.<pre><code>
$("#treeview").hummingbird("checkNode",{attr:"id",name: "node-0-1-1-2",expandParents:false});

			</li>
			<li><b>uncheckNode(attr,name,{collapseChildren})</b><br>
			    Unchecks a node, which is identified by its
			    id or data-id, which has to be defined in
			    the attr parameter. The name parameter
			    holds the name of the id or data-id. Set
			    optionally collapseChildren to true, if the
			    children of this node should be collapsed on
			    unchecking. Default of collapseChildren is
			    false.<pre><code>
$("#treeview").hummingbird("checkNode",{attr:"id",name: "node-0-1-1-2",collapseChildren:false});
			    </code></pre>
			</li>
			<li><b>expandNode(attr,name,{expandParents})</b><br>
			    Expands a node, which is identified by its
			    id or data-id, which has to be defined in
			    the attr parameter. The name parameter
			    holds the name of the id or data-id. Set
			    optionally expandParents to true, if the
			    parents of this node should be
			    expanded. Default of expandParents is
			    false.<pre><code>
$("#treeview").hummingbird("expandNode",{attr:"id",name: "node-0-1-1-2",expandParents:true});
			    </code></pre>
			</li>
			<li><b>collapseNode(attr,name,{collapseChildren})</b><br>
			    Collapses a node, which is identified by its
			    id or data-id, which has to be defined in
			    the attr parameter. The name parameter
			    holds the name of the id or data-id. Set
			    optionally collapseChildren to true, if the
			    children of this node should be
			    collapsed. Default of collapseChildren is
			    false.<pre><code>
$("#treeview").hummingbird("collapseNode",{attr:"id",name: "node-0-1-1-2",collapseChildren:true});
			    </code></pre>
			</li>
			<li><b>disableNode(attr,name,state)</b><br>
			    Disables a node, which is identified by
			    its id or data-id, which has to be defined
			    in the attr parameter. The name parameter
			    holds the name of the id or data-id.  Set
			    state to true if the node should be
			    disabled and checked, set it to false if
			    the node should be disabled and unchecked.
			    <pre><code>
$("#treeview").hummingbird("disableNode",{attr:"id",name: "node-0-1-1-2",state:true});
			    </code></pre>
			</li>
			<li><b>enableNode(attr,name,state)</b><br>
			    Enables a former disabled node, which is identified by
			    its id or data-id, which has to be defined
			    in the attr parameter. The name parameter
			    holds the name of the id or data-id.  Set
			    state to true if the node should be
			    enabled and checked, set it to false if
			    the node should be enabled and unchecked.
			    <pre><code>
$("#treeview").hummingbird("enableNode",{attr:"id",name: "node-0-1-1-2",state:false});
			    </code></pre>
			</li>
			<li><b>getChecked(attr,List,{OnlyFinalInstance})</b><br>
			    Get checked nodes. Retrieve the id or
			    data-id, which is defined via the attr
			    parameter. Set OnlyFinalInstance to true
			    if you want to retrieve only that nodes
			    identified by class="hummingbirdNoParent",
			    i.e. those nodes without children, so to
			    speak the last instance. Default is false,
			    which means that all checked nodes are retrieved.
			    Define an array, e.g. List, for the output
			    of this method. Finally this List array
			    can be bound to a DOM element and it is
			    also straight forward to do other stuff
			    with that array, e.g. retrieving the
			    length of it.  <pre><code>
var List = [];
$("#treeview").hummingbird("getChecked",{attr:"id",list:List,OnlyFinalInstance:true});
$("#displayItems").html(List.join("&#60;br&#62;"));
var L = List.length;
			    </code></pre>
			</li>
			<li><b>getUnchecked(attr,List,{OnlyFinalInstance})</b><br>
			    Get unchecked nodes. Retrieve the id or
			    data-id, which is defined via the attr
			    parameter. Set OnlyFinalInstance to true
			    if you want to retrieve only that nodes
			    identified by class="hummingbirdNoParent",
			    i.e. those nodes without children, so to
			    speak the last instance. Default is false,
			    which means that all unchecked nodes are retrieved.
			    Define an array, e.g. List, for the output
			    of this method. Finally this List array
			    can be bound to a DOM element and it is
			    also straight forward to do other stuff
			    with that array, e.g. retrieving the
			    length of it.  <pre><code>
var List = [];
$("#treeview").hummingbird("getUnchecked",{attr:"id",list:List,OnlyFinalInstance:true});
$("#displayItems").html(List.join("&#60;br&#62;"));
var L = List.length;
			    </code></pre>
			</li>
			<li><b>search(treeview_container,search_input,search_output,search_button,{scrollOffset,OnlyFinalInstance,dialog,EnterKey,enter_key_1,enter_key_2})</b><br>
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
			    testing. OnlyFinalInstance is per default
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
			    <pre><code>			    
$("#treeview").hummingbird("search",{treeview_container:"treeview_container",search_input:"search_input",search_output:"search_output",search_button:"search_button",scrollOffset:-515,OnlyFinalInstance:false});			
			    </code></pre>
			    As an example, the search functionality is here
			    implemented using <a href="http://getbootstrap.com/">Bootstrap</a>. Other implementation are possible.
			    <div class="row">
				<div class="col-sm-6">
				    <button class="btn btn-responsive btn-block btn-primary" id="treeview_example_search_html">Show HTML</button>
				</div>
				<div class="col-sm-6">
				    <button class="btn btn-responsive btn-block btn-primary" id="treeview_example_search_css">Show CSS</button>
				</div>
				<div id="treeview_example_search_html_display" style="display:none">
				    <pre><code>
&#60;div class="dropdown"&#62;
    &#60;div class="input-group stylish-input-group"&#62;
	&#60;input id="search_input" type="text" class="form-control" placeholder="Search" onclick="this.select()"&#62;
	&#60;span class="input-group-addon" style="border-left:0"&#62;
	    &#60;button type="submit" id="search_button"&#62;
		&#60;span class="glyphicon glyphicon-search"&#62;&#60;/span&#62;
	    &#60;/button&#62;
	&#60;/span&#62;
	&#60;ul class="dropdown-menu h-scroll" id="search_output"&#62;
	&#60;/ul&#62;
    &#60;/div&#62;
&#60;/div&#62;
				    </code></pre>					
				</div>
				<div id="treeview_example_search_css_display" style="display:none">
				    <pre><code>
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
				    </code></pre>
				</div>
			    </div>							    
			</li>
		    </ul>
		    <br>
		    <br>
		    <h2>Events</h2>


























































