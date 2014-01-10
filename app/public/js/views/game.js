var RoomGameView = Backbone.View.extend({
    template: _.template($('#room-game-template').html()),
    
    initialize: function(options) {
	this.vent = options.vent;
	
	this.model.on("change:Player0", this.renderPlayer, this);
	this.model.on("change:Player1", this.renderPlayer, this);
	this.model.on("change:Player2", this.renderPlayer, this);
	this.model.on("change:Player3", this.renderPlayer, this);
	this.model.on("change:MySide", this.renderPlayer, this);
	this.model.on("change:Rake", this.renderRake, this);
	this.model.on("change:drawMiddleStone", this.renderDrawMiddleStone, this);
	this.model.on("change:drawBottomStone", this.renderDrawBottomStone, this);
	this.model.on("change:drawSideStone", this.renderDrawSideStone, this);
	this.model.on("change:throwStone", this.renderThrowStone, this);
	this.model.on("change:Turn", this.renderTurnPlayer, this);
    },

    renderTurnPlayer: function(model) {
	var relativeSide = RelativeSide(this.model.get("MySide"), this.model.getTurnSide());
	this.gameView.turnPlayer(DIRECTION_TOTAG[relativeSide]);
    },

    renderThrowStone: function(model) {
	var data = this.model.get("throwStone");
	var turn = DIRECTION_TOTAG[RelativeSide(this.model.get("MySide"), this.model.getSide(data.sender))];
	if (turn == "BOTTOM") {
	    this.gameView.throwStone();
	} else {
	    console.log('addthrowstone');
	    this.gameView.addThrowStone(data.move.card, turn);
	}
    },

    renderDrawSideStone: function(model) {
	var side = this.model.get("drawSideStone");

	var turn = DIRECTION_TOTAG[RelativeSide(this.model.get("MySide"), this.model.getSide(side))];

	if (turn == "BOTTOM") {
	    this.gameView.drawBottomStone();
	}else {
	    console.log('drawside' + turn);
	    this.gameView.drawStone(turn);
	}
    },

    renderDrawMiddleStone: function(model) {
	this.gameView.drawMiddleStone(this.model.get("drawMiddleStone"));
    },

    renderDrawBottomStone: function(model) {
	this.gameView.drawBottomStone();
    },

    renderRake: function(model) {
	this.gameView.buildStones(this.model.get("Rake"));
    },

    renderPlayer: function(model) {
	for (i =0; i< 4; i++) {
	    var relativeSide = DIRECTION_TOTAG[RelativeSide(this.model.get("MySide"), i)];
	    this.gameView.updatePlayer(this.model.get("Player"+ i), relativeSide);
	}
    },
    
    render: function() {
	this.setElement(this.template({ id : this.model.get('room').getRoomId() }));
	return this;
    },

    buildScene: function() {
	this.stage = new createjs.Stage('testcanvas');
	this.stage.enableMouseOver(20);
	
	this.gameView = new GameView(this.stage);
	this.bindGameViewEvents();
	this.gameView.buildScene();
    },

    bindGameViewEvents: function() {
	this.gameView.Events.drawMiddleStone.attach(function() {
	    this.vent.trigger("drawMiddleStone");
	}, this);

	this.gameView.Events.drawBottomStone.attach(function() {
	    this.vent.trigger("drawBottomStone");
	}, this);

	this.gameView.Events.throwStone.attach(function(stone) {
	    this.vent.trigger("throwStone", stone);
	}, this);

    }
    
});


var RelativeSide = function(myside, side) {
    var delta = myside - BOTTOM;

    return (side - delta + 4) % 4;
}
