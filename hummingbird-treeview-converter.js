$(document).ready(function() {


    //hide simple treeview structure
    $(".hummingbird-treeview-converter").hide();

    //create new treeview container
    var template_header = '<div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;">';
    var template_subheader = '<ul id="treeview" class="hummingbird-base">';
    $(".hummingbird-treeview-converter").after(template_header + template_subheader);


    //get treeview elements
    var tree = $(".hummingbird-treeview-converter").children("li");

    //loop through the elements and create tree
    var id = 0;
    var item = "";
    $.each(tree, function(i,e) {
	var treeText = $(this).text();
	//cut out leading -
	var numHyphen = treeText.lastIndexOf("-");
	//console.log(numHyphen + " " + treeText)
	var numHyphen_next = $(this).next().text().lastIndexOf("-");
	//what is this, parent, children or sibling
	//this is a parent
	if (numHyphen < numHyphen_next) {
	    item = item + '<li>' +"\n";
	    item = item + '<i class="fa fa-plus"></i>' + "\n";
	    item = item + '<label>' + "\n";
	    item = item + '<input id="hum-' + id + '" data-id="' + treeText + '" type="checkbox" />' + treeText + "\n";
	    item = item + '</label>' + "\n";
	    item = item + '</li>' + "\n";
	    //console.log(item);
	    id++;
	}
	
    });
    item = item + '</ul></div>';
    console.log(item)
    $(".hummingbird-base").after(item);


    






});
