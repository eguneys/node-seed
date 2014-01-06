var ContainerView = Backbone.View.extend({
    el: "#container",
    
    initialize: function (options) {

	this.eventBus = options.eventBus;

	this.vent = _.extend({}, Backbone.Events);
	_.bindAll(this, "changeState");
	this.vent.bind("changeState", this.changeState);
	
	this.state = LoginView;
	this.render();
    },

    changeState: function(view) {
	this.state = view;
	this.render();
    },

    render: function() {
	var view = new this.state({ vent: this.vent});
	this.$el.html(view.render().el);
    }
});


var LoginView = Backbone.View.extend({
    template: _.template($('#login-template').html()),


    initialize: function(options) {
	this.vent = options.vent;
    },
    
    events: {
	'click #nameBtn': 'onLogin'
    },
    
    render: function() {
	this.$el.html(this.template());
	return this;
    },

    onLogin: function() {
	this.vent.trigger("changeState", HomeView);
    }
});

var HomeView = Backbone.View.extend({
    template: _.template($('#home-template').html()),

    initialize: function(parent) {
	this.parent = parent;
    },

    render: function() {
	this.$el.html(this.template());
	return this;
    }
});
