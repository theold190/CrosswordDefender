Crafty.c("Player", {
    init: function() {
        this.bind('KeyDown', function(e) {
            this._parseKeyPress(e.key);
        });
    },
    _parseKeyPress: function(key) {
        var cells = this._board._getCellsByKey(key);
        if(cells != undefined) {
            for(i in cells) {
                this._board._assignRandomKey(cells[i]);
            }
        } else {
            //TODO: Mark as a mistake
        }
    },
    _setBoard: function(board) {
        this._board = board;
        return this;
    },
    _setDefenderPosition: function(defender) {
        this._defender = defender;
        return this;
    },
});
