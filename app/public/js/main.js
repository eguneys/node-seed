$(document).ready(function() {

    var eventBus = _.extend({}, Backbone.Events);
    
    var app = new MainApp({eventBus: eventBus});
    var container = new ContainerView({eventBus: eventBus});
});
