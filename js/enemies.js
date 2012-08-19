var ENEMY_WIDTH = CELL_WIDTH/4,
    ENEMY_HEIGHT = CELL_HEIGHT/4;

var ENEMY_TYPE_BASIC = 1;

var ENEMY_COLOR_BASIC = "#ff0000";

Crafty.c("Enemy", {
    init: function() {
        this.addComponent("2D, DOM, Color");
        this.attr({w:ENEMY_WIDTH, h:ENEMY_HEIGHT});
        this._setType(ENEMY_TYPE_BASIC);
    },
    _setType: function(type) {
        this._type = type;
        if (this._type == ENEMY_TYPE_BASIC) {
            this._health = 3;
            this.color(ENEMY_COLOR_BASIC);
        }
        return this;
    },
    _setPosition: function(x, y) {
        this.attr({x: x, y: y});
        return this;
    },
    _hit: function() {
        this._health--;
        return this;
    },
    _isDead: function() {
        return this._health <= 0;
    }
});
