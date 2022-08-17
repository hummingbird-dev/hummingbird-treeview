(function($){

    //global variables

    //this is needed to temporarily disable doubles, e.g. for uncheckAll
    var uncheckAll_doubles = false;

    //this is now default and not changable anymore
    var checkDisabled = true;

    var skip_next_check_uncheck = false;
    var skip_treeState = false;

    //
    var checkboxesGroups_grayed = false;
    var checkboxesGroups = false;

    var clickedNode = {};

    var textcolor = "";

    var boldParents_str1 = '';
    var	boldParents_str2 = '';

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
	    var converter_css = converter.attr("data-css");
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
		boldParents_str1 = '';
		boldParents_str2 = '';
	    } else {
		boldParents = true;
		boldParents_str1 = '<b>';
		boldParents_str2 = '</b>';
	    }
	    if (typeof(converter_css) == "undefined"){
		converter_css = "";
	    }

	    
	    //create new treeview container
	    var tree_html = '<div id="treeview_container' + converter_str + '" class="hummingbird-treeview" style="' + converter_height  + ' ' + converter_scroll + ' ' + converter_css + '">' +
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
		if ($(this).attr("data-nonHoverColor")) {
		    data_nonHoverColor = $(this).attr("data-nonHoverColor");
		} else {
		    data_nonHoverColor = "";
		}
		if ($(this).attr("data-HoverColor")) {
		    data_HoverColor = $(this).attr("data-HoverColor");
		} else {
		    data_HoverColor = "";
		}
		if ($(this).attr("data-nonHoverColor_bg")) {
		    data_nonHoverColor_bg = $(this).attr("data-nonHoverColor_bg");
		} else {
		    data_nonHoverColor_bg = "";
		}
		if ($(this).attr("data-HoverColor_bg")) {
		    data_HoverColor_bg = $(this).attr("data-HoverColor_bg");
		} else {
		    data_HoverColor_bg = "";
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
		    item = item + '<label ' + data_str  + 'data-nonhovercolor="' + data_nonHoverColor + '" ' +  'data-hovercolor="' + data_HoverColor + '" ' + 'data-nonhovercolor_bg="' + data_nonHoverColor_bg + '" ' +  'data-hovercolor_bg="' + data_HoverColor_bg + '">' + "\n";
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
		    item = item + '<label ' + data_str  + 'data-nonhovercolor="' + data_nonHoverColor + '" ' +  'data-hovercolor="' + data_HoverColor + '" ' + 'data-nonhovercolor_bg="' + data_nonHoverColor_bg + '" ' +  'data-hovercolor_bg="' + data_HoverColor_bg + '">' + "\n";
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
		    item = item + '<label ' + data_str  + 'data-nonhovercolor="' + data_nonHoverColor + '" ' +  'data-hovercolor="' + data_HoverColor + '" ' + 'data-nonhovercolor_bg="' + data_nonHoverColor_bg + '" ' +  'data-hovercolor_bg="' + data_HoverColor_bg + '">' + "\n";
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




    $(this).on('nodeExpanded nodeCollapsed', function(){
	var this_ul = $('.hummingbird-base').find('ul.disableParentNodeOnCollapse');
	//console.log(this_ul)
	$.each(this_ul,function(e){
	    //console.log($(this))
	    var parent_node_id = $(this).prev('label').children('input').attr('id');
	    //
	    if ($(this).is(':visible')){
	    	//console.log("visible")
	    	$('.hummingbird-base').hummingbird('enableNode',{sel:"id",vals:[parent_node_id]});
	    } else {
	    	//console.log(" not visible")
	    	$('.hummingbird-base').hummingbird('disableNode',{sel:"id",vals:[parent_node_id]});
	    }		
	});
    });


    
    $.fn.hummingbird = function(options){
	//console.log("init !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")

	var methodName = options;
	var args = arguments;
	var options = $.extend( {}, $.fn.hummingbird.defaults, options);
	var this_tree = $(this);
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
		//$(this).find("label").css({'background-color':options.hoverColorBg2, 'color':options.hoverColorText2});
		//console.log(options.hoverColorText2)
		//set individual text colors

		var all_labels_to_set_color = $(this).find("label");
		$.each(all_labels_to_set_color, function(){
		    if ($(this).attr("data-nonhovercolor") == "" || $(this).attr("data-nonhovercolor") == undefined){
			var forground_text_color = options.hoverColorText2;
		    } else {
			var forground_text_color = $(this).attr("data-nonhovercolor");
		    }
		    if ($(this).attr("data-nonhovercolor_bg") == "" || $(this).attr("data-nonhovercolor_bg") == undefined){
			var background_text_color = options.hoverColorBg2;
		    } else {
			var background_text_color = $(this).attr("data-nonhovercolor_bg");
		    }
		    $( this ).css({'background-color':background_text_color, 'color':forground_text_color});
		});
		


		
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
				if ($(this).attr("data-hovercolor") == "" || $(this).attr("data-hovercolor") == undefined){
				    var forground_text_color = options.hoverColorText1;
				} else {
				    var forground_text_color = $(this).attr("data-hovercolor");
				}
				if ($(this).attr("data-hovercolor_bg") == "" || $(this).attr("data-hovercolor_bg") == undefined){
				    var background_text_color = options.hoverColorBg1;
				} else {
				    var background_text_color = $(this).attr("data-hovercolor_bg");
				}
				$( this ).css({'background-color':background_text_color, 'color':forground_text_color});
			    }
			}, function() {
                            if ($(this).children('input').prop('disabled') == false){
				if ($(this).attr("data-nonhovercolor") == "" || $(this).attr("data-nonhovercolor") == undefined){
				    var forground_text_color = options.hoverColorText2;
				} else {
				    var forground_text_color = $(this).attr("data-nonhovercolor");
				}
				if ($(this).attr("data-nonhovercolor_bg") == "" || $(this).attr("data-nonhovercolor_bg") == undefined){
				    var background_text_color = options.hoverColorBg2;
				} else {
				    var background_text_color = $(this).attr("data-nonhovercolor_bg");
				}
				$( this ).css({'background-color':background_text_color, 'color':forground_text_color});
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
		//$.fn.hummingbird.checkboxClicked($(this),doubleMode,allVariables,options.checkDoubles,options.checkDisabled);		
		//$.fn.hummingbird.checkboxClicked($(this),doubleMode,allVariables,options.checkDoubles,checkDisabled);
		//check box clicked
		$(this).find('input:checkbox').on('click', function(e) {
		    //console.log($(this))
		    var restrict = $.fn.hummingbird.checkboxClicked($(this));
		    $.fn.hummingbird.triState(this_tree,restrict);
		})

		

		
		//expandSingle and check if options.singleGroupOpen is set
		var tmp_tree=$(this);
		//console.log(tmp_tree)
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
		    $.fn.hummingbird.expandSingle(tmp_tree,$(this),options.collapsedSymbol,options.expandedSymbol);
		});
		//collapseSingle
		$(this).on("click", 'li i.' + options.expandedSymbol, function() {
		    //console.log("collapse")
		    $.fn.hummingbird.collapseSingle(tmp_tree,$(this),options.collapsedSymbol,options.expandedSymbol);
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
		var sel = args[1].sel;
		var vals = args[1].vals;
		var state = args[1].state;
		if (typeof args[1].disableChildren !== 'undefined') {
		    var disableChildren = args[1].disableChildren;
		} else {
		    var disableChildren = true;
		}
		$.fn.hummingbird.disableNode($(this),sel,vals,state,disableChildren);
	    });
	}
	
	//enableNode
	if (methodName == "enableNode") {
	    return this.each(function(){
		var sel = args[1].sel;
		var vals = args[1].vals;
		var state = args[1].state;
		if (typeof args[1].enableChildren !== 'undefined') {
		    var enableChildren = args[1].enableChildren;
		} else {
		    var enableChildren = true;
		}
		$.fn.hummingbird.enableNode($(this),sel,vals,state,enableChildren);
	    });
	}

	//hideNode
	if (methodName == "hideNode") {
	    return this.each(function(){
		var sel = args[1].sel;
		var vals = args[1].vals;
		$.fn.hummingbird.hideNode($(this),sel,vals);
	    });
	}

	//showNode
	if (methodName == "showNode") {
	    return this.each(function(){
		var sel = args[1].sel;
		var vals = args[1].vals;
		$.fn.hummingbird.showNode($(this),sel,vals);
	    });
	}

	//disableParentNodeOnCollapse
	if (methodName == "disableParentNodeOnCollapse") {
	    return this.each(function(){
		var sel = args[1].sel;
		var vals = args[1].vals;
		if (typeof args[1].state !== 'undefined') {
		    var state = args[1].state;
		} else {
		    var state = true;
		}
		$.fn.hummingbird.disableParentNodeOnCollapse($(this),sel,vals,state);
	    });
	}
	
	
	//checkNode
	if (methodName == "checkNode") {
	    return this.each(function(){		
		var sel = args[1].sel;
		var vals = args[1].vals;
		$.fn.hummingbird.checkNode($(this),sel,vals);
	    });
	}

	//uncheckNode
	if (methodName == "uncheckNode") {
	    return this.each(function(){		
		var sel = args[1].sel;
		var vals = args[1].vals;
		$.fn.hummingbird.uncheckNode($(this),sel,vals);
	    });
	}

	//disableToggle
	if (methodName == "disableToggle") {
	    return this.each(function(){		
		var sel = args[1].sel;
		var vals = args[1].vals;
		$.fn.hummingbird.disableToggle($(this),sel,vals);
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
		var sel = args[1].sel;
		var vals = args[1].vals;
		if (typeof args[1].expandParents !== 'undefined') {
		    var expandParents = args[1].expandParents;
		} else {
		    var expandParents = true;
		}				
		$.fn.hummingbird.expandNode($(this),sel,vals,expandParents,options.collapsedSymbol,options.expandedSymbol);
	    });
	}

	//collapseNode
	if (methodName == "collapseNode") {
	    return this.each(function(){
		var sel = args[1].sel;
		var vals = args[1].vals;
		if (typeof args[1].collapseChildren !== 'undefined') {
		    var collapseChildren = args[1].collapseChildren;
		} else {
		    var collapseChildren = true;
		}				
		$.fn.hummingbird.collapseNode($(this),sel,vals,collapseChildren,options.collapsedSymbol,options.expandedSymbol);
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

	//triState
	if (methodName == "triState") {
	    return this.each(function(){
		if (typeof args[1] !== 'undefined') {
		    if (typeof args[1].restrict !== 'undefined') {
			var restrict = args[1].restrict;
		    } else {
			var restrict = false;
		    }
		} else {
		    var restrict = false;
		}
		$.fn.hummingbird.triState($(this),restrict);
	    });
	}
	

	//addNode
	if (methodName == "addNode") {
	    return this.each(function(){
		var pos = args[1].pos;   //before or after
		var anchor_sel = args[1].anchor_sel; //the anchor node
		var anchor_vals = args[1].anchor_vals; //the anchor node
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
		$.fn.hummingbird.addNode($(this),pos,anchor_sel,anchor_vals,text,the_id,data_id,end_node,children,options.collapsedSymbol);
	    });
	}


	//removeNode
	if (methodName == "removeNode") {
	    return this.each(function(){
		var sel = args[1].sel;
		var vals = args[1].vals;
		$.fn.hummingbird.removeNode($(this),sel,vals);
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
	//get enabled unchecked endnodes
	var unchecked_end_nodes = tree.find('input:checkbox.hummingbird-end-node:not(:disabled)');
	//check those
	unchecked_end_nodes.prop('checked', true);
	//apply triState
	$.fn.hummingbird.triState(tree,false);
    };

    //-------------------uncheckAll---------------//
    $.fn.hummingbird.uncheckAll = function(tree){
	//get enabled checked endnodes
	var checked_end_nodes = tree.find('input:checkbox:checked.hummingbird-end-node:not(:disabled)');
	//uncheck those
	checked_end_nodes.prop('checked', false);
	//apply triState
	$.fn.hummingbird.triState(tree,false);
    };

    //-------------------collapseAll---------------//
    $.fn.hummingbird.collapseAll = function(tree,collapsedSymbol,expandedSymbol){	
	var that_nodes = tree.find('label:not(.disableToggle)');
	that_nodes.siblings("ul").hide();
	that_nodes.siblings('.' + expandedSymbol).removeClass(expandedSymbol).addClass(collapsedSymbol);
	//console.log(" a node has been collapsed")
	//console.log("collapseAll")
	tree.trigger("nodeCollapsed");
    };

    //------------------expandAll------------------//
    $.fn.hummingbird.expandAll = function(tree,collapsedSymbol,expandedSymbol){
	var that_nodes = tree.find('label:not(.disableToggle)');
	that_nodes.siblings("ul").show();
	that_nodes.siblings('.' + collapsedSymbol).removeClass(collapsedSymbol).addClass(expandedSymbol);
	tree.trigger("nodeExpanded");
    };

    //-------------------collapseSingle---------------//
    $.fn.hummingbird.collapseSingle = function(tree,node,collapsedSymbol,expandedSymbol){
	if (!node.next('label').hasClass('disableToggle')){
	    node.parent("li").children("ul").hide();
	    node.removeClass(expandedSymbol).addClass(collapsedSymbol);	    
	    // console.log("collapseSingle")
	    // console.log(node)
	    tree.trigger("nodeCollapsed");
	}
    };

    //-------------------expandSingle---------------//
    $.fn.hummingbird.expandSingle = function(tree,node,collapsedSymbol,expandedSymbol){
	if (!node.next('label').hasClass('disableToggle')){
	    node.parent("li").children("ul").show();
	    node.removeClass(collapsedSymbol).addClass(expandedSymbol);
	    tree.trigger("nodeExpanded");
	}	
    };

    //-------------------expandNode---------------//
    $.fn.hummingbird.expandNode = function(tree,sel,vals,expandParents,collapsedSymbol,expandedSymbol){
	$.each(vals, function(i,e){
	    var that_node = tree.find('input[' + sel + '="' + e + '"]');
	    var that_label = that_node.parent("label");
	    if (!that_label.hasClass('disableToggle')){
		var that_ul = that_label.siblings("ul");
		that_ul.show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
		//expand all parents and change symbol
		if (expandParents === true) {
		    that_node.parents("ul").show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
		}
	    }
	});
	tree.trigger("nodeExpanded");
    };

    //-------------------collapseNode---------------//
    $.fn.hummingbird.collapseNode = function(tree,sel,vals,collapseChildren,collapsedSymbol,expandedSymbol){
	$.each(vals, function(i,e){
	    var that_node = tree.find('input[' + sel + '="' + e + '"]');
	    var that_label = that_node.parent("label");
	    if (!that_label.hasClass('disableToggle')){
		var that_ul = that_label.siblings("ul");
		//collapse children and change symbol
		if (collapseChildren === true) {
		    that_node.parent("label").parent("li").find("ul").hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);
		    //console.log("a node has been collapsed")
		} else {	    
		    that_ul.hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);		    
		    //console.log("a node has been collapsed")
		}
	    }
	});
	console.log("collapseNode")
	tree.trigger("nodeCollapsed");
    };

    //-------------------checkNode---------------//
    $.fn.hummingbird.checkNode = function(tree,sel,vals){	
	//check this node and all below
	if (sel == "text") {
	    $.each(vals, function(i,e){
		//tree.find('input:checkbox:not(:disabled)').parent('label:contains(' + e + ')').parent('li').find('input:checkbox:not(:disabled)').prop("indeterminate",false).prop("checked",true);
		var the_node = tree.find('label:contains(' + e + ')').children('input:checkbox:not(:disabled)').prop("indeterminate",false).prop("checked",true);
		//no return needed
		$.fn.hummingbird.checkboxClicked(the_node);
	    });
	} else {
	    $.each(vals, function(i,e){
		//console.log(e)
		//tree.find('input:checkbox:not(:disabled)[' + sel + '=' + e + ']').parent('label').parent('li').find('input:checkbox:not(:disabled)').prop("indeterminate",false).prop("checked",true);
		var the_node = tree.find('input:checkbox:not(:disabled)[' + sel + '="' + e + '"]').prop("indeterminate",false).prop("checked",true);
		//no return needed
		$.fn.hummingbird.checkboxClicked(the_node);		
	    });
	}
	//apply triState
	$.fn.hummingbird.triState(tree,false);
    };

    //-------------------uncheckNode---------------//
    $.fn.hummingbird.uncheckNode = function(tree,sel,vals){
	if (sel == "text") {
	    $.each(vals, function(i,e){
		var the_node = tree.find('label:contains(' + e + ')').children('input:checkbox:not(:disabled)').prop("indeterminate",false).prop("checked",false);
		$.fn.hummingbird.checkboxClicked(the_node);
	    });
	} else {
	    $.each(vals, function(i,e){
		var the_node = tree.find('input:checkbox:not(:disabled)[' + sel + '="' + e + '"]').prop("indeterminate",false).prop("checked",false);
		$.fn.hummingbird.checkboxClicked(the_node);		
	    });
	}
	$.fn.hummingbird.triState(tree,false);	
    };

    //-------------------disableToggle---------------//
    $.fn.hummingbird.disableToggle = function(tree,sel,vals){
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		var that_nodes = tree.find('label:contains(' + name + ')');
		//console.log("name")
		//console.log(that_nodes)
	    } else {
		var that_nodes = tree.find('input:checkbox:not(:checked)[' + sel + '="' + e + '"]').parent('label');
		//console.log("else")
		//console.log(that_nodes)
	    }
	    that_nodes.addClass('disableToggle');
	});
    };

    
    //-------------------removeNode---------------//
    $.fn.hummingbird.removeNode = function(tree,sel,vals){
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		tree.find('input:checkbox').parent('label:contains(' + name + ')').parent('li').remove();
	    } else {
		tree.find('input:checkbox[' + sel + '="' + e + '"]').parent("label").parent('li').remove();
	    }
	});
	$.fn.hummingbird.triState(tree,false);
    };

    //-------------------addNode---------------//
    $.fn.hummingbird.addNode = function(tree,pos,anchor_sel,anchor_vals,text,the_id,data_id,end_node,children,collapsedSymbol){
	$.each(anchor_vals, function(i,e){
	    //find the node
	    if (anchor_sel[i] == "text") {
		anchor_name = e.trim();
		var that_node = tree.find('input:checkbox').parent('label:contains(' + anchor_name + ')').parent("li");
	    } else {
		var that_node = tree.find('input:checkbox[' + anchor_sel[i] + '="' + e + '"]').parent("label").parent("li");
	    }
	    //
	    //console.log(that_node)
	    //
	    if (end_node) {
		var Xclass = "hummingbird-end-node";
		if (pos[i] == "before") {
		    that_node.before('<li><label><input class="'+ Xclass  +'" id="'+ the_id[i]  +'" data-id="'+ data_id[i]  +'" type="checkbox"> '+ text[i]  +'</label></li>')
		}
		if (pos[i] == "after") {
		    that_node.after('<li><label><input class="'+ Xclass  +'" id="'+ the_id[i]  +'" data-id="'+ data_id[i]  +'" type="checkbox"> '+ text[i]  +'</label></li>')
		}
	    } else {
		var Xclass = "";
		//create subtree
		var subtree = "";
		// console.log($(this))
		//console.log(f)
		//console.log(g)
		$.each(children[i], function(f,g){
		    subtree = subtree + '<li><label><input class="'+ 'hummingbird-end-node'  +'" id="'+ g.id  +'" data-id="'+ g.data_id  +'" type="checkbox"> '+ g.text  +'</label></li>';
		});
		if (pos[i] == "before") {
		    that_node.before('<li>'+"\n"+'<i class="fa '+ collapsedSymbol  +'"></i>'+ "\n" +'<label>'+"\n"+'<input class="'+ Xclass  +'" id="'+ the_id[i]  +'" data-id="'+ data_id[i]  +'" type="checkbox"> '+ boldParents_str1 + text[i] + boldParents_str2  +'</label>'+ "\n" +'<ul>'+ "\n" + subtree  +'</ul>'+"\n"+'</li>');
		}
		if (pos[i] == "after") {
		    that_node.after('<li>'+"\n"+'<i class="fa '+ collapsedSymbol  +'"></i>'+ "\n" +'<label>'+"\n"+'<input class="'+ Xclass  +'" id="'+ the_id[i]  +'" data-id="'+ data_id[i]  +'" type="checkbox"> '+ boldParents_str1 + text[i] + boldParents_str2  +'</label>'+ "\n" +'<ul>'+ "\n" + subtree  +'</ul>'+"\n"+'</li>');
		}
	    }
	});
	//
	$.fn.hummingbird.triState(tree,false);
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
    $.fn.hummingbird.disableNode = function(tree,sel,vals,state,disableChildren){
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		var that_nodes = tree.find('input:checkbox:not(:disabled)').parent('label:contains(' + name + ')');
		//console.log(that_nodes)
		var this_checkbox = that_nodes.children('input:checkbox');
	    } else {
		//find all nodes that are not disabled
		var this_checkbox = tree.find('input:checkbox:not(:disabled)[' + sel + '="' + e + '"]');
	    }
	    //this_checkbox.prop("checked",state);
	    if (disableChildren === true) {
		this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",true).prop("checked",state).parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed","background-color":""});
	    } else {
		this_checkbox.prop("checked",state).prop("disabled",true).parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed","background-color":""});
	    }
	});
	$.fn.hummingbird.triState(tree,false);
    };

    //-------------------enableNode---------------//
    $.fn.hummingbird.enableNode = function(tree,sel,vals,state,enableChildren){
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		var that_nodes = tree.find('input:checkbox:disabled').parent('label:contains(' + name + ')');
		//console.log(that_nodes)
		var this_checkbox = that_nodes.children('input:checkbox');
	    } else {
		this_checkbox = tree.find('input:checkbox:disabled[' + sel + '="' + e + '"]');
	    }
	    //no action on parents if checkboxesGroups == disabled
	    // if (checkboxesGroups == false){
	    // 	this_checkbox.parent("label").parent("li").parents("li").children("label").children("input[type='checkbox']").prop("disabled",false).parents("label").css({'color':textcolor,"cursor":"pointer"});
	    // }
	    //this_checkbox.prop("checked",state);
	    if (enableChildren === true) {
		//this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).parent("label").parent("li").css({'color':'black',"cursor":"pointer"});
		this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).prop("checked",state).parent("label").css({'color':textcolor,"cursor":"pointer"});
	    } else {
		this_checkbox.prop("checked",state).prop("disabled",false).parent("label").css({'color':textcolor,"cursor":"pointer"});
	    }
	});
	$.fn.hummingbird.triState(tree,false);
    };


    //-------------------hideNode---------------//
    $.fn.hummingbird.hideNode = function(tree,sel,vals){
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		var that_nodes = tree.find('input:checkbox').parent('label:contains(' + name + ')');
		var this_checkbox = that_nodes.children('input:checkbox');
	    } else {
		var this_checkbox = tree.find('input:checkbox[' + sel + '="' + e + '"]');
	    }
	    //this_checkbox.hide();
	    this_checkbox.attr("type","hidden");
	    this_checkbox.parent("label").parent("li").hide();
	});
	$.fn.hummingbird.triState(tree,false);	
    };

    //-------------------showNode---------------//
    $.fn.hummingbird.showNode = function(tree,sel,vals){
	// console.log("showNode")
	// console.log(attr)
	// console.log(name)
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		var that_nodes = tree.find('input').parent('label:contains(' + name + ')');
		var this_checkbox = that_nodes.children('input');
	    } else {
		var this_checkbox = tree.find('input[' + sel + '="' + e + '"]');
	    }
	    //this_checkbox.hide();
	    //console.log(this)
	    this_checkbox.attr("type","checkbox");
	    this_checkbox.parent("label").parent("li").show();
	});
	$.fn.hummingbird.triState(tree,false);	
    };

    //-------------------disableParentNodeOnCollapse---------------//
    $.fn.hummingbird.disableParentNodeOnCollapse = function(tree,sel,vals,state){
	// console.log("showNode")
	// console.log(attr)
	// console.log(name)
	$.each(vals, function(i,e){
	    if (sel == "text") {
		name = e.trim();
		var that_nodes = tree.find('input').parent('label:contains(' + name + ')');
		var this_checkbox = that_nodes.children('input');
	    } else {
		var this_checkbox = tree.find('input[' + sel + '="' + e + '"]');
	    }
	    //this_checkbox.hide();
	    //console.log(this)

	    //add class to ul
	    if (state){
		this_checkbox.parent('label').next('ul').addClass("disableParentNodeOnCollapse");
	    } else {
		this_checkbox.parent('label').next('ul').removeClass("disableParentNodeOnCollapse");
	    }
	    
	    // var this_checkbox_id = this_checkbox.attr('id');

	    // var this_i = this_checkbox.parent('label').prev('i');
	    
	    // function disableParentNodeOnCollapse_func(this_i){
	    // 	if (!this_i.next('label').next('ul').is(':visible')){
	    // 	    //console.log("visible")
	    // 	    tree.hummingbird('enableNode',{sel:"id",vals:[this_checkbox_id]});
	    // 	} else {
	    // 	    //console.log(" not visible")
	    // 	    tree.hummingbird('disableNode',{sel:"id",vals:[this_checkbox_id]});
	    // 	}
	    // }
	    
	    // this_i.on('click', function(){
	    // 	disableParentNodeOnCollapse_func(this_i);
	    // });
	    // tree.on('nodeCollapsed', function(){
	    // 	disableParentNodeOnCollapse_func(this_i);
	    // });


	});
	$.fn.hummingbird.triState(tree,false);	
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
	$.fn.hummingbird.triState(tree,false);
    };
    //--------------restoreState------------------//
    

    
    //-------------------setNodeColor---------------//
    $.fn.hummingbird.setNodeColor = function(tree,attr,ID,color){
	tree.find('input:checkbox[' + attr + '=' + ID + ']').parent("li").css({'color':color});
    };


    //--------------triState------------------//
    $.fn.hummingbird.triState = function(tree,restrict){
	//console.log("triState")
	//get the ul's from deep to shallow
	//full tree
	if (restrict == false){
	    var the_uls = tree.find('input.hummingbird-end-node').parents("ul");
	} else {
	    //from a certain position
	    var the_uls = tree.find(restrict).parents("ul");
	}
	//console.log(the_uls)
	//go through all uls and check
	$.each(the_uls, function(i,e){
	    //console.log($(this))
	    //the checkboxes
	    //count all
	    var num_the_checkboxes = $(this).children('li').children('label').children('input').length;
	    // console.log("num_the_checkboxes")
	    // console.log(num_the_checkboxes)

	    //count checked
	    var checked_num_the_checkboxes = $(this).children('li').children('label').children('input:checkbox:checked').length;
	    // console.log("checked_num_the_checkboxes")
	    // console.log(checked_num_the_checkboxes)
	    //count disabled
	    var disabled_num_the_checkboxes = $(this).children('li').children('label').children('input:checkbox:disabled').length;
	    //
	    //count indeterminate, 
	    var indeterminate_num_the_checkboxes = 0;
	    $(this).children('li').children('label').children('input:checkbox').map(function() {
		indeterminate_num_the_checkboxes = indeterminate_num_the_checkboxes + $(this).prop("indeterminate");
	    })
	    //
	    // console.log("indeterminate_num_the_checkboxes")
	    // console.log(indeterminate_num_the_checkboxes)
	    if (checked_num_the_checkboxes == num_the_checkboxes){
		//console.log("case 1")
		$(this).parent('li').children('label').children('input:checkbox').prop('checked',true).prop('indeterminate',false);
	    }
	    if (checked_num_the_checkboxes < num_the_checkboxes && checked_num_the_checkboxes>0){
		//console.log("case 2")
		var this_state = $(this).parent('li').children('label').children('input:checkbox').prop("checked");
		//debugger;
		$(this).parent('li').children('label').children('input:checkbox').prop('checked',this_state).prop('indeterminate',true);
	    }
	    if (checked_num_the_checkboxes == 0){
		//console.log("case 3")
		$(this).parent('li').children('label').children('input:checkbox').prop('checked',false).prop('indeterminate',false);
	    }
	    if (indeterminate_num_the_checkboxes > 0){
		//console.log("case 4")
		var this_state = $(this).parent('li').children('label').children('input:checkbox').prop("checked");
	    	$(this).parent('li').children('label').children('input:checkbox').prop('checked',this_state).prop('indeterminate',true);
	    }
	    if (disabled_num_the_checkboxes == num_the_checkboxes){
		//console.log("case 5")
		//disable parent
		//do not change color if select single node is active
		if (checkboxesGroups == false){
		    $(this).parent('li').children('label').children('input:checkbox').prop("disabled",true).css({"cursor":"not-allowed"}).parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed","background-color":""});
		}
	    } else {
		//enable parent
		//this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).prop("checked",state).parent("label").css({'color':textcolor,"cursor":"pointer"});
		if (checkboxesGroups == false){
		    $(this).parent('li').children('label').children('input:checkbox').prop("disabled",false).css({"cursor":"pointer"}).parent("label").css({'color':textcolor,"cursor":"pointer","background-color":""});
		}		
	    }


	    
	});


	//if skip_next_check_uncheck == true skip it and set back to false
	//fire event
	if (skip_next_check_uncheck == false){
	    tree.trigger("CheckUncheckDone");
	} else {
	    skip_next_check_uncheck = false;
	}
	
	
    };
    //--------------triState------------------//


    
    //--------------three-state-logic----------------------//
    $.fn.hummingbird.checkboxClicked = function(clickedNode) {
	//console.log("checkboxClicked")
	if (true){
	    //try with triState
	    //first check all boxes below
	    //all not disabled
	    //console.log($(this))
	    var this_state = clickedNode.prop("checked");
	    //var this_indeterminate = $(this).prop("indeterminate");
	    //console.log(this_state)
	    //console.log(this_indeterminate)
	    //if (this_indeterminate){
	    //this_state = false;
	    //change this state
	    //$(this).prop("checked",this_state==false);
	    //}
	    //if this is an end-node
	    var restrict = clickedNode.parent('label');
	    if (clickedNode.hasClass("hummingbird-end-node") == false){
		//console.log("parent")
		//console.log(this_state)
		clickedNode.parent("label").siblings("ul").find("input:checkbox:not(:disabled)").prop("checked",this_state).prop("indeterminate",false);

		//if this is a parent check also all the ul's below in triState
		var restrict = clickedNode.parent('label').siblings('ul').find('li');
	    }

	    //debugger;
	    //tri state
	    //$.fn.hummingbird.triState(tree,restrict);

	    return restrict;
	}
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
			this_var_checkbox.parent("label").css({'color':'#c8c8c8',"cursor":"not-allowed"});
		    } else {
			this_var_checkbox.parent("label").css({'color':'black',"cursor":"pointer"});
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
	    	this_var_checkbox.parent("label").css({'color':'#f0ad4e'});
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


    //$(this).on('nodeCollapsed,nodeExpanded', function(){
    	//check for disableParentNodeOnCollapse
//	console.log("nodeCollapsed")
	// if ($(this).hasClass('disableParentNodeOnCollapse')){
	// 	console.log($(this))
	// 	console.log("hasClass")
	// 	//check for visible

	// 	var this_checkbox_id = $(this).prev('label').children('input').attr('id');
	// 	console.log(this_checkbox_id)
	
	// 	if ($(this).is(':visible')){
	//     	    console.log("visible")
	// 	    skip_treeState = true;
	//     	    tree.hummingbird('enableNode',{sel:"id",vals:[this_checkbox_id]});		    
	//     	} else {
	//     	    console.log(" not visible")
	// 	    skip_treeState = true;
	//     	    tree.hummingbird('disableNode',{sel:"id",vals:[this_checkbox_id]});
	//     	}
	//     }
  //  });


    //----------------------------search--------------------------------------//
})(jQuery);



