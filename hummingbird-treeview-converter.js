$(document).ready(function() {


    //hide simple treeview structure
    $(".hummingbird-converter").hide();

    //create new treeview container
    var template_header = '<div id="treeview_container" class="hummingbird-treeview" style="height: 230px; overflow-y: scroll;">'
    var template_footer = "<div>"
    $(".hummingbird-converter").after(template_header + template_footer);


    //get treeview elements
    var tree = $(".hummingbird-converter").children("li");

    //loop through the elements and create tree
    $.each(tree, function(i,e) {
	var treeText = $(this).text();
	//cut out leading -
	var numHyphen = treeText.lastIndexOf("-");
	console.log(numHyphen + " " + treeText)
	
	
    });
    






});
