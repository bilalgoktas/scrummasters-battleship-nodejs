class GameController {
    static InitializeShips() {
        var colors = require("cli-color");
        const Ship = require("./ship.js");
        var ships = [
            new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            new Ship("Battleship", 4, colors.Red),
            new Ship("Submarine", 3, colors.Chartreuse),
            new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        return ships;
    }

    static CheckIsHit(ships, shot) {
        if (shot === undefined)
            throw "The shooting position is not defined";
        if (ships === undefined)
            throw "No ships defined";
        var returnvalue = null;
        ships.forEach(function (ship) {
            ship.positions.forEach(position => {
                if (position.row === shot.row && position.column === shot.column)
                    returnvalue = ship;
            });
        });
        return returnvalue;
    }

    static isShipValid(ship) {
        return ship.positions.length == ship.size;
    }

    static DamageShip(ships, position, hitShip ) {
        var isHitIndex = ships.indexOf(hitShip);
        var hitCount = 0;
        ships[isHitIndex].positions.forEach(function(pos, index, arr) {
            if (position.column === pos.column && position.row === pos.row) {
                ships[isHitIndex].positions[index].setHit();
            }
        });
        ships[isHitIndex].positions.forEach(function(item, index) {
            if (item.hit) {
                hitCount++
            }
        });
        if (ships[isHitIndex].positions.length === hitCount) {
            ships[isHitIndex].kill();
        }

        return ships;
    }

    static FleetHasShips(ships) {
        var aliveShipCount = 0;
        ships.forEach(function(item) {
            if (item.isDead()) {
                aliveShipCount++;
            }
        });

        console.log(ships);
        console.log(aliveShipCount);
        return aliveShipCount < ships.length;
    }
}

module.exports = GameController;