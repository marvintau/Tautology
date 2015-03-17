draw = new UI.Two(BendyStraw.canvasName);

model = new Tautology.Model(BendyStraw,draw.canvas);

three = new UI.Three(BendyStraw.demoName);

// var addCollpsableFolder = function()


var addSlider = function(name, params, containerID){
	$('<input type="range">').appendTo($('#'+containerID))
		.attr({
			id: name,
			min:params[name]['min']*2000,
			max:params[name]['max']*2000,
			value:params[name]['val']*2000
		}).on('input change', function(e){
			params[name]['val'] = $(this).val()/2000;
			model.geom.update();
		}).wrap('<li>').before(name);
}

var addSliders = function(params, id){
	Object.keys(params)
		.filter(function(p){return params[p]['val']})
		.forEach(function(p){addSlider(p, params, id)});
}


model.updateScene(three.scene);

addSliders(model.geom.param, 'parameters');

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});
