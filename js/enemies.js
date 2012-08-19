var ENEMY_WIDTH = CELL_WIDTH/4,
    ENEMY_HEIGHT = CELL_HEIGHT/4;

var ENEMY_TYPE_BASIC = 1,
    ENEMY_TYPE_HEAVY = 2,
    ENEMY_TYPE_FAST = 3,
    ENEMY_TYPE_PSYCHO = 4,
    ENEMY_TYPE_ULTRAFAST = 5;

Crafty.c("Enemy", {
    init: function() {
        this.addComponent("2D, DOM, Color, Tween");
        this.attr({w:ENEMY_WIDTH, h:ENEMY_HEIGHT});

        var enemyType = Crafty.math.randomInt(0, 100);
        if (enemyType < 50) {
            this._setType(ENEMY_TYPE_BASIC);
        } else if (enemyType < 80) {
            this._setType(ENEMY_TYPE_HEAVY);
        } else if (enemyType < 96) {
            this._setType(ENEMY_TYPE_FAST);
        } else {
            this._setType(ENEMY_TYPE_PSYCHO);
        }
    },
    _setType: function(type) {
        this._type = type;
        if (this._type == ENEMY_TYPE_BASIC) {
            this._health = 2;
            this.color("#ff0000");
            this._speed = 800;
        } else if (this._type == ENEMY_TYPE_HEAVY) {
            this._health = 4;
            this.color("#111111");
            this._speed = 1600;
        } else if (this._type == ENEMY_TYPE_FAST) {
            this._health = 1;
            this.color("#f0d0d0");
            this._speed = 400;
        } else if (this._type == ENEMY_TYPE_PSYCHO) {
            this._health = 2;
            this.color("#111111");
            this._speed = 1500;
        } else if (this._type == ENEMY_TYPE_ULTRAFAST) {
            this.color("#f0f0f0");
            this._speed = 200;
        }
        return this;
    },
    _start: function() {
        if (this.has("Tween")) {
            this.removeComponent("Tween");
        }
        this.addComponent("Tween");
        this.tween({x: this._targetX, y: this._targetY}, this._speed);
    },
    _stop: function() {
        if (this.has("Tween")) {
            this.removeComponent("Tween");
        }
    },
    _setPosition: function(x, y) {
        this.attr({x: x, y: y});
        return this;
    },
    _setTarget: function(x, y) {
        this._targetX = x;
        this._targetY = y;
        return this;
    },
    _hit: function() {
        this._health--;
        // Special handling of a psycho type
        if (this._type == ENEMY_TYPE_PSYCHO) {
            this._stop();
            this._setType(ENEMY_TYPE_ULTRAFAST);
            this._start();
        }
        return this;
    },
    _isDead: function() {
        return this._health <= 0;
    }
});
