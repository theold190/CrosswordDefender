Crafty.c("Player", {
    init: function() {
        this._enemies = [];
        this._damage = 0;
        this.bind('KeyDown', function(e) {
            this._parseKeyPress(e.key);
        });
    },
    _parseKeyPress: function(key) {
        var cells = this._board._getCellsByKey(key);
        if (cells != undefined) {
            for (var i=0; i < cells.length; i++) {
                var enemies = this._getEnemiesInCell(cells[i]);
                for (var j=0; j < enemies.length; j++) {
                    enemies[j]._hit();
                }
                this._board._assignRandomKey(cells[i]);
            }
            this._removeDeadEnemies();
        } else {
            //TODO: Mark as a mistake
        }
    },
    _setBoard: function(board) {
        this._board = board;
        return this;
    },
    _generateEnemies: function(numEnemies) {
        for (var i=0; i < numEnemies; i++) {
            var enemy = Crafty.e("Enemy");
            this._placeEnemy(enemy);
            enemy._setTarget(this._defenderPosition.x+CELL_WIDTH/2, this._defenderPosition.y+CELL_HEIGHT/2);
            this._enemies.push(enemy);
        }
    },
    _startEnemies: function() {
        for (var i=0; i < this._enemies.length; i++) {
            var en = this._enemies[i];
            en._start();
        }
    },
    _setEnemies: function(enemies) {
        this._enemies = enemies;
        return this;
    },
    _placeEnemy: function(enemy) {
        var x = 0, y = 0, axis = 0;
        do {
            x = Crafty.math.randomInt(this._board.x, this._board.w-enemy.w);
            y = Crafty.math.randomInt(this._board.y, this._board.h-enemy.h);
            // Defines if enemy will spawn on vertical/horizontal edge
            axis = Crafty.math.randomInt(0,1);
            if (axis == 0) {
                // This defines if we spawn enemy from the top or the bottom
                if(y > (this._board.h-this._board.y)/2) {
                    y = this._board.h-enemy.h;
                } else {
                    y = 0;
                }
            } else {
                // This defines if we spawn enemy from the left or the right
                if(x > (this._board.w-this._board.x)/2) {
                    x = this._board.w-enemy.w;
                } else {
                    x = 0;
                }
            }
        } while (this._defenderPosition.intersect(x, y, enemy.w, enemy.w));
        enemy._setPosition(x,y);
    },
    _setDefenderPosition: function(position) {
        if (this.has("2D")) {
            this.removeComponent("2D");
        }
        if (this.has("Collision")) {
            this.removeComponent("Collision");
        }
        this.addComponent("2D").attr({x: position.x, y: position.y, w: position.w, h: position.h});
        this.addComponent("Collision").onHit("Enemy", this._onHitDefender);
        this._defenderPosition = position;
        return this;
    },
    _getEnemiesInCell: function(cell) {
        var enemiesOnCell = [];
        var counter = 0;
        for (var i=0; i < this._enemies.length; i++) {
            var en = this._enemies[i];
            if (cell.intersect(en.x, en.y, en.w, en.h)) {
                enemiesOnCell[counter] = en;
                counter++;
            }
        }
        return enemiesOnCell;
    },
    _removeEnemy: function(enemy) {
        enemy.undraw();
        Crafty(enemy).destroy();
    },
    _removeDeadEnemies: function() {
        for (var i=0; i < this._enemies.length; i++) {
            var en = this._enemies[i];
            if (en._isDead()) {
                this._removeEnemy(en);
                this._enemies.splice(i,1);
                i--;
            }
        }
        if (this._enemies.length === 0) {
            var game = Crafty(CRAFTY_GAME_ID);
            game._waveIsCompleted();
        }
    },
    _onHitDefender: function() {
        var enemies = this._getEnemiesInCell(this._defenderPosition);
        if (enemies.length === 0) {
            return;
        }
        for (var i=0; i < enemies.length; i++) {
            enemies[i]._stop();
            this._damage += enemies[i]._biteTarget();
            enemies[i]._die();
        }
        this._removeDeadEnemies();
    }
});
