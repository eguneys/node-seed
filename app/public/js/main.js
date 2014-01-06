$(document).ready(function() {

    var main = new MainController();

    main.init();
});

var MainController = function() {
    var self = this;

    self.viewEventBus = _.extend({}, Backbone.Events);

    self.appEventBus = _.extend({}, Backbone.Events);
    
    self.init = function() {
	self.mainApp = new MainApp({eventBus: self.appEventBus});
	
	self.containerModel = new ContainerModel({viewState: new LoginView({vent: self.viewEventBus})});
	self.containerView = new ContainerView({eventBus: self.viewEventBus, model: self.containerModel});
	self.containerView.render();
    };

    self.viewEventBus.on("login", function(name) {
	self.mainApp.connect(name);
    });

    self.viewEventBus.on("joinRoom", function(id) {
	self.mainApp.joinRoom(id);
    });

    self.viewEventBus.on("chat", function(args) {
	self.mainApp.sendChat(args.value);
    });

    self.viewEventBus.on("playNow", function(args) {
	self.mainApp.createTurnRoom("quickRoom", "name");
    });



    self.appEventBus.on("connectDone", function() {
	self.homeModel = new HomeModel();
	var homeView = new HomeView({vent: self.viewEventBus, model: self.homeModel});
	self.containerModel.set("viewState", homeView);
    });

    self.appEventBus.on("liveRoomInfo", function(room) {
	self.homeModel.submodels.liveRooms.add(new Room({room: room}));
    });

    self.appEventBus.on("subscribeRoomDone", function(room) {
	self.homeModel.submodels.joinedRooms.add(new Room({ room: room, id: room.getRoomId()}));
    });

    self.appEventBus.on("chatReceived", function(chat) {
	var room = self.homeModel.submodels.joinedRooms.at(0);

	room.set('chatMessagesChangeNotify', chat);

    });

    self.appEventBus.on('gameStarted', function(args) {
	console.log(args);
    });

    self.appEventBus.on('moveCompleted', function(move) {
	console.log(move);
    });
}
