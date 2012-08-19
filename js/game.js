Crafty.c("Game", {
    _startGame: function(totalGames) {
        this._startRound();
    },
    _startRound: function() {
        this._clearAll();
        var board = Crafty.e("Board");
        this._board = board;

        var defenderPosition = board._getCenterCell();
        defenderPosition._setAsDefender();

        var player = Crafty.e("Player")._setBoard(board);
        player._setDefenderPosition(defenderPosition);
    },
    _clearAll: function() {
        var items = Crafty('2D');
        for (i in items) {
            Crafty(items[i]).destroy();
        }
    }
});