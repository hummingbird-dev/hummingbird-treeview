(function($){
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
		
		//collapseAll
		if (options.collapseAll === false) {
		    $.fn.hummingbird.expandAll($(this),options.collapsedSymbol,options.expandedSymbol);
		}
		//-------------------options-------------------------------------------------------//
		

		//initialise doubles logic
		var doubleMode = false;
		var allVariables = new Object;
		if (options.checkDoubles) {
		    $(this).find('input:checkbox.hummingbirdNoParent').each(function() {
			if (allVariables[$(this).attr("data-id")]) {
			    allVariables[$(this).attr("data-id")].push($(this).attr("id"));
			    //console.log($(this))
			} else {
			    allVariables[$(this).attr("data-id")] = [$(this).attr("id")];
			}
		    });
		}

		//three state logic
		$.fn.hummingbird.ThreeStateLogic($(this),doubleMode,allVariables,options.checkDoubles,options.checkDisabled);
		
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
		$.fn.hummingbird.disableNode($(this),attr,name,state);
	    });
	}
	
	//enableNode
	if (methodName == "enableNode") {
	    return this.each(function(){
		var name = args[1].name;
		var attr = args[1].attr;
		var state = args[1].state;
		$.fn.hummingbird.enableNode($(this),attr,name,state);
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
		var OnlyFinalInstance = args[1].OnlyFinalInstance;
		$.fn.hummingbird.getChecked($(this),attr,list,OnlyFinalInstance);
	    });
	}

	//getUnchecked
	if (methodName == "getUnchecked") {
	    return this.each(function(){
		var attr = args[1].attr;
		var list = args[1].list;
		var OnlyFinalInstance = args[1].OnlyFinalInstance;
		$.fn.hummingbird.getUnchecked($(this),attr,list,OnlyFinalInstance);
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
		if (typeof args[1].OnlyFinalInstance !== 'undefined') {
		    var OnlyFinalInstance = args[1].OnlyFinalInstance;
		} else {
		    var OnlyFinalInstance = false;
		}
		if (typeof args[1].EnterKey !== 'undefined') {
		    var EnterKey = args[1].EnterKey;
		} else {
		    var EnterKey = true;
		}
		$.fn.hummingbird.search($(this),treeview_container,search_input,search_output,search_button,dialog,enter_key_1,enter_key_2,options.collapsedSymbol,options.expandedSymbol,scrollOffset,OnlyFinalInstance,EnterKey);
	    });
	}
    };


    //options defaults
    $.fn.hummingbird.defaults = {
	expandedSymbol: "fa-minus",
	collapsedSymbol: "fa-plus",
	collapseAll: true,
	checkboxes: "enabled",
	checkDoubles: false,
	checkDisabled: false,
    };

    //global vars
    var nodeDisabled = true;
    

    //-------------------methods--------------------------------------------------------------------------//
    
    //-------------------checkAll---------------//
    $.fn.hummingbird.checkAll = function(tree){
	tree.children("li").children("label").children("input:checkbox").prop('indeterminate', false).prop('checked', false).trigger("click");
    };

    //-------------------uncheckAll---------------//
    $.fn.hummingbird.uncheckAll = function(tree){
	//console.log(tree.children("li").children("label").children("input:checkbox"))
	tree.children("li").children("label").children("input:checkbox").prop('indeterminate', false).prop('checked', true).trigger("click");
    };

    //-------------------collapseAll---------------//
    $.fn.hummingbird.collapseAll = function(tree,collapsedSymbol,expandedSymbol){
	tree.find("ul.collapsable").hide();
	tree.find('.' + expandedSymbol).removeClass(expandedSymbol).addClass(collapsedSymbol);
    };

    //------------------expandAll------------------//
    $.fn.hummingbird.expandAll = function(tree,collapsedSymbol,expandedSymbol){
	tree.find("ul.collapsable").show();
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
	var that_ul = that_node.parent("label").siblings("ul.collapsable");
	that_ul.show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
	//expand all parents and change symbol
	if (expandParents === true) {
	    that_node.parents("ul.collapsable").show().siblings("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
	}
    };

    //-------------------collapseNode---------------//
    $.fn.hummingbird.collapseNode = function(tree,attr,name,collapseChildren,collapsedSymbol,expandedSymbol){
	var that_node = tree.find('input[' + attr + '=' + name + ']');
	var that_ul = that_node.parent("label").siblings("ul.collapsable");
	//collapse children and change symbol
	if (collapseChildren === true) {
	    that_node.parent("label").parent("li").find("ul.collapsable").hide().siblings("i").removeClass(expandedSymbol).addClass(collapsedSymbol);
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
    $.fn.hummingbird.disableNode = function(tree,attr,name,state){
	var this_checkbox = tree.find('input:checkbox:not(:disabled)[' + attr + '=' + name + ']');
	//for a disabled unchecked node, set node checked and then trigger a click to uncheck
	//for a disabled checked node, set node unchecked and then trigger a click to check
	this_checkbox.prop("checked",state === false);
	nodeDisabled = true;
	this_checkbox.trigger("click");
	//disable this node and all children
	this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8'});
    };

    //-------------------enableNode---------------//
    $.fn.hummingbird.enableNode = function(tree,attr,name,state){
	var this_checkbox = tree.find('input:checkbox:disabled[' + attr + '=' + name + ']');
	//for a disabled unchecked node, set node checked and then trigger a click to uncheck
	//for a disabled checked node, set node unchecked and then trigger a click to check
	this_checkbox.prop("disabled",false).parent("label").parent("li").css({'color':'#636b6f'});
	//all parents enabled
	this_checkbox.parent("label").parent("li").parents("li").children("label").children("input[type='checkbox']").prop("disabled",false).parents("label").parent("li").css({'color':'#636b6f'});
	//all children enabled
	this_checkbox.parent("label").parent("li").find('input:checkbox').prop("disabled",false).parent("label").parent("li").css({'color':'#636b6f'});	
	this_checkbox.prop("checked",state === false);
	nodeDisabled = false;
	this_checkbox.trigger("click");	
    };

    //--------------get all checked items------------------//
    $.fn.hummingbird.getChecked = function(tree,attr,list,OnlyFinalInstance){
	if (OnlyFinalInstance == true) {
	    tree.find('input:checkbox.hummingbirdNoParent:checked').each(function() {
		list.push($(this).attr(attr));
	    });
	} else {
	    tree.find('input:checkbox:checked').each(function() {
		list.push($(this).attr(attr));
	    });
	}
    };
    //--------------get all checked items------------------//

    //--------------get all unchecked items------------------//
    $.fn.hummingbird.getUnchecked = function(tree,attr,list,OnlyFinalInstance){
	if (OnlyFinalInstance == true) {
	    tree.find('input:checkbox.hummingbirdNoParent:not(:checked)').each(function() {
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
	    //check / uncheck all checkboxes below that node, if they are not disabled
	    var nodes_below = $(this).parent("label").parent("li").find("input:checkbox:not(:disabled)");
	    var ids = [];
	    nodes_below.each(function(){
		ids.push($(this).attr("id"));
	    });
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
	    $(this).parent("label").parent().parents("li").children("label").children("input[type='checkbox']").prop("indeterminate",true);
	    $(this).parent("label").parent().parents("li").children("label").children("input[type='checkbox']").prop("checked",false);
	    //travel up the DOM
	    //test if siblings are all checked / unchecked / indeterminate       
	    //check / uncheck parents if all siblings are checked /unchecked
	    //thus, set parents checked / unchecked, if children are all checked or all unchecked with no indeterminates
	    $(this).parent("label").parents("li").map(function() {
	    	var indeterminate_sum = 0;
	    	var checked_unchecked_sum = $(this).siblings().addBack().children("label").children(checkSiblings).length;
		if (checkDisabled) {
		    var not_disabled_sum = $(this).siblings().addBack().children("label").children("input:checkbox:not(:disabled)").length;
		}
	    	$(this).siblings().addBack().children("label").children("input:checkbox").map(function() {
	    	    indeterminate_sum = indeterminate_sum + $(this).prop("indeterminate");
	    	});
	    	if ((indeterminate_sum + checked_unchecked_sum) == 0) {
	    	    $(this).parent().parent().children("label").children("input[type='checkbox']").prop("indeterminate",false);
	    	    $(this).parent().parent().children("label").children("input[type='checkbox']").prop("checked",state);
	    	}

		//disabling the node is done after it has been triggered, thus if a node has been disabled
		//i.e. nodeDisabled == true then the not_disabled_sum is actually smaller by one
		if (checkDisabled) {
		    if (nodeDisabled == true) {
			not_disabled_sum--;
			//the next parent group is again normal thus not_disabled_sum must not be incremented by one
			nodeDisabled = false;
		    }
		    if (not_disabled_sum == 0) {
			$(this).parent().parent().children("label").children("input[type='checkbox']").prop("disabled",true).parent("label").parent("li").css({'color':'#c8c8c8'});
		    }
		}
	    });

	    
	    //------------------check if this variable has doubles-----------------------//
	    //------------------and click doubles if needed------------------------------//
	    //------------------only if this is not a double check-----------------------//
	    if (checkDoubles) {
		if (doubleMode == false) {
	    	    //do this for all checked / unchecked checkboxes below that node
	    	    $(this).parent("label").parent("li").find("input.hummingbirdNoParent[type='checkbox']").each(function() {
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
	    //check if this box has hummingbirdNoParent children
	    if (checkDisabled) {
		if ($(this).hasClass("hummingbirdNoParent") === false) {
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

	    //fire event
	    tree.trigger("CheckUncheckDone");	    
	});
    }
    //--------------three-state-logic----------------------//


    //----------------------------search--------------------------------------//
    $.fn.hummingbird.search = function(tree,treeview_container,search_input,search_output,search_button,dialog,enter_key_1,enter_key_2,collapsedSymbol,expandedSymbol,scrollOffset,OnlyFinalInstance,EnterKey) {

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
	    if (OnlyFinalInstance == true) {
		var OnlyFinalInstance_Class = ".hummingbirdNoParent";
	    } else {
		var OnlyFinalInstance_Class = "";
	    }
	    tree.find('input:checkbox' + OnlyFinalInstance_Class).each(function() {
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
			this_var_checkbox.parent("label").parent("li").css({'color':'#c8c8c8'});
		    } else {
			this_var_checkbox.parent("label").parent("li").css({'color':'#636b6f'});
		    }
	    	}
	    	//before jumping to the hummingbirdNoParent a collapse all is needed
	    	tree.hummingbird("collapseAll");
	    	//get this checkbox
	    	this_var_checkbox = tree.find('input[id="' + $(this).attr("id").substring(5) + '"]');
		//parent uls
	    	var prev_uls = this_var_checkbox.parents("ul.collapsable");
		//change plus to minus
	    	prev_uls.closest("li").children("i").removeClass(collapsedSymbol).addClass(expandedSymbol);
		//highlight hummingbirdNoParent
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



