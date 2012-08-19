var NUMBER_OF_ENEMIES_MIN = 3,
    NUMBER_OF_ENEMIES_MAX = 6;

var MIN_ENEMIES_PER_SUBWAVE = 2,
    MAX_ENEMIES_PER_SUBWAVE = 5,
    MIN_ENEMIES_PER_WAVE = 10,
    MAX_ENEMIES_PER_WAVE = 20;

var NUMBER_OF_WAVES = 3;

var CRAFTY_GAME_ID = 0;

Crafty.c("Game", {
    init: function() {
        this._waveNumber = 0;
        this._waveEnemiesLeft = 0;
        this._enemies = [];
    },
    _startGame: function(totalGames) {
        this._startRound();
    },
    _startRound: function() {
        this._clearAll();
        var board = Crafty.e("Board");
        this._board = board;

        var defenderPosition = this._board._getCenterCell();
        defenderPosition._setAsDefender();

        var player = new Crafty.e("Player")._setBoard(board);
        player._setDefenderPosition(defenderPosition);
        this._player = player;
        setTimeout(this._startNewWave, 2000);
    },
    _clearAll: function() {
        var items = Crafty('2D');
        for (var i=0; i < items.length; i++) {
            Crafty(items[i]).destroy();
        }
    },
    _startNewSubWave: function() {
        var game = Crafty(CRAFTY_GAME_ID);
        var numEnemies = game._waveEnemiesLeft;
        if (numEnemies > MAX_ENEMIES_PER_SUBWAVE) {
            numEnemies = Crafty.math.randomInt(MIN_ENEMIES_PER_SUBWAVE, MAX_ENEMIES_PER_SUBWAVE);
        }
        game._waveEnemiesLeft -= numEnemies;
        game._enemies = game._player._generateEnemies(numEnemies);
        game._player._start();
//        var msg="SubWave ("+numEnemies+"/"+game._waveEnemiesLeft+" enemies)";
//        alert(msg);
    },
    _startNewWave: function() {
        var game = Crafty(CRAFTY_GAME_ID);
        game._waveEnemiesLeft = Crafty.math.randomInt(MIN_ENEMIES_PER_WAVE, MAX_ENEMIES_PER_WAVE);
//        var msg="Wave "+game._waveNumber+"/"+NUMBER_OF_WAVES-1 + " ("+game._waveEnemiesLeft+" enemies)";
//        alert(msg);
        game._startNewSubWave();
    },
    _waveIsCompleted: function() {
        var game = Crafty(CRAFTY_GAME_ID);
        if (game._waveEnemiesLeft > 0) {
            game._startNewSubWave();
        } else if (game._waveNumber < NUMBER_OF_WAVES-1) {
            setTimeout(game._startNewWave, 2000);
            game._waveNumber++;
        } else {
            alert("Victory!!!");
        }
    }
});