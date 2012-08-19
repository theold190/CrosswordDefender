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
            var enemy = Crafty.e("Enemy");
            player._placeEnemy(enemy);
            this._enemies[i] = enemy;
        }
        player._setEnemies(this._enemies);
        player._start();
    },
    _clearAll: function() {
        var items = Crafty('2D');
        for (var i=0; i < items.length; i++) {
            Crafty(items[i]).destroy();
        }
    }
});