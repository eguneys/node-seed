var ContainerView = Backbone.View.extend({
    el: "#container",
    
    initialize: function (options) {
	this.eventBus = options.eventBus;

	this.model.on("change:viewState", this.render, this);
    },

    render: function() {
	var view = this.model.get('viewState');
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
	this.vent.trigger("login", this.$('#nameText').val());
    }
});

var HomeView = Backbone.View.extend({
    template: _.template($('#home-template').html()),

    events: {
	'click .room': 'onRoomClick',
	'click #PlayNow': 'onPlayClick',
	'click .chatRoom': 'onChatRoomClick'
    },
    
    initialize: function(options) {
	this.vent = options.vent;

	this.model.submodels.liveRooms.on("add", this.renderRoomListView, this);
	this.model.submodels.joinedRooms.on("add", this.renderRoomTabView, this);

	this.model.submodels.chatRooms.on("add", this.renderChatRoom, this);

	this.model.submodels.gameRooms.on("add", this.renderGameRoom, this);
    },

    renderGameRoom: function(gameRoom) {
	    var room = gameRoom.get('room');

	    var template = _.template("<li><a href='#tab<%=id%>' data-toggle='tab'><%=name%></a></li>");
	    this.$('#roomTabs').append(template({id: room.getRoomId(), name: room.getName()}));

	var gameView = new RoomGameView({model: gameRoom, vent: this.vent});

	    var gameViewEl = gameView.render().el;
	    
	    this.$("#roomTabContents").append(gameViewEl);

	gameView.buildScene();
    },

    renderRoomListView: function(room) {
	    var room = room.get('room');
	    var template = _.template($('#room-listview-template').html());
	    this.$("#gameList").append(template({id: room.getRoom().getRoomId(), name: room.getRoom().getName(), data: room.getCustomData(), users: room.getUsers()}));

	this.$('.nano').nanoScroller();
    },

    renderRoomTabView: function(roomM) {
	    var room = roomM.get('room');

	    var template = _.template("<li><a href='#tab<%=id%>' data-toggle='tab'><%=name%></a></li>");
	    this.$('#roomTabs').append(template({id: room.getRoomId(), name: room.getName()}));

	    var chatViewEl = new RoomChatView({model: roomM, vent: this.vent}).render().el;
	    
	    this.$("#roomTabContents").append(chatViewEl);
    },

    renderChatRoom: function(roomM) {
	var room = roomM.get('room');
	var template = _.template("<a class='list-group-item'><%= name %></a>");

	this.$("#roomList").append(template({name: room.getRoom().getName() }));
    },

    render: function() {
	this.$el.html(this.template());
	
	this.model.submodels.liveRooms.each(function(roomM) {
	    this.renderRoomListView(roomM);
	});

	this.model.submodels.joinedRooms.each(function(roomM) {
	    this.renderRoomTabView(roomM);
	});

	this.model.submodels.chatRooms.each(function(roomM) {
	    this.renderChatRoom(roomM);
	});
	
	return this;
    },

    onPlayClick: function() {
	this.vent.trigger("playNow");
    },

    onRoomClick: function(ev) {
	this.vent.trigger("joinRoom", $(ev.target).attr('id'));
    }
});

var RoomUsersView = Backbone.View.extend({
    template: _.template($('#room-users-template').html()),

    initialize: function(options) {
	this.vent = options.vent;

	
    },

    
});



var RoomChatView = Backbone.View.extend({
    template: _.template($('#room-chat-template').html()),

    initialize: function(options) {
	this.vent = options.vent;

	this.model.on("change:chatMessagesChangeNotify", this.renderChat, this);
    },
    
    events: {
	"keypress #chatInputBox": "onChat"
    },

    renderChat: function() {
	this.model.updateChat();

	var template = _.template("<li><span class='text-info'><%= sender %></span>: <%= chat %></li>");

	var newMessage = this.model.get('chatMessagesChangeNotify');
	
	var newChat = this.$("#chatList").append(template({chat: newMessage.getChat(), sender: newMessage.getSender()}));


	$('.nanoBottom').nanoScroller({ scroll: 'bottom'});
	
	
    },
    
    render: function() {
	var room = this.model.get('room');

	this.setElement(this.template(this.model.toJSON()));

	return this;
    },

    onChat: function(ev) {
	var room = this.model.get('room');
	
	if (ev.charCode == 13) {
	    this.vent.trigger("chat",{ value: this.$("#chatInputBox").val(), id: room.getRoomId()});
	    this.$("#chatInputBox").val("");

	    return false;
	}
    }
});
