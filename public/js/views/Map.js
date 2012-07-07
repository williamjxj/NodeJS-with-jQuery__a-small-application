var MapView = Backbone.View.extend({
	// structure:
	// model - MapModel
	// linkContainerSelector - selector to linkContainer
	// link - link jQuery element
	// input - input jQuery element
	locTemplate: _.template($('#loclinktmpl').html())
	, initialize: function (data)
	{
		var linkCont = $(data.linkContainerSelector);

		linkCont.prepend(this.locTemplate({}))
		this.link = linkCont.find('a:first');
		this.input = linkCont.find('input:first');
	}
})
