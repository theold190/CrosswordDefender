var NUMBER_OF_ENEMIES_MIN = 3,
    NUMBER_OF_ENEMIES_MAX = 6;

Crafty.c("Game", {
    _startGame: function(totalGames) {
        this._startRound();
    },
    _startRound: function() {
        this._clearAll();
        var board = Crafty.e("Board");
        this._board = board;

        var defenderPosition = this._board._getCenterCell();
        defenderPosition._setAsDefender();

        var player = Crafty.e("Player")._setBoard(board);
        player._setDefenderPosition(defenderPosition);

        this._enemies = [];
        var numEnemies = Crafty.math.randomInt(NUMBER_OF_ENEMIES_MIN, NUMBER_OF_ENEMIES_MAX);

        for (var i=0; i < numEnemies; i++) {
            var x = 0, y = 0, badPosition = true;
            while(badPosition) {
                x = Crafty.math.randomInt(BOARD_LEFT, BOARD_WIDTH-ENEMY_WIDTH);
                y = Crafty.math.randomInt(BOARD_TOP, BOARD_HEIGHT-ENEMY_HEIGHT);

                badPosition = defenderPosition._isInsideCell(x, y)
                    || defenderPosition._isInsideCell(x+ENEMY_WIDTH, y+ENEMY_HEIGHT)
                    || defenderPosition._isInsideCell(x, y+ENEMY_HEIGHT)
                    || defenderPosition._isInsideCell(x+ENEMY_WIDTH, y);
            }

            var enemy = Crafty.e("Enemy")._setPosition(x, y);
            this._enemies[i] = enemy;
        }
    },
    _clearAll: function() {
        var items = Crafty('2D');
        for (i in items) {
            Crafty(items[i]).destroy();
        }
    }
});