var Grid = (function () {

    var map = [],
        gcanvas = null,
        gcontext = null,
        rows = 20,
        columns = 10,
        tileSize = 30,
        gridOffset = 0,
        showGrid = false;

    function initialize(vpWidth, vpHeight, borderSize) {
        gcanvas = document.createElement('canvas');
        gcontext = gcanvas.getContext('2d');
        gcanvas.width = tileSize * columns;
        gcanvas.height = tileSize * rows;
        gcanvas.style.top = "10px";
        gcanvas.style.left = ((vpWidth / 2) - ((tileSize * columns) / 2)) + "px";
        gcanvas.style.border = borderSize + "px solid #666";
        document.body.appendChild(gcanvas);

        map = grid();

        if (showGrid) {
            gridlines();
        }

        return map;
    }

    /**
     * Create grid
     */
    function grid() {
        let grid = [];
        for (var row = 0; row < rows; row++) {
            grid[row] = [];
            for (var col = 0; col < columns; col++) {
                grid[row][col] = 0;
            }
        }
        return grid;
    }

    /**
     * draw gridlines
     */
    function gridlines() {
        gcontext.strokeStyle = "#ccc";
        gcontext.lineWidth = 1;
        gridOffset = 0.5;

        let lastRow = null;
        loop(function (row, col) {
            if (row != lastRow && row != 0) {
                gcontext.moveTo(0, (row * tileSize) + gridOffset);
                gcontext.lineTo((columns * tileSize), (row * tileSize) + gridOffset);
                gcontext.stroke();
                lastRow = row;
            }

            if (row == 0 && col != 0) {
                gcontext.moveTo((col * tileSize) + gridOffset, 0);
                gcontext.lineTo((col * tileSize) + gridOffset, (rows * tileSize));
                gcontext.stroke();
            }
        });
    }

    /**
     * Main render loop
     */
    function loop(callback) {
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


    // return
    return {
        initialize: initialize,
        tileSize: tileSize,
        columns: columns,
        rows: rows
    };
})();