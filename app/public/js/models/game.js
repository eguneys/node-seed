var GameRoomCollection = Backbone.Collection.extend({
    model: GameRoomModel
});

var GameRoomModel = Backbone.Model.extend({
    defaults: {
	Player0: { name: "0", score: "" },
	Player1: { name: "1", score: "" },
	Player2: { name: "2", score: "" },
	Player3: { name: "3", score: "" },
	MySide: 0,
	PlayerCount: 0,
	Rake: [],
	drawMiddleStone: -1,
	drawSideStone: -1,
	throwStone: -1,
	Turn: 0,
    },

    addPlayer: function(user) {
	var playerCount = this.get("PlayerCount");
	
	this.set("Player" + playerCount, { name: user });
	
	this.set("PlayerCount" , ++playerCount);
    },

    initRake: function(rake) {
	this.set("Rake", rake[this.myPlayer().name]);
    },

    drawMiddleStone: function(card) {
	this.set("drawMiddleStone", card);
    },

    drawSideStone: function() {
	var drawBottomStone = this.get("drawBottomStone");
	this.set("drawBottomStone", ++drawBottomStone);
    },

    getTurnSide: function() {
	return this.getSide(this.get("Turn"));
    },

    getSide: function(side) {
	for (var i in [0, 1, 2, 3]) {
	    if (this.get("Player" + i).name == side) {
		return i;
	    }
	}
    },
    
    myPlayer: function() {
	return this.get("Player" + this.get("MySide"));
    },

    initialize: function(args) {
	
    }
    
});
