/**
 *
 */
var L = function (x, y) {
    this.tileid = 1;
    this.color = {
        'fill': '#3185fc',
        'stroke': '#fff',
    }
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[0,0,1],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,0],[0,1,1]],
        [[0,0,0],[1,1,1],[1,0,0]],
        [[1,1,0],[0,1,0],[0,1,0]]
    ];
}

/**
 *
 */
var J = function (x, y) {
    this.tileid = 2;
    this.color = {
        'fill': '#ffb140',
        'stroke': '#fff',
    }
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[1,0,0],[1,1,1],[0,0,0]],
        [[0,1,1],[0,1,0],[0,1,0]],
        [[0,0,0],[1,1,1],[0,0,1]],
        [[0,1,0],[0,1,0],[1,1,0]]
    ]
}

/**
 *
 */
var T = function (x, y) {
    this.color = {
        'fill': '#7e48e8',
        'stroke': '#fff',
    }
    this.tileid = 3;
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[0,1,0],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,1],[0,1,0]],
        [[0,1,0],[1,1,0],[0,1,0]]
    ];
}

/**
 *
 */
var I = function (x, y) {
    this.color = {
        'fill': '#79d5ea',
        'stroke': '#fff',
    }
    this.tileid = 4;
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
    ];
}

/**
 *
 */
var O = function (x, y) {
    this.color = {
        'fill': '#f5e663',
        'stroke': '#fff',
    }
    this.tileid = 5;
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]]
    ];
}

/**
 *
 */
var Z = function (x, y) {
    this.color = {
        'fill': '#ae5c69',
        'stroke': '#fff',
    }
    this.tileid = 6;
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]],
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]]
    ];
}

/**
 *
 */
var S = function (x, y) {
    this.color = {
        'fill': '#a2d8b4',
        'stroke': '#fff',
    }
    this.tileid = 7;
    this.x = x;
    this.y = y;
    this.ox = x;
    this.oy = y;
    this.location = [];
    this.locked = false;
    this.pivot = 0;
    this.states = [
        [[0,1,1],[1,1,0],[0,0,0]],
        [[1,0,0],[1,1,0],[0,1,0]],
        [[0,1,1],[1,1,0],[0,0,0]],
        [[1,0,0],[1,1,0],[0,1,0]]
    ];
}
