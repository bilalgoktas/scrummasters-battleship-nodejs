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

        ships[isHitIndex].positions.forEach(function(pos, index, arr) {
            if (position.column === pos.column && position.row === pos.row) {
                arr.splice(index, 1)
            }
        });

        if (ships[isHitIndex].positions.length === 0) {
            ships.splice(isHitIndex, 1);
        }

        return ships;
    }
}

module.exports = GameController;