(function($){

    //global variables

    //this is needed to temporarily disable doubles, e.g. for uncheckAll
    var uncheckAll_doubles = false;

    //this is now default and not changable anymore
    var checkDisabled = true;

    var skip_next_check_uncheck = false;


    //
    var checkboxesGroups_grayed = false;
    var checkboxesGroups = false;

    var clickedNode = {};

    var textcolor = "";
    
    //var groups_labels = {};
    
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
	    //console.log(converter)
	    
	    //hide simple treeview structure
	    converter.hide();

	    var converter_height = converter.attr("data-height");
	    var converter_scroll = converter.attr("data-scroll");
	    var converter_id = converter.attr("data-id");
	    var boldParents = converter.attr("data-boldParents");

	    
	    if (converter_scroll == "true") {
		converter_scroll = 'overflow-y:scroll;';
	    } else {
		converter_scroll = "";
	    }
	    if (typeof(converter_height) == "undefined"){
		converter_height = "";
	    } else {
		converter_height = 'height: ' + converter_height  +';';
	    }
	    if (typeof(converter_id) == "undefined"){
		converter_id = "";
	    }
	    if (typeof(boldParents) == "undefined"){
		boldParents = false;
	    } else {
		boldParents = true;
	    }

	    
	    //create new treeview container
	    var tree_html = '<div id="treeview_container' + converter_str + '" class="hummingbird-treeview" style="' + converter_height  + ' ' + converter_scroll + '">' +
		'<ul id="treeview' + converter_str + converter_id + '" class="hummingbird-base">';


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
		//extract optional id and data-id and data-str		
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
		if ($(this).attr("data-str")) {
		    data_str = $(this).attr("data-str");
		} else {
		    data_str = "";
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
		    item = item + '<li data-id="' + numHyphen + '">' +"\n";
		    item = item + '<i class="fa fa-plus"></i>' + "\n";
		    item = item + '<label ' + data_str  + '>' + "\n";
		    if (boldParents){
			item = item + '<input id="' + id_str  + '" data-id="' + data_id + '" type="checkbox" /> <b>' + treeText + '</b>';
		    } else {
			item = item + '<input id="' + id_str  + '" data-id="' + data_id + '" type="checkbox" /> ' + treeText;
		    }
		    item = item + '</label>' + "\n";
		    item = item + '<ul>' + "\n";
		    //console.log(item);
		}
		//hummingbird-end-node
		if (numHyphen == numHyphen_next) {
		    item = item + '<li>' +"\n";
		    item = item + '<label ' + data_str  + '>' + "\n";
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
		    item = item + '<label ' + data_str  + '>' + "\n";
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

	    //delete converter
	    //console.log("remove")
	    //console.log(converter)
	    converter.remove();
	    //end converter
	});
    });

    
    $.fn.hummingbird = function(options){


	var methodName = options;
	var args = arguments;
	var options = $.extend( {}, $.fn.hummingbird.defaults, options);
	//initialisation
	if (typeof(methodName) == "undefined" ) {
	    return this.each(function(){
		//-------------------options-------------------------------------------------------//

		//change symbol prefix
		//font-awesome 4.7 uses fa
		//font-awesome 5. uses fas
		if (options.SymbolPrefix != "fa") {
		    $(this).find("i").removeClass("fa").addClass(options.SymbolPrefix);
		}
		

		//change symbols
		if (options.collapsedSymbol != "fa-plus") {
		    $(this).find("i").removeClass("fa-plus").addClass(options.collapsedSymbol);
		}

		//set text color
		textcolor = options.hoverColorText2;
		$(this).find("label").css({'background-color':options.hoverColorBg2, 'color':options.hoverColorText2});
		//console.log(options.hoverColorText2)
		
		//hoverItem
		if (options.hoverItems == true) {


		    //console.log("hoverItem on")
		    //get li
		    //var lis = $(this).find("input.hummingbird-end-node").parent("label").parent("li");
		    var this_labels = $(this).find("label");

		    //bootstrap
		    if (options.hoverMode == "bootstrap"){
			this_labels.hover(function() {
                          //only change if not disabled
                          //console.log($(this).children('input').prop('disabled'))                          
                          if ($(this).children('input').prop('disabled') == false){
		    	      $( this ).addClass(options.hoverColorBootstrap);
                          }
			}, function() {
                          if ($(this).children('input').prop('disabled') == false){
			      $( this ).removeClass(options.hoverColorBootstrap);
                          }
			});
		    }
		    //html
		    if (options.hoverMode == "html"){
			this_labels.hover(function() {                             
                          if ($(this).children('input').prop('disabled') == false){            
		    	    $( this ).css({'background-color':options.hoverColorBg1, 'color':options.hoverColorText1});
                          }
			}, function() {
                           if ($(this).children('input').prop('disabled') == false){
                             $( this ).css({'background-color':options.hoverColorBg2, 'color':options.hoverColorText2});
                           }
			});
		    }
                    
		    //
		}

		//set cursor pointer to all end-nodes
		//$(this).find('input:checkbox.hummingbird-end-node').parent("label").css({"cursor":"pointer"});
		//set cursor pointer
		$(this).find('input:checkbox').parent("label").css({"cursor":"pointer"});

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
		    checkboxesGroups = true;
		    checkboxesGroups_grayed = true;
		    //find all checkboxes which have children and disable them
		    //tri-state logic will still be applied
		    //this_checkbox.prop("disabled",true).parent("label").css({'color':'#c8c8c8'});
		    var groups = $(this).find('input:checkbox:not(".hummingbird-end-node")');
		    groups.prop("disabled",true).parent("label").css({"cursor":"not-allowed",'color':'#c8c8c8'});
		}

		if (options.checkboxesEndNodes == "disabled") {
		    //disable all end-nodes
		    var end_nodes = $(this).find('input:checkbox.hummingbird-end-node');
		    end_nodes.prop("disabled",true).parent("label").css({"cursor":"not-allowed"});
		    //this_checkbox.prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8',"cursor":"not-allowed"});
		}
		if (options.clickGroupsToggle == "enabled") {
		    var groups = $(this).find('input:checkbox:not(".hummingbird-end-node")');
		    groups.prop("disabled",true).parent("label").css({"cursor":"pointer"});
		    //trigger the i before
		    $(this).on("click", 'label', function() {
			if ($(this).children('input').hasClass('hummingbird-end-node')){
			    //console.log("this is an end-node")
			} else {
			    //console.log("this is a parent")
			    $(this).prev('i').trigger("click");
			}
		    });
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
		
		//expandSingle and check if options.singleGroupOpen is set
		var tmp_tree=$(this);
		$(this).on("click", 'li i.' + options.collapsedSymbol, function() {
		    //console.log("options.singleGroupOpen="+options.singleGroupOpen)
		    if (options.singleGroupOpen >= 0){
			//console.log("expand")
			//options.singleGroupOpen
			//get level  	
			var this_level = $(this).parent("li").attr("data-id");
			var level = options.singleGroupOpen;
			//console.log(level)
			//only if a click was on this level
			if (this_level == level){
			    //collapse all nodes on that level tree.find('input[' + attr + '=' + name + ']');
			    var all_nodes_on_level = tmp_tree.find('li[data-id=' + level + ']').children('label').children('input');
			    //console.log(all_nodes_on_level)
			    $.each(all_nodes_on_level, function(i,e){
				//console.log($(this).attr('id'))
				tmp_tree.hummingbird("collapseNode",{attr:"id",name: $(this).attr('id'),collapseChildren:true});
			    });
			}
		    }
		    $.fn.hummingbird.expandSingle($(this),options.collapsedSymbol,options.expandedSymbol);
		});
		//collapseSingle
		$(this).on("click", 'li i.' + options.expandedSymbol, function() {
		    //console.log("collapse")
		    $.fn.hummingbird.collapseSingle($(this),options.collapsedSymbol,options.expandedSymbol);
		});
		//prevent doubleclick on label
		// $(this).on("dblclick", 'label', function(e) {
		//     console.log("dblclick")
		//     e.preventDefault();
		// });

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

	//hideNode
	if (methodName == "hideNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		$.fn.hummingbird.hideNode($(this),attr,name);
	    });
	}

	//showNode
	if (methodName == "showNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		$.fn.hummingbird.showNode($(this),attr,name);
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

	//disableToggle
	if (methodName == "disableToggle") {
	    return this.each(function(){		
		var name = args[1].name;
		var attr = args[1].attr;
		$.fn.hummingbird.disableToggle($(this),attr,name);
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
		var list = args[1].list;
		if (typeof args[1].onlyEndNodes !== 'undefined') {
		    var onlyEndNodes = args[1].onlyEndNodes;
		} else {
		    var onlyEndNodes = false;
		}		
		if (typeof args[1].onlyParents !== 'undefined') {
		    var onlyParents = args[1].onlyParents;
		} else {
		    var onlyParents = false;
		}		
		if (typeof args[1].fromThis !== 'undefined') {
		    var fromThis = args[1].fromThis;
		} else {
		    var fromThis = false;
		}		
		$.fn.hummingbird.getChecked($(this),list,onlyEndNodes,onlyParents,fromThis);
	    });
	}

	//getUnchecked
	if (methodName == "getUnchecked") {
	    return this.each(function(){
		var list = args[1].list;
		if (typeof args[1].onlyEndNodes !== 'undefined') {
		    var onlyEndNodes = args[1].onlyEndNodes;
		} else {
		    var onlyEndNodes = false;
		}		
		if (typeof args[1].onlyParents !== 'undefined') {
		    var onlyParents = args[1].onlyParents;
		} else {
		    var onlyParents = false;
		}
		if (typeof args[1].fromThis !== 'undefined') {
		    var fromThis = args[1].fromThis;
		} else {
		    var fromThis = false;
		}		
		$.fn.hummingbird.getUnchecked($(this),list,onlyEndNodes,onlyParents,fromThis);
	    });
	}

	//getIndeterminate
	if (methodName == "getIndeterminate") {
	    return this.each(function(){
		var list = args[1].list;
		$.fn.hummingbird.getIndeterminate($(this),list);
	    });
	}

	//saveState
	if (methodName == "saveState") {
	    return this.each(function(){
		var save_state = args[1].save_state;
		$.fn.hummingbird.saveState($(this),save_state);
	    });
	}

	//restoreState
	if (methodName == "restoreState") {
	    return this.each(function(){
		var restore_state = args[1].restore_state;
		$.fn.hummingbird.restoreState($(this),restore_state);
	    });
	}

	//skipCheckUncheckDone
	if (methodName == "skipCheckUncheckDone") {
	    return this.each(function(){
		$.fn.hummingbird.skipCheckUncheckDone();
	    });
	}
	

	//addNode
	if (methodName == "addNode") {
	    return this.each(function(){
		var pos = args[1].pos;   //before or after
		var anchor_attr = args[1].anchor_attr; //the anchor node
		var anchor_name = args[1].anchor_name; //the anchor node
		var text = args[1].text;
		var the_id = args[1].the_id; 
		var data_id = args[1].data_id;
		if (typeof args[1].end_node !== 'undefined') {
		    var end_node = args[1].end_node;
		} else {
		    var end_node = true;
		}
		if (typeof args[1].children !== 'undefined') {
		    var children = args[1].children;
		} else {
		    var children = false;
		}
		$.fn.hummingbird.addNode($(this),pos,anchor_attr,anchor_name,text,the_id,data_id,end_node,children,options.collapsedSymbol);
	    });
	}


	//removeNode
	if (methodName == "removeNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		$.fn.hummingbird.removeNode($(this),attr,name);
	    });
	}


	
	//filter
	if (methodName == "filter") {
	    return this.each(function(){
		var str = args[1].str;
		if (typeof args[1].box_disable !== 'undefined') {
		    var box_disable = args[1].box_disable;
		} else {
		    var box_disable = false;
		}
		if (typeof args[1].filterChildren !== 'undefined') {
		    var filterChildren = args[1].filterChildren;
		} else {
		    var filterChildren = true;
		}
		if (typeof args[1].onlyEndNodes !== 'undefined') {
		    var onlyEndNodes = args[1].onlyEndNodes;
		} else {
		    var onlyEndNodes = false;
		}
		if (typeof args[1].caseSensitive !== 'undefined') {
		    var caseSensitive = args[1].caseSensitive;
		} else {
		    var caseSensitive = false;
		}
		$.fn.hummingbird.filter($(this),str,box_disable,caseSensitive,onlyEndNodes,filterChildren);
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
	SymbolPrefix: "fa",
	expandedSymbol: "fa-minus",
	collapsedSymbol: "fa-plus",
	collapseAll: true,
	checkboxes: "enabled",
	checkboxesGroups: "enabled",
	clickGroupsToggle: "disabled",
	checkboxesEndNodes: "enabled",
	checkDoubles: false,
	singleGroupOpen: -1,
	hoverItems: false,
	hoverMode: "html",
	hoverColorBg1: "#6c757c",
	hoverColorBg2: "white",
	hoverColorText1: "white",
	hoverColorText2: "black",
	hoverColorBootstrap: "bg-secondary text-white",
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
	var that_nodes = tree.find('label:not(.disableToggle)');
	that_nodes.siblings("ul").hide();
	that_nodes.siblings('.' + expandedSymbol).removeClass(expandedSymbol).addClass(collapsedSymbol);
    };

    //------------------expandAll------------------//
    $.fn.hummingbird.expandAll = function(tree,collapsedSymbol,expandedSymbol){
	var that_nodes = tree.find('label:not(.disableToggle)');
	that_nodes.siblings("ul").show();
	that_nodes.siblings('.' + collapsedSymbol).removeClass(collapsedSymbol).addClass(expandedSymbol);
    };

    //-------------------collapseSingle---------------//
    $.fn.hummingbird.collapseSingle = function(node,collapsedSymbol,expandedSymbol){
	if (!node.next('label').hasClass('disableToggle')){
	    node.parent("li").children("ul").hide();
	    node.removeClass(expandedSymbol).addClass(collapsedSymbol);
	}
    };

    //-------------------expandSingle---------------//
    $.fn.hummingbird.expandSingle = function(node,collapsedSymbol,expandedSymbol){
	if (!node.next('label').hasClass('disableToggle')){
	    node.parent("li").children("ul").show();
	    node.removeClass(collapsedSymbol).addClass(expandedSymbol);
	}
    };

    //-------------------expandNode---------------//
    $.fn.hummingbird.expandNode = function(tree,attr,name,expandParents,collapsedSymbol,expandedSymbol){
	var that_node = tree.find('input[' + attr + '=' + name + ']');
	var that_label = that_node.parent("label");
	if (!that_label.hasClass('disableToggle')){
	    var that_ul = that_label.siblings("ul");
	    that_ul.show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
	    //expand all parents and change symbol
	    if (expandParents === true) {
		that_node.parents("ul").show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
	    }
	}
    };

    //-------------------collapseNode---------------//
    $.fn.hummingbird.collapseNode = function(tree,attr,name,collapseChildren,collapsedSymbol,expandedSymbol){
	var that_node = tree.find('input[' + attr + '=' + name + ']');
	var that_label = that_node.parent("label");
	if (!that_label.hasClass('disableToggle')){
	    var that_ul = that_label.siblings("ul");
	    //collapse children and change symbol
	    if (collapseChildren === true) {
		that_node.parent("label").parent("li").find("ul").hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);
	    } else {	    
		that_ul.hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);
	    }
	}
    };

    //-------------------checkNode---------------//
    $.fn.hummingbird.checkNode = function(tree,attr,name){
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('input:checkbox:not(:checked)').prop("indeterminate",false).parent('label:contains(' + name + ')');
	    //console.log(that_nodes)
	    that_nodes.children('input:checkbox').trigger("click");
	} else {
	    tree.find('input:checkbox:not(:checked)[' + attr + '=' + name + ']').prop("indeterminate",false).trigger("click");
	}
    };

    //-------------------uncheckNode---------------//
    $.fn.hummingbird.uncheckNode = function(tree,attr,name){
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('input:checkbox:checked').prop("indeterminate",false).parent('label:contains(' + name + ')');
	    //console.log(that_nodes)
	    that_nodes.children('input:checkbox').trigger("click");
	} else {
	    tree.find('input:checkbox:checked[' + attr + '=' + name + ']').prop("indeterminate",false).trigger("click");
	}
    };

    //-------------------disableToggle---------------//
    $.fn.hummingbird.disableToggle = function(tree,attr,name){
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('label:contains(' + name + ')');
	    //console.log("name")
	    //console.log(that_nodes)
	} else {
	    var that_nodes = tree.find('input:checkbox:not(:checked)[' + attr + '=' + name + ']').parent('label');
	    //console.log("else")
	    //console.log(that_nodes)
	}
	that_nodes.addClass('disableToggle');
    };

    
    //-------------------removeNode---------------//
    $.fn.hummingbird.removeNode = function(tree,attr,name){
	if (attr == "text") {
	    name = name.trim();
	    tree.find('input:checkbox').parent('label:contains(' + name + ')').parent('li').remove();
	} else {
	    tree.find('input:checkbox[' + attr + '=' + name + ']').parent("label").parent('li').remove();
	}
    };

    //-------------------addNode---------------//
    $.fn.hummingbird.addNode = function(tree,pos,anchor_attr,anchor_name,text,the_id,data_id,end_node,children,collapsedSymbol){
	//find the node
	if (anchor_attr == "text") {
	    anchor_name = anchor_name.trim();
	    var that_node = tree.find('input:checkbox').parent('label:contains(' + anchor_name + ')').parent("li");
	} else {
	    var that_node = tree.find('input:checkbox[' + anchor_attr + '=' + anchor_name + ']').parent("label").parent("li");
	}
	//
	//console.log(that_node)
	//
	if (end_node) {
	    var Xclass = "hummingbird-end-node";
	    if (pos == "before") {
		that_node.before('<li><label><input class="'+ Xclass  +'" id="'+ the_id  +'" data-id="'+ data_id  +'" type="checkbox"> '+ text  +'</label></li>')
	    }
	    if (pos == "after") {
		that_node.after('<li><label><input class="'+ Xclass  +'" id="'+ the_id  +'" data-id="'+ data_id  +'" type="checkbox"> '+ text  +'</label></li>')
	    }
	} else {
	    var Xclass = "";
	    //create subtree
	    var subtree = "";
	    $.each(children, function(i,e){
		//console.log(e)
		subtree = subtree + '<li><label><input class="'+ 'hummingbird-end-node'  +'" id="'+ e.id  +'" data-id="'+ e.data_id  +'" type="checkbox"> '+ e.text  +'</label></li>'
	    });
	    if (pos == "before") {
		that_node.before('<li>'+"\n"+'<i class="fa '+ collapsedSymbol  +'"></i>'+ "\n" +'<label>'+"\n"+'<input class="'+ Xclass  +'" id="'+ the_id  +'" data-id="'+ data_id  +'" type="checkbox"> '+ text  +'</label>'+ "\n" +'<ul>'+ "\n" + subtree  +'</ul>'+"\n"+'</li>')
	    }
	    if (pos == "after") {
		that_node.after('<li>'+"\n"+'<i class="fa '+ collapsedSymbol  +'"></i>'+ "\n" +'<label>'+"\n"+'<input class="'+ Xclass  +'" id="'+ the_id  +'" data-id="'+ data_id  +'" type="checkbox"> '+ text  +'</label>'+ "\n" +'<ul>'+ "\n" + subtree  +'</ul>'+"\n"+'</li>')
	    }
	}
	//
    };



    
    //-------------------filter--------------------//
    $.fn.hummingbird.filter = function(tree,str,box_disable,caseSensitive,onlyEndNodes,filterChildren){
	if (onlyEndNodes) {
	    var entries = tree.find('input:checkbox.hummingbird-end-node');
	} else {
	    var entries = tree.find('input:checkbox');
	}
    var modifier = 'i';
    if(caseSensitive){
        modifier = 'g';
    }
    var re = new RegExp(str, modifier);
	$.each(entries, function(){
	    var entry = $(this).parent("label").text();
	    //if we have a match we add class to all parent li's
	    if (entry.match(re)) {
		$(this).parents("li").addClass("noFilter");
		if (filterChildren == false) {
		    $(this).parent("label").parent("li").find("li").addClass("noFilter");
		    //console.log($(this).parent("label").parent("li").find("li"))
		}
	    }
	});
	//now remove or disable all, which do not match
	if (box_disable) {
	    tree.find("li").not('.noFilter').prop("disabled",true);
	} else {
	    tree.find("li").not('.noFilter').remove();
	}
    };
    

    
    //-------------------disableNode---------------//
    $.fn.hummingbird.disableNode = function(tree,attr,name,state,disableChildren){
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('input:checkbox:not(:disabled)').parent('label:contains(' + name + ')');
	    //console.log(that_nodes)
	    var this_checkbox = that_nodes.children('input:checkbox');
	} else {
	    //find all nodes that are not disabled
	    var this_checkbox = tree.find('input:checkbox:not(:disabled)[' + attr + '=' + name + ']');
	}
	//set state
	//for a disabled unchecked node, set node checked and then trigger a click to uncheck
	//for a disabled checked node, set node unchecked and then trigger a click to check
	//this_checkbox.prop("checked",state === false);
	this_checkbox.prop("checked",state === false);
	nodeDisabled = true;
	this_checkbox.trigger("click");
	//three state logic will be triggered on disabling

	//disable this node and all children
	if (disableChildren === true) {
	    //console.log("disable children")
	    //this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8',"cursor":"not-allowed"});
	    //console.log(this_checkbox.parent("label").parent("li"))
	    //set this checkbox disabled
	    //in case hover is active, remove
	    this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",true).parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed","background-color":""});
	    //set this label disabled
	    //this_checkbox.parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed"});
	} else {
	    //console.log(this_checkbox.prop("disabled",true).parent("label").parent("li"))
	    //this_checkbox.prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8',"cursor":"not-allowed"});
	    this_checkbox.prop("disabled",true).parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed"});
	}
    };

    //-------------------enableNode---------------//
    $.fn.hummingbird.enableNode = function(tree,attr,name,state,enableChildren){
	//console.log("humming_enable")
	var this_checkbox = {};
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('input:checkbox:disabled').parent('label:contains(' + name + ')');
	    //console.log(that_nodes)
	    var this_checkbox = that_nodes.children('input:checkbox');
	} else {
	    this_checkbox = tree.find('input:checkbox:disabled[' + attr + '=' + name + ']');
	}
	//console.log(this_checkbox)
	//a checkbox cannot be enabled if all children are disabled AND enableChildren is false
	//get children checkboxes which are not disabled
	var children_not_disabled_sum= this_checkbox.parent("label").next("ul").children("li").children("label").children("input:checkbox:not(:disabled)").length;
	if (children_not_disabled_sum == 0 && enableChildren == false) {
	    //console.log("NOW!!!!!!!!!!!!!!!!!!!!!")
	    return;
	}
	//the state where a parent is enabled and all children are disabled must be forbidden

	//for a disabled unchecked node, set node checked and then trigger a click to uncheck
	//for a disabled checked node, set node unchecked and then trigger a click to check
	//this_checkbox.prop("disabled",false).parent("label").parent("li").css({'color':'#636b6f',"cursor":"default"});
	//this_checkbox.prop("disabled",false).parent("label").parent("li").css({'color':'black',"cursor":"default"});
	this_checkbox.prop("disabled",false).parent("label").css({'color':textcolor,"cursor":"pointer"});
	//all parents enabled
	//no action on parents if checkboxesGroups == disabled
	if (checkboxesGroups == false){
	    this_checkbox.parent("label").parent("li").parents("li").children("label").children("input[type='checkbox']").prop("disabled",false).parents("label").css({'color':textcolor,"cursor":"pointer"});
	}
	//all children enabled
	if (enableChildren === true) {
	    //this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).parent("label").parent("li").css({'color':'black',"cursor":"pointer"});
	    this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).parent("label").css({'color':textcolor,"cursor":"pointer"});
	}
	this_checkbox.prop("checked",state === false);
	nodeEnabled = true;
	this_checkbox.trigger("click");	
    };


    //-------------------hideNode---------------//
    $.fn.hummingbird.hideNode = function(tree,attr,name){
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('input:checkbox').parent('label:contains(' + name + ')');
	    var this_checkbox = that_nodes.children('input:checkbox');
	} else {
	    var this_checkbox = tree.find('input:checkbox[' + attr + '=' + name + ']');
	}
	//this_checkbox.hide();
	this_checkbox.attr("type","hidden");
	this_checkbox.parent("label").parent("li").hide();
    };

    //-------------------showNode---------------//
    $.fn.hummingbird.showNode = function(tree,attr,name){
	// console.log("showNode")
	// console.log(attr)
	// console.log(name)
	if (attr == "text") {
	    name = name.trim();
	    var that_nodes = tree.find('input').parent('label:contains(' + name + ')');
	    var this_checkbox = that_nodes.children('input');
	} else {
	    var this_checkbox = tree.find('input[' + attr + '=' + name + ']');
	}
	//this_checkbox.hide();
	//console.log(this)
	this_checkbox.attr("type","checkbox");
	this_checkbox.parent("label").parent("li").show();
    };



    
    //--------------get all checked items------------------//
    $.fn.hummingbird.getChecked = function(tree,list,onlyEndNodes,onlyParents,fromThis){

	if (fromThis == true){
	    //identify group that has been clicked or if an end-node was clicked
	    //console.log("clickedNode");
	    //console.log(clickedNode);
	    if (clickedNode.hasClass('hummingbird-end-node')){
		var activeGroup = clickedNode.parent('label').parent('li').parent('ul').parent('li');
		//console.log(activeGroup)
	    } else {
		var activeGroup = clickedNode.parent('label').parent('li');
		//console.log(activeGroup)
	    }
	} else {
	    var activeGroup = tree;
	}
	
	if (onlyEndNodes == true) {
	    activeGroup.find('input:checkbox.hummingbird-end-node:checked').each(function() {
		list.text.push($(this).parent("label").parent("li").text());
		list.id.push($(this).attr("id"));
		list.dataid.push($(this).attr("data-id"));
	    });
	} else {
	    if (onlyParents == true){
		activeGroup.find('input:checkbox:checked:not(.hummingbird-end-node)').each(function() {
		    list.text.push($(this).parent("label").parent("li").text());
		    list.id.push($(this).attr("id"));
		    list.dataid.push($(this).attr("data-id"));
		});
	    } else {
		activeGroup.find('input:checkbox:checked').each(function() {
		    list.text.push($(this).parent("label").parent("li").text());
		    list.id.push($(this).attr("id"));
		    list.dataid.push($(this).attr("data-id"));
		});
	    }
	}
    };
    //--------------get all checked items------------------//

    //--------------get all unchecked items------------------//
    $.fn.hummingbird.getUnchecked = function(tree,list,onlyEndNodes,onlyParents){
	if (onlyEndNodes == true) {
	    tree.find('input:checkbox.hummingbird-end-node:not(:checked)').each(function() {
		list.text.push($(this).parent("label").parent("li").text());
		list.id.push($(this).attr("id"));
		list.dataid.push($(this).attr("data-id"));
	    });
	} else {
	    if (onlyParents == true){
		tree.find('input:checkbox:not(:checked):not(.hummingbird-end-node)').each(function() {
		    list.text.push($(this).parent("label").parent("li").text());
		    list.id.push($(this).attr("id"));
		    list.dataid.push($(this).attr("data-id"));
		});
	    } else {
		tree.find('input:checkbox:not(:checked)').each(function() {
		    list.text.push($(this).parent("label").parent("li").text());
		    list.id.push($(this).attr("id"));
		    list.dataid.push($(this).attr("data-id"));
		});
	    }
	}
    };
    //--------------get all unchecked items------------------//

    //--------------get all indeterminate items------------------//
    $.fn.hummingbird.getIndeterminate = function(tree,list){
	tree.find('input:indeterminate').each(function() {
	    list.text.push($(this).parent("label").parent("li").text());
	    list.id.push($(this).attr("id"));
	    list.dataid.push($(this).attr("data-id"));
	});
    };
    //--------------get all indeterminate items------------------//


    //--------------skipCheckUncheckDone------------------//
    $.fn.hummingbird.skipCheckUncheckDone = function(){
	skip_next_check_uncheck = true;
    };
    //--------------skipCheckUncheckDone------------------//

    

    //--------------saveState------------------//
    $.fn.hummingbird.saveState = function(tree,save_state){
	//console.log("humming saveState")
	//save_state.checked = {"hallo":"123"};
	var List_full = {"id" : [], "dataid" : [], "text" : []};
	tree.hummingbird("getChecked",{list:List_full});
	//console.log(List_full)
	var List_indeterminate = {"id" : [], "dataid" : [], "text" : []};
	tree.hummingbird("getIndeterminate",{list:List_indeterminate});
	//console.log(List_indeterminate)
	save_state.checked = List_full.id;
	save_state.indeterminate = List_indeterminate.id;
    };
    //--------------saveState------------------//

    //--------------restoreState------------------//
    $.fn.hummingbird.restoreState = function(tree,restore_state){
	//console.log("humming restoreState")
	//uncheck all and remove indeterminate
	tree.find("input:checkbox").prop("checked",false).prop("indeterminate",false);
	//now check and set indeterminate
	if (jQuery.isEmptyObject(restore_state) == false) {
	    if (jQuery.isEmptyObject(restore_state.checked) == false) {
		$.each(restore_state.checked, function(i,e){
		    //console.log("checked: "+e)
		    tree.find("input:checkbox#"+e).prop("checked",true);
		});
	    }
	    if (jQuery.isEmptyObject(restore_state.indeterminate) == false) {
		$.each(restore_state.indeterminate, function(i,e){
		    //console.log("indeterminate: "+e)
		    tree.find("input:checkbox#"+e).prop("indeterminate",true);
		});
	    }
	}
    };
    //--------------restoreState------------------//
    

    
    //-------------------setNodeColor---------------//
    $.fn.hummingbird.setNodeColor = function(tree,attr,ID,color){
	tree.find('input:checkbox[' + attr + '=' + ID + ']').parent("li").css({'color':color});
    };
    
    //--------------three-state-logic----------------------//
    $.fn.hummingbird.ThreeStateLogic = function(tree,doubleMode,allVariables,checkDoubles,checkDisabled) {
	tree.find('input:checkbox').on('click', function(e) {
	    //console.log($(this))
	    clickedNode = $(this);
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


	    //if a node directly below that is disabled
	    //do nothing, i.e. reverse the check
	    //console.log($(this).parent("label").siblings("ul"))
	    // $(this).parent("label").siblings("ul").children("li").children("label").children("input").map(function(){
	    // 	console.log($(this))
	    // 	if ($(this).prop("disabled")){
	    // 	    var direct_child_state = $(this).prop("checked");
	    // 	    console.log($(this).prop("checked"))
	    // 	    $(this).prop("checked", direct_child_state === false);
	    // 	    console.log($(this).prop("checked"))
	    // 	}
	    // });
	    
	    //travel down the dom through all ul's, but not the ul directly under that, because that will be changed
	    //console.log($(this).parent("label").parent("li").find("ul"))
	    //$(this).parent("label").parent("li").find("ul").map(function(){
	    $(this).parent("label").siblings("ul").find("ul").map(function(){
	     	//console.log($(this))
		// return true;
		// console.log("xx")
		
		//check if children are disabled
		//console.log($(this).parent("label").next("ul").children("li").children("label").children("input:checkbox"))
		//var not_disabled_sum_children = $(this).parent("label").next("ul").children("li").children("label").children("input:checkbox:not(:disabled)").length;

		//I think I have to take into account only end-nodes???
		var disabled_sum_children = $(this).children("li").children("label").children("input:checkbox:disabled").length;
		//console.log("disabled_sum_children= " + disabled_sum_children)
		//if a check has happened count how many are checked
		//if an uncheck has happened count how many are unchecked
		//var checked_unchecked_sum_children = $(this).parent("label").next("ul").children("li").children("label").children(checkSiblings).length;
		//a check has happened


		var checked_sum_children = $(this).children("li").children("label").children("input:checkbox:checked").length;
		var unchecked_sum_children = $(this).children("li").children("label").children("input:checkbox:not(:checked)").length;
		var num_children_endnode = $(this).children("li").children("label").children("input:checkbox.hummingbird-end-node").length;

		

		// console.log("disabled_sum_children= " + disabled_sum_children)
		// console.log("checked_sum_children= " + checked_sum_children)
		// console.log("unchecked_sum_children= " + unchecked_sum_children)
		// console.log("num_children_endnode= " + num_children_endnode)


		//if all children disabled set appropriate state of this checkbox
		//This happens e.g. if all children of this box are disabled and checked, so this box is actually also checked and disabled, but because it is
		//not an end-node it can be checked, unchecked. Now a parent of this has been unchecked, thus this box is also unchecked, although all children are checked
		//thus the appropriate state has to be set again

		//there are children disabled:
		//if a check happened, all children are checked
		//if an uncheck happened all children are unchecked
		//console.log($(this).siblings("label").children("input:checkbox"))

		//there are disabled nodes below that
		if (disabled_sum_children > 0) {
		    if (checked_sum_children == 0) {
			$(this).siblings("label").children("input:checkbox").prop("checked",false);
		    }
		    //if there are no unchecked below, it means that this must be checked,
		    //but this is only true if this group has end-node children
		    //otherwise it can have unchecked group nodes
		    if (unchecked_sum_children == 0){
			if (num_children_endnode > 0){
			    //if (unchecked_sum_children == 0) {
			    $(this).siblings("label").children("input:checkbox").prop("checked",true);
			} else {
			    $(this).siblings("label").children("input:checkbox").prop("checked",false);
			}
		    }
		    if (checked_sum_children > 0 && unchecked_sum_children > 0) {
			//console.log("hallo")
			$(this).siblings("label").children("input:checkbox").prop("checked",false); //.prop("indeterminate",true);
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
			//console.log($(this))
			indeterminate_sum = indeterminate_sum + $(this).prop("indeterminate");
	    	    });
		    //this is 0 if there are no checked, thus an uncheck has happened
	    	    if ((indeterminate_sum + checked_unchecked_sum) == 0) {
	    		$(this).parent().parent().children("label").children("input:checkbox").prop("indeterminate",false);
	    		$(this).parent().parent().children("label").children("input:checkbox").prop("checked",state);
	    	    }
	
		    //if this click was together width a disableNode then, there is one more disabled child, thus not_disabled_sum--
		    if (checkDisabled) {
			//console.log("checkDisabled")
			//console.log($(this))
			//console.log("nodeDisabled="+nodeDisabled)
		    	if (nodeDisabled == true) {
		    	    not_disabled_sum--;
			    //do it only for this node
			    nodeDisabled = false;
		    	}
		    	//if all children are disabled, disable also parent
		    	if (not_disabled_sum == 0) {
			    //console.log("here")
		    	    //console.log($(this).parent().parent().children("label").children("input[type='checkbox']"))
			    //only disable parents if they are not already disabled by the checkboxesGroups options
			    if (checkboxesGroups_grayed == false && checkboxesGroups == false) {
				$(this).parent().parent().children("label").children("input[type='checkbox']").prop("disabled",true).parent("label").css({'color':'#c8c8c8','cursor':'not-allowed'});
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
		//console.log($(this))
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


	    //if skip_next_check_uncheck == true skip it and set back to false
	    //fire event
	    if (skip_next_check_uncheck == false){
		tree.trigger("CheckUncheckDone");
	    } else {
		skip_next_check_uncheck = false;
	    }
	});
    }
    //--------------three-state-logic----------------------//


    //----------------------------search--------------------------------------//
    $.fn.hummingbird.search = function(tree,treeview_container,search_input,search_output,search_button,dialog,enter_key_1,enter_key_2,collapsedSymbol,expandedSymbol,scrollOffset,onlyEndNodes,EnterKey) {

	//trigger search on enter key 
	if (EnterKey == true) {
	    $(document).keyup(function(e) {
		if (e.which == 13) {
		    //console.log("enter_key_1= " + enter_key_1)
		    //console.log("enter_key_2= " + enter_key_2)
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
	    //delete list
	    $(dialog + " #" + search_output).children('li').remove();
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
			this_var_checkbox.parent("label").parent("li").css({'color':'black',"cursor":"pointer"});
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



