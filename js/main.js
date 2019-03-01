var Tetris = (function () {

    var canvas = null,
        context = null,
        vpWidth = null,
        vpHeight = null,
        borderSize = 5,

        last = 0,
        fts = 0, // frames this second
        fps = 60, // frames per second

        speed = 1,
        active = null,

        map = [],
        tetrominoes = [],
        locked = []
        ;

    /**
     * Iniitialize game
     */
    function initialize() {
        vpWidth = window.innerWidth;
        vpheight = window.innerHeight;

        // load canvas
        load();

        // initialize grid
        map = Grid.initialize(vpWidth, vpHeight, borderSize);

        // create tetromino array
        tetrominoes = [L, J, T, I, O, Z, S];

        // events
        window.addEventListener('keydown', onkeydown);

        // initial shape
        newShape(0, 3);

        loop(0);
    }

    /**
     * Render whats in the grid
     */
    function render() {
        iterate(function (row, col) {
            let tileSize = Grid.tileSize;

            x = (col * tileSize);
            y = (row * tileSize);

            // draw placements
            if (map[row][col] !== 0) {
                let color = getTileColor(map[row][col]);
                context.fillStyle = color.fill;
                context.fillRect(x, y, tileSize, tileSize);
                context.strokeStyle = color.stroke;
                context.strokeRect(x, y, tileSize, tileSize);
            }
        });
    }

    /**
     * Gets a tiles color given its id
     */
    function getTileColor (tileid) {
        for (var i in tetrominoes) {
            var shape = new tetrominoes[i]();
            if (shape.tileid === tileid) {
                return shape.color;
            }
        }

        return { 'fill': '#000000', 'stroke': '#ff0000' };
    }

    /**
     * Main render loop
     */
    function iterate(callback) {
        // loop over the map to render the tiles
        for (var row in map) {
            if (map.hasOwnProperty(row)) {
                for (var col in map[row]) {
                    if (map[row].hasOwnProperty(col)) {
                        callback(row, col);
                    }
                }
            }
        }
    }

    /**
     * Applys rules to the state
     */
    function update(timestamp) {

        // game tick (shape speed)
        if (timestamp > (last + (speed * 1000))) {
            if (active) {
                move(active, active.x + 1, active.y);
            }
        }

    }

    /**
     * Move shape to new position
     */
    function move(shape, targetX, targetY) {
        // unload its existing render
        unloadObject(shape);

        // check bounds
        clamp(shape, targetX, targetY);

        // hit test
        hit(shape);

        // reload
        loadObject(shape);

        // lock?
        lock(shape);
    }

    /**
     * Perform a shape rotation
     */
    function rotate(shape, newPivot) {
        // calculate rotation cycle.
        let target = (shape.pivot + newPivot) % 4;
        if (target < 0) { target = 3; }

        // set new pivot
        shape.pivot = target;

        // unload original shape
        unloadObject(shape);

        // kick the shape back out of the wall.
        kick(shape);

        // reload shape
        loadObject(shape);
    }

    /**
     * If the result of a rotation intersects the shape with a wall,
     * kick the shape back out of the wall on to the board
     */
    function kick(shape) {
        shape.location = resolveObject(shape);

        let lbounds = shapeLowerBounds(shape);
        let ubounds = shapeUpperBounds(shape);

        let targetX = shape.x;
        let targetY = shape.y;

        if (ubounds['y'] > Grid.columns - 1) {
            targetY = (Grid.columns - 1) - (ubounds['y'] - lbounds['y']);
        } else if (lbounds['y'] < 0) {
            targetY = 0;
        }

        shape.ox = shape.x; // old x
        shape.oy = shape.y; // old y
        shape.x = targetX; // new x
        shape.y = targetY; // new y
    }

    /**
     * Lock a shape in if its placed.
     */
    function lock(shape) {
        let ubounds = shapeUpperBounds(shape);
        if (shape.locked || ubounds['x'] === Grid.rows - 1) {
            shape.locked = true;
            //locked.push(shape);

            // clear line
            lineclear();

            active = null;
            speed = 1;
            newShape(0, 3);
        }
    }

    /**
     * Checks the locked pieces, and clears a line if it matches.
     */
    function lineclear() {
        for (var row in map) {
            let count = 0;
            for (var col in map[row]) { if (map[row][col] > 0) { count ++; }  }

            if (count >= Grid.columns) {
                let size = Grid.columns;
                map.splice(row, 1);

                map.unshift([]);
                while (size--) map[0].push(0);
            }
        }
    }

    /**
     * Checks a shape so it cannot pass through other shapes
     * or the bottom/sides of the grid
     */
    function clamp(shape, targetX, targetY) {
        let lbounds = shapeLowerBounds(shape);
        let ubounds = shapeUpperBounds(shape);

        // check bottom/top edge
        if (ubounds['x'] >= Grid.rows - 1) {
            targetX = lbounds['x'];
        } else if (targetX < 0) {
            targetX = 0;
        }

        // check right/left edge
        let ydist = targetY - shape.y;
        if (ubounds['y'] >= Grid.columns - 1 && targetY > shape.y) {
            targetY = shape.y;
        } else if (lbounds['y'] + ydist < 0) {
            targetY = shape.y + lbounds['y'];
        }

        // set position
        shape.ox = shape.x; // old x
        shape.oy = shape.y; // old y
        shape.x = targetX; // new x
        shape.y = targetY; // new y
    }

    /**
     * Has active shape hit another shape in the map
     */
    function hit(shape) {
        shape.location = resolveObject(shape);

        // for every cell in the shape
        for (var row in shape.location) {
            if (shape.location.hasOwnProperty(row)) {
                for (var col in shape.location[row]) {
                    if (shape.location[row].hasOwnProperty(col)) {
                        // if cell is active && overlapping a map cell
                        if (shape.location[row][col] !== 0 && map[row][col] !== 0) {
                            if (shape.x > shape.ox) {
                                shape.locked = true;
                            }

                            shape.x = shape.ox;
                            shape.y = shape.oy;
                        }
                    }
                }
            }
        }
    }

    /**
     * Upper bounds of a shape
     */
    function shapeUpperBounds(shape) {
        let locate = shape.location.slice(0);
        let maxX = 0; let maxY = 0;

        // get max bounding x and y
        for (var i in locate) {
            if (locate.hasOwnProperty(i)) {
                let xHasFill = false;
                for (var j in locate[i]) {
                    if (locate[i].hasOwnProperty(j)) {
                        if (locate[i][j] !== 0) {
                            xHasFill = true;
                            if (parseInt(j) > maxY) { maxY = parseInt(j); }
                        }
                    }
                }
                if (parseInt(i) > maxX && xHasFill) { maxX = parseInt(i); }
            }
        }

        return { "x": parseInt(maxX), "y": parseInt(maxY) };
    }

    /**
     * Lower bounds of a shape
     */
    function shapeLowerBounds(shape) {

        let locate = shape.location.slice(0);
        let minX = Grid.rows - 1;
        let minY = Grid.columns - 1;

        // get max bounding x and y
        for (var i in locate) {
            if (locate.hasOwnProperty(i)) {
                let xHasFill = false;
                for (var j in locate[i]) {
                    if (locate[i].hasOwnProperty(j)) {
                        if (locate[i][j] !== 0) {
                            xHasFill = true;
                            if (parseInt(j) <= minY) { minY = parseInt(j); }
                        }
                    }
                }
                if (parseInt(i) <= minX && xHasFill) { minX = parseInt(i); }
            }
        }

        return { "x": minX, "y": minY };
    }

    /**
     * Create a new shape at random
     */
    function newShape(x, y) {

        let index = Math.floor(Math.random() * tetrominoes.length);
        let shape = new tetrominoes[index](x, y);
        active = loadObject(shape);
    }

    /**
     * Unload object from game map
     */
    function unloadObject(object) { //map[row][col] = 0;
        for (var row in object.location) {
            for (var col in object.location[row]) {
                if (typeof map[row] !== 'undefined' && typeof map[row][col] !== 'undefined') {
                    if (object.location[row][col] !== 0 || map[row][col] === 0) {
                        map[row][col] = 0;
                    }
                }
            }
        }
    }

    /**
     * Load object in to the game map
     */
    function loadObject(object) {
        let grid = resolveObject(object);
        object.location = grid;

        for (var row in grid) {
            if (grid.hasOwnProperty(row)) {
                for (var col in grid[row]) {
                    if (grid[row].hasOwnProperty(col)) {
                        if (typeof map[row] !== 'undefined' && typeof map[row][col] !== 'undefined') {
                            if (!map[row][col] || map[row][col] === 0) {
                                map[row][col] = grid[row][col];
                            }
                        }
                    }
                }
            }
        }

        return object;
    }

    /**
     * Take an object map and resolve it as a grid array
     */
    function resolveObject(object) {
        let grid = [];
        let x = object.x;
        let y= object.y;
        let state = object.states[object.pivot];

        for (var row = 0; row < state.length; row++) {
            grid[x + row] = [];
            for (var col = 0; col < state[row].length; col++) {
                if (state[row][col] === 1) {
                    state[row][col] = object.tileid;
                }
                grid[x + row][y + col] = state[row][col];
            }
        }

        return grid;
    }

    /**
     * Main loop
     */
    function loop(timestamp) {
        clearContext();
        update(timestamp);
        render();

        if (timestamp > (last + (speed * 1000))) {
            fps = (0.25 * fts + (1 - 0.25) * fps);
            last = timestamp;
            fts = 0;
        }
        fts ++;

        requestAnimationFrame(loop);
    }

    /**
     * User input on keydown
     */
    function onkeydown(e) {
        if (active) {
            if (e.keyCode === 37) {
                move(active, active.x, active.y - 1); // move left
            } else if (e.keyCode === 39) {
                move(active, active.x, active.y + 1); // move right
            } else if (e.keyCode === 40) {
                move(active, active.x + 1, active.y); // move down
            } else if (e.keyCode === 38) {
                rotate(active, +1); // rotate clockwise
            } else if (e.keyCode === 32) {
                speed = 0.01; // hard drop
            } else if (e.keyCode === 81) {
                rotate(active, -1); // rotate counter-clockwise
            } else if (e.keyCode === 69) {
                rotate(active, +1); // rotate clockwise
            }
        }
    }

    /**
     * build canvas
     */
    function load() {
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        canvas.id = "main";
        canvas.width = Grid.tileSize * Grid.columns;
        canvas.height = Grid.tileSize * Grid.rows;
        canvas.style.top = "10px";
        canvas.style.left = (vpWidth / 2) - ((Grid.tileSize * Grid.columns) / 2) + "px";
        canvas.style.border = borderSize + "px solid transparent"
        document.body.appendChild(canvas);
    }

    /**
     * Scrubs game board
     */
    function clearContext() {
        let w = Grid.tileSize * Grid.columns;
        let h = Grid.tileSize * Grid.rows;
        context.clearRect(0, 0, w, h);
    }

    // return
    return {
        initialize: initialize
    };

})();


window.onload = function() {
    Tetris.initialize();
};
