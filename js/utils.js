isListEmpty = function(task) {
    for (i in task) {
        if (task[i] != undefined && task[i] > 0) {
            return false;
        }
    }
    return true;
}

function initCrafty() {
    Crafty.init(DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

function parseQueryString(qsParm) {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (i in parms) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0,pos);
            var val = parms[i].substring(pos+1);
            qsParm[key] = val;
        }
    }
}
