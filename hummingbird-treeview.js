(function($){

    //global variables

    //this is needed to temporarily disable doubles, e.g. for uncheckAll
    var uncheckAll_doubles = false;

    //this is now default and not changable anymore
    var checkDisabled = true;

    //
    var checkboxesGroups_grayed = false;
    var checkboxesGroups = false;


    //converter
    $(document).ready(function() {
	var all_converter = $(".hummingbird-treeview-converter");
	//console.log(all_converter);
	var converter_num = 1;
	var converter_str = "";
	$.each(all_converter,function(e){
	    if (converter_num > 1) {
		converter_str = converter_num.toString();
	    } 
	    converter_num++;


	    var converter = $(this);
	    console.log(converter)
	    
	    //hide simple treeview structure
	    converter.hide();

	    var converter_height = converter.attr("data-height");
	    var converter_scroll = converter.attr("data-scroll");
	    if (converter_scroll == "true") {
		converter_scroll = "scroll";
	    }

	    
	    //create new treeview container
	    var tree_html = '<div id="treeview_container' + converter_str + '" class="hummingbird-treeview" style="height: ' + converter_height  +'; overflow-y: ' + converter_scroll + ';">' +
		'<ul id="treeview' + converter_str + '" class="hummingbird-base">';


	    //get treeview elements
	    var tree = converter.children("li");

	    
	    //loop through the elements and create tree
	    var id_num = 0;
	    var id_str = "";
	    var data_id = "";
	    var item = "";
	    var allowed = true;
	    var msg = "";
	    $.each(tree, function(i,e) {
		var treeText = $(this).text();

		//Regular Expression for all leading hyphens
		var regExp = /^-+/;

		//Get leading hyphens
		var numHyphenMatch = treeText.match(regExp);
		var numHyphen_nextMatch = $(this).next().text().match(regExp);

		//Get count of leading hyphens
		//Now supports using hyphens anywhere except for the first character of the label
		var numHyphen = (numHyphenMatch != null ? numHyphenMatch[0].length : 0);
		var numHyphen_next = (numHyphen_nextMatch != null ? numHyphen_nextMatch[0].length : 0);

		//remove leading hyphens
		treeText = treeText.replace(regExp, "");
		//extract optional id and data-id		
		if ($(this).attr("id")) {
		    id_str = $(this).attr("id");
		} else {
		    id_num++;
		    id_str = "hum" + converter_str + "_" + id_num;
		}
		if ($(this).attr("data-id")) {
		    data_id = $(this).attr("data-id");
		} else {
		    data_id = treeText;
		}

		
		//what is this, parent, children or sibling
		//this is a parent
		//open an ul
		if (numHyphen < numHyphen_next) {
		    //check format
		    //down the tree it is not allowed to jump over a generation / instance
		    //
		    var check_diff = numHyphen_next - numHyphen;
		    if (check_diff>1) {
		    	msg = '<h4 style="color:red;">Error!</h4>The item after <span style="color:red;">' + treeText + ' </span>has too much hyphens, i.e. it is too far intended. Note that down the tree, the items are only allowed to be intended by one instance, i.e. one hyphen more than the item before. In contrast, up the tree arbitrarily large jumps are allowed.';
		    	//alert(msg);
		    	allowed = false;
		    }
		    //
		    item = item + '<li>' +"\n";
		    item = item + '<i class="fa fa-plus"></i>' + "\n";
		    item = item + '<label>' + "\n";
		    item = item + '<input id="' + id_str  + '" data-id="' + data_id + '" type="checkbox" /> ' + treeText;
		    item = item + '</label>' + "\n";
		    item = item + '<ul>' + "\n";
		    //console.log(item);
		}
		//hummingbird-end-node
		if (numHyphen == numHyphen_next) {
		    item = item + '<li>' +"\n";
		    item = item + '<label>' + "\n";
		    item = item + '<input class="hummingbird-end-node" id="' + id_str + '" data-id="' + data_id + '" type="checkbox" /> ' + treeText;
		    item = item + '</label>' + "\n";
		    item = item + '</li>' + "\n";
		    //console.log(item);
		}		
		//this is still a hummingbird-end-node
		//after this it goes up
		//thus close this ul
		if (numHyphen > numHyphen_next) {
		    item = item + '<li>' +"\n";
		    item = item + '<label>' + "\n";
		    item = item + '<input class="hummingbird-end-node" id="' + id_str + '" data-id="' + data_id + '" type="checkbox" /> ' + treeText;
		    item = item + '</label>' + "\n";
		    item = item + '</li>' + "\n";
		    item = item + '</ul>' + "\n";
		    //console.log(item);

		    //if numHyphen - numHyphen_next > 1
		    //it means that we have to close the group
		    var hyphen_diff = numHyphen - numHyphen_next;
		    for (var m=2;m<=hyphen_diff;m++) {
		    	item = item + '</ul>' + "\n";
		    	item = item + '</li>' + "\n";
		    }
		    //
		}

		
	    });
	    item = item + '</ul></div>';
	    //console.log(item)
	    tree_html = tree_html + item;
	    if (allowed == true) {
		//$(".hummingbird-treeview-converter").after(tree_html);
		converter.after(tree_html);
	    } else {
		//$(".hummingbird-treeview-converter").after(msg);
		converter.after(msg);
	    }

	});
	//end converter
    });

    
    $.fn.hummingbird = function(options){


	var methodName = options;
	var args = arguments;
	var options = $.extend( {}, $.fn.hummingbird.defaults, options);
	//initialisation
	if (typeof(methodName) == "undefined" ) {
	    return this.each(function(){
		//-------------------options-------------------------------------------------------//
		//change symbols
		if (options.collapsedSymbol != "fa-plus") {
		    $(this).find("i").removeClass("fa-plus").addClass(options.collapsedSymbol);
		}

		//hide checkboxes
		if (options.checkboxes == "disabled") {
		    $(this).find("input:checkbox").hide();
		}
		
		if (options.checkboxesGroups == "disabled") {
		    checkboxesGroups = true;
		    //find all checkboxes which have children and disable them
		    //tri-state logic will still be applied
		    //this_checkbox.prop("disabled",true).parent("label").css({'color':'#c8c8c8'});
		    var groups = $(this).find('input:checkbox:not(".hummingbird-end-node")');
		    groups.prop("disabled",true).parent("label").css({"cursor":"not-allowed"});
		}
		if (options.checkboxesGroups == "disabled_grayed") {
		    checkboxesGroups_grayed = true;
		    //find all checkboxes which have children and disable them
		    //tri-state logic will still be applied
		    //this_checkbox.prop("disabled",true).parent("label").css({'color':'#c8c8c8'});
		    var groups = $(this).find('input:checkbox:not(".hummingbird-end-node")');
		    groups.prop("disabled",true).parent("label").css({"cursor":"not-allowed",'color':'#c8c8c8'});
		}
		
		//collapseAll
		if (options.collapseAll === false) {
		    $.fn.hummingbird.expandAll($(this),options.collapsedSymbol,options.expandedSymbol);
		}
		//-------------------options-------------------------------------------------------//
		

		//initialise doubles logic
		var doubleMode = false;
		var allVariables = new Object;
		if (options.checkDoubles) {
		    $(this).find('input:checkbox.hummingbird-end-node').each(function() {
			if (allVariables[$(this).attr("data-id")]) {
			    allVariables[$(this).attr("data-id")].push($(this).attr("id"));
			    //console.log($(this))
			} else {
			    allVariables[$(this).attr("data-id")] = [$(this).attr("id")];
			}
		    });
		    //console.log(JSON.stringify(allVariables));
		}
		
		//three state logic
		//$.fn.hummingbird.ThreeStateLogic($(this),doubleMode,allVariables,options.checkDoubles,options.checkDisabled);		
		$.fn.hummingbird.ThreeStateLogic($(this),doubleMode,allVariables,options.checkDoubles,checkDisabled);
		
		//expandSingle
		$(this).on("click", 'li i.' + options.collapsedSymbol, function() {
		    $.fn.hummingbird.expandSingle($(this),options.collapsedSymbol,options.expandedSymbol);
		});
		//collapseSingle
		$(this).on("click", 'li i.' + options.expandedSymbol, function() {
		    $.fn.hummingbird.collapseSingle($(this),options.collapsedSymbol,options.expandedSymbol);
		});		
	    });
	}

	//checkAll
	if (methodName == "checkAll") {
	    return this.each(function(){
		$.fn.hummingbird.checkAll($(this));
	    });
	}

	//ucheckAll
	if (methodName == "uncheckAll") {
	    return this.each(function(){
		$.fn.hummingbird.uncheckAll($(this));
	    });
	}

	//disableNode
	if (methodName == "disableNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		var state = args[1].state;
		if (typeof args[1].disableChildren !== 'undefined') {
		    var disableChildren = args[1].disableChildren;
		} else {
		    var disableChildren = true;
		}
		$.fn.hummingbird.disableNode($(this),attr,name,state,disableChildren);
	    });
	}
	
	//enableNode
	if (methodName == "enableNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		var state = args[1].state;
		if (typeof args[1].enableChildren !== 'undefined') {
		    var enableChildren = args[1].enableChildren;
		} else {
		    var enableChildren = true;
		}
		$.fn.hummingbird.enableNode($(this),attr,name,state,enableChildren);
	    });
	}

	//checkNode
	if (methodName == "checkNode") {
	    return this.each(function(){		
		var name = args[1].name;
		var attr = args[1].attr;
		var expandParents = args[1].expandParents;
		$.fn.hummingbird.checkNode($(this),attr,name);
		if (expandParents == true) {
		    $.fn.hummingbird.expandNode($(this),attr,name,expandParents,options.collapsedSymbol,options.expandedSymbol);
		}
	    });
	}

	//uncheckNode
	if (methodName == "uncheckNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		var collapseChildren = args[1].collapseChildren;	
		$.fn.hummingbird.uncheckNode($(this),attr,name);
		if (collapseChildren == true) {
		    $.fn.hummingbird.collapseNode($(this),attr,name,collapseChildren,options.collapsedSymbol,options.expandedSymbol);
		}
	    });
	}

	

	//setNodeColor
	if (methodName == "setNodeColor") {
	    return this.each(function(){
		var attr = args[1];
		var ID = args[2];
		var color = args[3];
		$.fn.hummingbird.setNodeColor($(this),attr,ID,color);
	    });
	}


	//collapseAll
	if (methodName == "collapseAll") {
	    return this.each(function(){
		$.fn.hummingbird.collapseAll($(this),options.collapsedSymbol,options.expandedSymbol);
	    });
	}

	//expandAll
	if (methodName == "expandAll") {
	    return this.each(function(){
		$.fn.hummingbird.expandAll($(this),options.collapsedSymbol,options.expandedSymbol);
	    });
	}

	//expandNode
	if (methodName == "expandNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		var expandParents = args[1].expandParents;
		$.fn.hummingbird.expandNode($(this),attr,name,expandParents,options.collapsedSymbol,options.expandedSymbol);
	    });
	}

	//collapseNode
	if (methodName == "collapseNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		var collapseChildren = args[1].collapseChildren;
		$.fn.hummingbird.collapseNode($(this),attr,name,collapseChildren,options.collapsedSymbol,options.expandedSymbol);
	    });
	}

	//getChecked
	if (methodName == "getChecked") {
	    return this.each(function(){
		var attr = args[1].attr;
		var list = args[1].list;
		var onlyEndNodes = args[1].onlyEndNodes;
		$.fn.hummingbird.getChecked($(this),attr,list,onlyEndNodes);
	    });
	}

	//getUnchecked
	if (methodName == "getUnchecked") {
	    return this.each(function(){
		var attr = args[1].attr;
		var list = args[1].list;
		var onlyEndNodes = args[1].onlyEndNodes;
		$.fn.hummingbird.getUnchecked($(this),attr,list,onlyEndNodes);
	    });
	}

	//search
	if (methodName == "search") {
	    return this.each(function(){
		var treeview_container = args[1].treeview_container;
		var search_input = args[1].search_input;
		var search_output = args[1].search_output;
		var search_button = args[1].search_button;
		if (typeof args[1].dialog !== 'undefined') {
		    var dialog = args[1].dialog;
		} else {
		    var dialog = "";
		}
		if (typeof args[1].enter_key_1 !== 'undefined') {
		    var enter_key_1 = args[1].enter_key_1;
		} else {
		    var enter_key_1 = true;
		}
		if (typeof args[1].enter_key_2 !== 'undefined') {
		    var enter_key_2 = args[1].enter_key_2;
		} else {
		    var enter_key_2 = true;
		}
		if (typeof args[1].scrollOffset !== 'undefined') {
		    var scrollOffset = args[1].scrollOffset;
		} else {
		    var scrollOffset = false;
		}
		if (typeof args[1].onlyEndNodes !== 'undefined') {
		    var onlyEndNodes = args[1].onlyEndNodes;
		} else {
		    var onlyEndNodes = false;
		}
		if (typeof args[1].EnterKey !== 'undefined') {
		    var EnterKey = args[1].EnterKey;
		} else {
		    var EnterKey = true;
		}
		$.fn.hummingbird.search($(this),treeview_container,search_input,search_output,search_button,dialog,enter_key_1,enter_key_2,options.collapsedSymbol,options.expandedSymbol,scrollOffset,onlyEndNodes,EnterKey);
	    });
	}
    };


    //options defaults
    $.fn.hummingbird.defaults = {
	expandedSymbol: "fa-minus",
	collapsedSymbol: "fa-plus",
	collapseAll: true,
	checkboxes: "enabled",
	checkboxesGroups: "enabled",
	checkDoubles: false,
	//checkDisabled: false,   //this is now not changeable and true always
    };

    //global vars
    var nodeDisabled = false;
    var nodeEnabled = false;
    

    //-------------------methods--------------------------------------------------------------------------//
    
    //-------------------checkAll---------------//
    $.fn.hummingbird.checkAll = function(tree){
	tree.children("li").children("label").children("input:checkbox").prop('indeterminate', false).prop('checked', false).trigger("click");
    };

    //-------------------uncheckAll---------------//
    $.fn.hummingbird.uncheckAll = function(tree){
	//console.log(tree.children("li").children("label").children("input:checkbox"))
	//find disabled groups
	var disabled_groups = tree.find('input:checkbox:disabled:not(.hummingbird-end-node)');
	//console.log(disabled_groups)
	//enable these
	disabled_groups.prop('disabled', false)	
	//disable checking for doubles temporarily
	uncheckAll_doubles = true;
	tree.children("li").children("label").children("input:checkbox").prop('indeterminate', false).prop('checked', true).trigger("click");
	uncheckAll_doubles = false;
	//disable disabled groups again
	disabled_groups.prop('disabled', true)
	//console.log(tree.children("li").children("label").children("input:checkbox"));
    };

    //-------------------collapseAll---------------//
    $.fn.hummingbird.collapseAll = function(tree,collapsedSymbol,expandedSymbol){
	tree.find("ul").hide();
	tree.find('.' + expandedSymbol).removeClass(expandedSymbol).addClass(collapsedSymbol);
    };

    //------------------expandAll------------------//
    $.fn.hummingbird.expandAll = function(tree,collapsedSymbol,expandedSymbol){
	tree.find("ul").show();
	tree.find('.' + collapsedSymbol).removeClass(collapsedSymbol).addClass(expandedSymbol);
    };

    //-------------------collapseSingle---------------//
    $.fn.hummingbird.collapseSingle = function(node,collapsedSymbol,expandedSymbol){
	node.parent("li").children("ul").hide();
	node.removeClass(expandedSymbol).addClass(collapsedSymbol);
    };

    //-------------------expandSingle---------------//
    $.fn.hummingbird.expandSingle = function(node,collapsedSymbol,expandedSymbol){
	node.parent("li").children("ul").show();
	node.removeClass(collapsedSymbol).addClass(expandedSymbol);
    };

    //-------------------expandNode---------------//
    $.fn.hummingbird.expandNode = function(tree,attr,name,expandParents,collapsedSymbol,expandedSymbol){
	var that_node = tree.find('input[' + attr + '=' + name + ']');
	var that_ul = that_node.parent("label").siblings("ul");
	that_ul.show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
	//expand all parents and change symbol
	if (expandParents === true) {
	    that_node.parents("ul").show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
	}
    };

    //-------------------collapseNode---------------//
    $.fn.hummingbird.collapseNode = function(tree,attr,name,collapseChildren,collapsedSymbol,expandedSymbol){
	var that_node = tree.find('input[' + attr + '=' + name + ']');
	var that_ul = that_node.parent("label").siblings("ul");
	//collapse children and change symbol
	if (collapseChildren === true) {
	    that_node.parent("label").parent("li").find("ul").hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);
	} else {	    
	    that_ul.hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);
	}
    };

    //-------------------checkNode---------------//
    $.fn.hummingbird.checkNode = function(tree,attr,name){
	tree.find('input:checkbox:not(:checked)[' + attr + '=' + name + ']').prop("indeterminate",false).trigger("click");
    };

    //-------------------uncheckNode---------------//
    $.fn.hummingbird.uncheckNode = function(tree,attr,name){
	tree.find('input:checkbox:checked[' + attr + '=' + name + ']').prop("indeterminate",false).trigger("click");
    };

    //-------------------disableNode---------------//
    $.fn.hummingbird.disableNode = function(tree,attr,name,state,disableChildren){
	var this_checkbox = tree.find('input:checkbox:not(:disabled)[' + attr + '=' + name + ']');
	//for a disabled unchecked node, set node checked and then trigger a click to uncheck
	//for a disabled checked node, set node unchecked and then trigger a click to check
	this_checkbox.prop("checked",state === false);
	nodeDisabled = true;
	this_checkbox.trigger("click");
	//disable this node and all children
	if (disableChildren === true) {
	    this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8',"cursor":"not-allowed"});
	} else {
	    //console.log(this_checkbox.prop("disabled",true).parent("label").parent("li"))
	    this_checkbox.prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8',"cursor":"not-allowed"});
	}
    };

    //-------------------enableNode---------------//
    $.fn.hummingbird.enableNode = function(tree,attr,name,state,enableChildren){
	var this_checkbox = tree.find('input:checkbox:disabled[' + attr + '=' + name + ']');

	//a checkbox cannot be enabled if all children are disabled AND enableChildren is false
	//get children checkboxes which are not disabled
	var children_not_disabled_sum= this_checkbox.parent("label").next("ul").children("li").children("label").children("input:checkbox:not(:disabled)").length;
	if (children_not_disabled_sum == 0 && enableChildren == false) {
	    console.log("NOW!!!!!!!!!!!!!!!!!!!!!")
	    return;
	}
	//the state where a parent is enabled and all children are disabled must be forbidden

	//for a disabled unchecked node, set node checked and then trigger a click to uncheck
	//for a disabled checked node, set node unchecked and then trigger a click to check
	this_checkbox.prop("disabled",false).parent("label").parent("li").css({'color':'#636b6f',"cursor":"default"});
	//all parents enabled
	//no action on parents
	//this_checkbox.parent("label").parent("li").parents("li").children("label").children("input[type='checkbox']").prop("disabled",false).parents("label").parent("li").css({'color':'#636b6f',"cursor":"default"});
	//all children enabled
	if (enableChildren === true) {
	    this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).parent("label").parent("li").css({'color':'#636b6f',"cursor":"default"});
	}
	this_checkbox.prop("checked",state === false);
	nodeEnabled = true;
	this_checkbox.trigger("click");	
    };

    //--------------get all checked items------------------//
    $.fn.hummingbird.getChecked = function(tree,attr,list,onlyEndNodes){
	if (onlyEndNodes == true) {
	    tree.find('input:checkbox.hummingbird-end-node:checked').each(function() {
		if (attr == "text") {
		    list.push($(this).parent("label").parent("li").text());
		} else {
		    list.push($(this).attr(attr));
		}
	    });
	} else {
	    tree.find('input:checkbox:checked').each(function() {
		if (attr == "text") {
		    list.push($(this).parent("label").parent("li").text());
		} else {
		    list.push($(this).attr(attr));
		}		
	    });
	}
    };
    //--------------get all checked items------------------//

    //--------------get all unchecked items------------------//
    $.fn.hummingbird.getUnchecked = function(tree,attr,list,onlyEndNodes){
	if (onlyEndNodes == true) {
	    tree.find('input:checkbox.hummingbird-end-node:not(:checked)').each(function() {
		list.push($(this).attr(attr));
	    });
	} else {
	    tree.find('input:checkbox:not(:checked)').each(function() {
		list.push($(this).attr(attr));
	    });
	}
    };
    //--------------get all unchecked items------------------//


    //-------------------setNodeColor---------------//
    $.fn.hummingbird.setNodeColor = function(tree,attr,ID,color){
	tree.find('input:checkbox[' + attr + '=' + ID + ']').parent("li").css({'color':color});
    };
    
    //--------------three-state-logic----------------------//
    $.fn.hummingbird.ThreeStateLogic = function(tree,doubleMode,allVariables,checkDoubles,checkDisabled) {
	tree.find('input:checkbox').on('click', function(e) {
	    //console.log($(this))
	    //check / uncheck all checkboxes below that node, if they have children weather they are disabled or not
	    //do nothing with end-node-checkboxes which are disabled
	    //thus three state logic is applyed to groups although they are disabled and if they have children

	    //all not disabled
	    var nodes_below_not_disabled = $(this).parent("label").parent("li").find("input:checkbox:not(:disabled)");

	    //all disabled without hummingbird-end-node
	    var nodes_below_disabled_groups = $(this).parent("label").parent("li").find('input:checkbox:disabled:not(.hummingbird-end-node)');

	    //add them together
	    var nodes_below = nodes_below_not_disabled.add(nodes_below_disabled_groups);
	    
	    //merge
	    //var nodes_below = ;

	    
	    var ids = [];
	    nodes_below.each(function(){
		ids.push($(this).attr("id"));
	    });
	    //console.log("this");
	    //console.log($(this));
	    if ($(this).prop("checked")) {
	    	var state = true;
	    	var checkSiblings = "input:checkbox:not(:checked)";
		//fire event
		tree.trigger("nodeChecked",ids.join());
	    } else {
	    	var state = false;
	    	var checkSiblings = "input:checkbox:checked";
		//fire event
		tree.trigger("nodeUnchecked",ids.join());
	    }		 		 
	    //check / uncheck all checkboxes below that node
	    nodes_below.prop("indeterminate",false).prop("checked",state);
	    //set all parents indeterminate and unchecked
	    //if checkDisabled===false treat all disabled as if they were not there
	    //do it for all if checkDisabled===true
	    //if checkDisabled===false do it if it was not a disabled node, i.e. nodeDisabled===false
	    //if (checkDisabled || nodeDisabled === false) {
		$(this).parent("label").parent().parents("li").children("label").children("input:checkbox").prop("indeterminate",true);
		$(this).parent("label").parent().parents("li").children("label").children("input:checkbox").prop("checked",false);	
	    

	    //travel down the dom through all ul's, but not the ul directly under that, because that will be changed
	    //console.log($(this).parent("label").parent("li").find("ul"))
	    $(this).parent("label").siblings("ul").find("ul").map(function(){
	     	//console.log($(this))

		
		//check if children are disabled
		//console.log($(this).parent("label").next("ul").children("li").children("label").children("input:checkbox"))
		//var not_disabled_sum_children = $(this).parent("label").next("ul").children("li").children("label").children("input:checkbox:not(:disabled)").length;
		var disabled_sum_children = $(this).children("li").children("label").children("input:checkbox:disabled").length;
		//console.log("disabled_sum_children= " + disabled_sum_children)
		//if a check has happened count how many are checked
		//if an uncheck has happened count how many are unchecked
		//var checked_unchecked_sum_children = $(this).parent("label").next("ul").children("li").children("label").children(checkSiblings).length;
		//a check has happened
		    var checked_sum_children = $(this).children("li").children("label").children("input:checkbox:checked").length;
		    var unchecked_sum_children = $(this).children("li").children("label").children("input:checkbox:not(:checked)").length;
		//console.log("checked_sum_children= " + checked_sum_children)
		//console.log("unchecked_sum_children= " + unchecked_sum_children)
		//if all children disabled set appropriate state of this checkbox
		//This happens e.g. if all children of this box are disabled and checked, so this box is actually also checked and disabled, but because it is
		//not an end-node it can be checked, unchecked. Now a parent of this has been unchecked, thus this box is also unchecked, although all children are checked
		//thus the appropriate state has to be set again

		//there are children disabled:
		//if a check happened, all children are checked
		//if an uncheck happened all children are unchecked
		if (disabled_sum_children > 0) {
		    if (checked_sum_children == 0) {
			$(this).siblings("label").children("input:checkbox").prop("checked",false);
		    }
		    if (unchecked_sum_children == 0) {
			$(this).siblings("label").children("input:checkbox").prop("checked",true);
		    }
		    if (checked_sum_children > 0 && unchecked_sum_children > 0) {
			$(this).siblings("label").children("input:checkbox").prop("checked",false).prop("indeterminate",true);
		    }
		}

	    });


	    
	    //}
	    //travel up the DOM
	    //test if siblings are all checked / unchecked / indeterminate       
	    //check / uncheck parents if all siblings are checked /unchecked
	    //thus, set parents checked / unchecked, if children are all checked or all unchecked with no indeterminates
	    //do this for all
	    //if (checkDisabled) {
		$(this).parent("label").parents("li").map(function() {
		    //console.log($(this))
		    var indeterminate_sum = 0;
		    //number of checked if an uncheck happened or number of unchecked if a check happened
		    var checked_unchecked_sum = $(this).siblings().addBack().children("label").children(checkSiblings).length;
		    //check how many not disabled are here (below that parent)
		    if (checkDisabled) {
			var not_disabled_sum = $(this).siblings().addBack().children("label").children("input:checkbox:not(:disabled)").length;
			//console.log("not_disabled_sum= " + not_disabled_sum)
		    }

		    //console.log("checkDisabled= " + checkDisabled)
		    //checkDisabled means that disabled boxes are considered by the tri-state logic
		    //these are the not disabled siblings together with node itself
		    //var not_disabled_sum = $(this).siblings().addBack().children("label").children("input:checkbox:not(:disabled)").length;
		    //console.log("not_disabled_sum= " + not_disabled_sum);
	    	    $(this).siblings().addBack().children("label").children("input:checkbox").map(function() {
	    		    indeterminate_sum = indeterminate_sum + $(this).prop("indeterminate");
	    	    });
		    //this is 0 if there are no checked, thus an uncheck has happened
	    	    if ((indeterminate_sum + checked_unchecked_sum) == 0) {
	    		$(this).parent().parent().children("label").children("input:checkbox").prop("indeterminate",false);
	    		$(this).parent().parent().children("label").children("input:checkbox").prop("checked",state);
	    	    }
	
		    //if this click was together width a disableNode then, there is one more disabled child, thus not_disabled_sum--
		    if (checkDisabled) {
		    	if (nodeDisabled == true) {
		    	    not_disabled_sum--;
		    	}
		    	//if all children are disabled, disable also parent
		    	if (not_disabled_sum == 0) {
			    //console.log("here")
		    	    //console.log($(this).parent().parent().children("label").children("input[type='checkbox']"))
			    //only disable parents if they are not already disabled by the checkboxesGroups options
			    if (checkboxesGroups_grayed == false && checkboxesGroups == false) {
				$(this).parent().parent().children("label").children("input[type='checkbox']").prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8'});
			    }
		    	}
		    }		    
		});
	    //}
	    
	    //------------------check if this variable has doubles-----------------------//
	    //------------------and click doubles if needed------------------------------//
	    //------------------only if this is not a double check-----------------------//
	    if (checkDoubles == true && uncheckAll_doubles == false) {
		if (doubleMode == false) {
	    	    //do this for all checked / unchecked checkboxes below that node
	    	    $(this).parent("label").parent("li").find("input.hummingbird-end-node[type='checkbox']").each(function() {
	    		//check if this node has doubles
	    		var L = allVariables[$(this).attr("data-id")].length;
	    		if ( L > 1) {
	    		    doubleMode = true;
	    		    //if state of these checkboxes is not similar to state
	    		    //-> trigger click
	    		    var Zvar = allVariables[$(this).attr("data-id")];
	    		    for (var i=0;i<L;i++) {
	    			if ($("#" + Zvar[i] ).prop("checked") != state) {
	    			    $("#" + Zvar[i] ).trigger("click");
	    			}
	    		    }
	    		}
	    	    });
	    	    doubleMode = false;
		}
	    }
	    //------------------check if this variable has doubles------------------------//



	    //--------------------------disabled-----------------------------------------//
	    //check if this box has hummingbird-end-node children
	    if (checkDisabled) {
		if ($(this).hasClass("hummingbird-end-node") === false) {
		    //if this box has been checked, check if "not checked disabled" exist
		    if (state === true) {
			var disabledCheckboxes = $(this).parent("label").parent("li").find("input:checkbox:not(:checked):disabled");
			var num_state_inverse_Checkboxes = $(this).parent("label").parent("li").find("input:checkbox:checked");
		    }
		    //if this box has been unchecked, check if "checked disabled" exist
		    if (state === false) {
			var disabledCheckboxes = $(this).parent("label").parent("li").find("input:checkbox:checked:disabled");
			var num_state_inverse_Checkboxes = $(this).parent("label").parent("li").find("input:checkbox:not(:checked)");
		    }
		    //if this box has been checked and unchecked disabled exist
		    //set this and all parents indeterminate and checked false. Setting checked false is important to make this box ready for a check
		    //not if all checked or unchecked
		    if (disabledCheckboxes.length > 0 && num_state_inverse_Checkboxes.length > 0) {
			//only if the boxes are enabled
			disabledCheckboxes.parent("label").parent("li").parents("li").children("label").children("input:checkbox:not(:disabled)").prop("indeterminate",true).prop("checked",state);
		    }
		}
	    }
	    //--------------------------disabled-----------------------------------------//

	    
	    //set nodeDisabled and nodeEnabled back to false
	    //so that the next clicked node can be a normal node or again a disbaled node
	    nodeDisabled = false;
	    nodeEnabled = false;

	    
	    //fire event
	    tree.trigger("CheckUncheckDone");	    
	});
    }
    //--------------three-state-logic----------------------//


    //----------------------------search--------------------------------------//
    $.fn.hummingbird.search = function(tree,treeview_container,search_input,search_output,search_button,dialog,enter_key_1,enter_key_2,collapsedSymbol,expandedSymbol,scrollOffset,onlyEndNodes,EnterKey) {

	//trigger search on enter key 
	if (EnterKey == true) {
	    $(document).keyup(function(e) {
		if (e.which == 13) {
		    //console.log("current_page= " + enter_key_2)
		    if (enter_key_1 == enter_key_2) {
			$(dialog + " #" + search_button).trigger("click");
		    }
		}
	    });
	}
	var first_search = true;
	var this_var_checkbox = {};
	//hide dropdown search list
	$(dialog + " #" + search_input).on("click", function(e) {
	    $(dialog + " #" + search_output).hide();
	});

	$(dialog + " #" + search_button).on("click", function(e) {
	    //show dropdown search list
	    $(dialog + " #" + search_output).show();
	    var search_str = $(dialog + " #" + search_input).val().trim();
	    //empty dropdown
	    $(dialog + " #" + search_output).empty();
	    //loop through treeview
	    var num_search_results = 0;
	    if (onlyEndNodes == true) {
		var onlyEndNodes_Class = ".hummingbird-end-node";
	    } else {
		var onlyEndNodes_Class = "";
	    }
	    tree.find('input:checkbox' + onlyEndNodes_Class).each(function() {
		if ($(this).parent().text().toUpperCase().includes(search_str.toUpperCase())) {
		    //add items to dropdown
		    $(dialog + " #" + search_output).append('<li id="drop_' + $(this).attr("id")  + '"><a href="#">' + $(this).parent().text() + '</a></li>');
		    num_search_results++;
		}
	    });
	    if (num_search_results == 0) {
		$(dialog + " #" + search_output).append("&nbsp; &nbsp; Nothing found");
	    }
	    //click on search dropdown
	    $(dialog + " #" + search_output + " li").on("click", function(e) {
		//no focus on the input field to trigger the search scrolling
		e.preventDefault();
	    	//hide dropdown
	    	$(dialog + " #" + search_output).hide();
	    	//set value of input field
	    	$(dialog + " #" + search_input).val($(this).text());
	    	//reset color of last selection
	    	if (first_search == false) {
		    if (this_var_checkbox.prop("disabled")) {
			this_var_checkbox.parent("label").parent("li").css({'color':'#c8c8c8',"cursor":"not-allowed"});
		    } else {
			this_var_checkbox.parent("label").parent("li").css({'color':'#636b6f',"cursor":"default"});
		    }
	    	}
	    	//before jumping to the hummingbird-end-node a collapse all is needed
	    	tree.hummingbird("collapseAll");
	    	//get this checkbox
	    	this_var_checkbox = tree.find('input[id="' + $(this).attr("id").substring(5) + '"]');
		//parent uls
	    	var prev_uls = this_var_checkbox.parents("ul");
		//change plus to minus
	    	prev_uls.closest("li").children("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
		//highlight hummingbird-end-node
	    	this_var_checkbox.parent("label").parent("li").css({'color':'#f0ad4e'});
	    	first_search = false;
	    	//expand parent uls
		prev_uls.show();
		//---------------------------scrolling-----------------------------------//
		//set scroll position to zero
		if (treeview_container == "body") {
		    //Chrome
		    document.body.scrollTop = 0;
		    //Firefox
		    document.documentElement.scrollTop = 0;
		} else {		    
		    $(dialog + " #" + treeview_container)[0].scrollTop = 0;
		}		    
		//get position and offset of element
		var this_var_checkbox_position = this_var_checkbox.position().top;
		this_var_checkbox_position = this_var_checkbox_position+scrollOffset;
		
		if (treeview_container == "body") {
		    //Chrome
		    document.body.scrollTop += this_var_checkbox_position;
		    //Firefox
		    document.documentElement.scrollTop += this_var_checkbox_position;
		} else {
		    $(dialog + " #" + treeview_container)[0].scrollTop = this_var_checkbox_position;
		}		    
		//---------------------------scrolling-----------------------------------//
	    });
	    //if there is only one search result -> go to this without showing the dropdown
	    if (num_search_results == 1) {
	    	var one_search_id = $("#" + search_output + " li").attr("id");
	    	$("#" + one_search_id).trigger("click");
	    }
	    
	});
    }
    //----------------------------search--------------------------------------//
})(jQuery);



