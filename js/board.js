var BOARD_ROWS = 3,
    BOARD_COLS = 3;
var CELL_WIDTH  = DISPLAY_WIDTH/BOARD_COLS,
    CELL_HEIGHT = DISPLAY_WIDTH/BOARD_ROWS;
var BOARD_LEFT = 0,
    BOARD_TOP  = 0;
var BOARD_WIDTH  = BOARD_COLS*CELL_WIDTH,
    BOARD_HEIGHT = BOARD_ROWS*CELL_HEIGHT;

var CELL_TYPE_NORMAL = 0,
    CELL_TYPE_DEFENDER = 1;

var TEXT_COLOR_NORMAL = '#000000';

var BOARD_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

// Cell should have indexes in a board and not x and y as coordinates
// This way it will be easier to search cells
Crafty.c("Cell", {
    init: function() {
        this.addComponent("2D, DOM");
        this.attr({w:CELL_WIDTH, h:CELL_HEIGHT});
    },
    _type: CELL_TYPE_NORMAL,
    _sprite_initialized: false,
    _makeCell: function(x, y, type, text) {
        this.attr({x: x, y: y});
        this._type = type;

        if (this._type == CELL_TYPE_NORMAL)
        {
            var TEXT_COLORS = [TEXT_COLOR_NORMAL];
            var index = this._type - CELL_TYPE_NORMAL;
            if(!this.has("Text")) {
                this.addComponent("Text");
                this.css({textAlign: 'center'});
                this.textFont({size: '50px', family: 'Arial'});
            }
            this.textColor(TEXT_COLORS[index], 1);
            this.text(text);
        } else if (this._type == CELL_TYPE_DEFENDER) {
            if(this.has("Text")) {
                this.text(" ");
                this.removeComponent("Text");
            }
            if(this.has("Sprite")) {
                this.removeComponent("Sprite");
            }
            this.addComponent("sprite_hero");
        }
        new Crafty.polygon([0,0],[10,10],[0,10]);
        return this;
    },
    _isSame: function(cell) {
        if (this.x == cell.x && this.y == cell.y) {
            return true;
        }
        return false;
    },
    _setAsDefender: function() {
        this._makeCell(this.x, this.y, CELL_TYPE_DEFENDER, this.text());
    },
    _isInsideCell: function(x, y) {
        if (this.x <= x && this.x+this.w > x) {
            if (this.y <= y && this.y+this.h > y) {
                return true;
            }
        }
        return false;
    },
    _isAssignedKey: function(key) {
        if (key == Crafty.keys[this._text]) {
            return true;
        }
        if ((this._type == CELL_TYPE_DEFENDER)
            && (key == Crafty.keys['SPACE']
                || key == Crafty.keys['ENTER']))
        {
            return true;
        }
        return false;
    }
});

Crafty.c("Board", {
    CELL_TYPE: [CELL_TYPE_NORMAL],
    init: function() {
        this.addComponent("2D, Canvas, sprite_background");
        this.attr({x: BOARD_LEFT, y: BOARD_TOP, w:BOARD_WIDTH, h:BOARD_HEIGHT});
        this._setupBoard(this.x, this.y, BOARD_ROWS, BOARD_COLS, CELL_WIDTH, CELL_HEIGHT);
    },
    _setupBoard: function(x, y, rows, cols, cw, ch) {
        this._board = [];
        for (var i=0; i<cols; i++) {
            this._board[i] = [];
            for (var j=0; j<rows; j++) {
                var cell = Crafty.e("Cell")._makeCell(x + i*cw,
                                                     y + j*ch,
                                                     Crafty.math.randomElementOfArray(this.CELL_TYPE),
                                                     Crafty.math.randomElementOfArray(BOARD_LETTERS));
                this._board[i][j] = cell;
            }
        }
    },
    _getCenterCell: function() {
        var cols = this._board.length;
        var rows = this._board[0].length;
        var i = parseInt(cols/2);
        var j = parseInt(rows/2);
        return cell = this._board[i][j];
    },
    _getRandomCell: function(type) {
        var cols = this._board.length;
        var rows = this._board[0].length;
        var cell, first = false;
        if(type == undefined) {first = true;}

        do {
            var i = Crafty.math.randomInt(0, cols-1);
            var j = Crafty.math.randomInt(0, rows-1);
            cell = this._board[i][j];
        } while (!first && cell._type != type);
        return cell;
    },
    _getCell: function(x, y) {
        for (i in this._board) {
            for (i in this._board[i]) {
                if(this._board[i][j]._isInsideCell(x,y)) {
                    return this._board[i][j];
                }
            }
        }
    },
    _getCellsByKey: function(key) {
        var cells = [];
        var counter = 0;
        for (i in this._board) {
            for (j in this._board[i]) {
                if(this._board[i][j]._isAssignedKey(key)) {
                    cells[counter] = this._board[i][j];
                    counter++;
                }
            }
        }
        return cells;
    },
    _assignRandomKey: function(cell) {
        if (cell._type == CELL_TYPE_NORMAL)
        {
            var newKey = Crafty.math.randomElementOfArray(BOARD_LETTERS);
            cell._makeCell(cell.x, cell.y, CELL_TYPE_NORMAL, newKey);
        } else if (cell._type == CELL_TYPE_DEFENDER) {
            for (i in this._board) {
                for (j in this._board[i]) {
                    var tmpCell = this._board[i][j];
                    if(tmpCell._type == CELL_TYPE_NORMAL) {
                        var newKey = Crafty.math.randomElementOfArray(BOARD_LETTERS);
                        tmpCell._makeCell(tmpCell.x, tmpCell.y, CELL_TYPE_NORMAL, newKey);
                    }
                }
            }
        }
    },
    _getCellOnTop: function(x, y) {
        return this._getCell(x, y-CELL_HEIGHT);
    },
    _getCellOnBottom: function(x, y) {
        return this._getCell(x, y+CELL_HEIGHT);
    },
    _getCellOnLeft: function(x, y) {
        return this._getCell(x-CELL_WIDTH, y);
    },
    _getCellOnRight: function(x, y) {
        return this._getCell(x+CELL_WIDTH, y);
    }
});
