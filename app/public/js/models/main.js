
var RoomCollection = Backbone.Collection.extend({
    model: Room
});

var Room = Backbone.Model.extend({

    defaults: {
	chatMessages: [],
	chatMessagesChangeNotify: true
    },
    
    initialize: function(options) {
	
    },

    updateChat: function() {
	this.get('chatMessages').push(this.get('chatMessagesChangeNotify'));
    }
});


var ContainerModel = Backbone.Model.extend({

    initialize: function() {
	
    },
    
});




var HomeModel = Backbone.Model.extend({

    submodels: {
	liveRooms: new RoomCollection(),
	joinedRooms: new RoomCollection(),
	gameRooms: new GameRoomCollection()
    },
    
    initialize: function() {
	
    },
});
