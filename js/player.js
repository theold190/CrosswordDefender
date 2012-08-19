Crafty.c("Player", {
    init: function() {
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
    _setEnemies: function(enemies) {
        this._enemies = enemies;
        return this;
    },
    _placeEnemy: function(enemy) {
        var x = 0, y = 0;
        do {
            x = Crafty.math.randomInt(this._board.x, this._board.w-enemy.w);
            y = Crafty.math.randomInt(this._board.y, this._board.h-enemy.h);
        } while (this._defenderPosition.intersect(x, y, enemy.w, enemy.w));
        enemy._setPosition(x,y);
    },
    _setDefenderPosition: function(position) {
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
    _removeDeadEnemies: function() {
        for (var i=0; i < this._enemies.length; i++) {
            var en = this._enemies[i];
            if (en._isDead()) {
                en.undraw();
                Crafty(en).destroy();
                this._enemies.splice(i,1);
                i--;
            }
        }
    },
    _start: function() {
        for (var i=0; i < this._enemies.length; i++) {
            var en = this._enemies[i];
            en._setTarget(this._defenderPosition.x+CELL_WIDTH/2, this._defenderPosition.y+CELL_HEIGHT/2);
        }
    }
});
