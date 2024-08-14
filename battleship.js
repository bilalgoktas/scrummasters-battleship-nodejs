const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

class Battleship {
    start() {
        this.maxRows = 8;
        this.maxColumns = 8;
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");

        console.log("Starting...");
        telemetryWorker.postMessage({ eventName: 'ApplicationStarted', properties: { Technology: 'Node.js' } });

        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();
        console.log(cliColor.yellow('|||||| 📖INTRODUCTION |||||||'))
        console.log(cliColor.magenta(`
        Battleship ⛴️ is a classic strategy game where players try to sink each other\'s hidden ships. 
        Each player strategically places their ships on a grid and takes turns guessing coordinates to attack.
        The goal is to sink all of your opponent\'s ships before they sink yours. 🚢💥`))

        readline.question("Press enter to setup your fleet")

        console.log(`
🗺️ This is our playing field please use this as guide to place your ships
        `)
        this.InitializeGame();
        this.StartGame();
    }

    StartGame() {

        readline.question("Are you ready? Press enter to start the game")

        console.clear();
        console.log("                  __");
        console.log("                 /  \\");
        console.log("           .-.  |    |");
        console.log("   *    _.-'  \\  \\__/");
        console.log("    \\.-'       \\");
        console.log("   /          _/");
        console.log("  |      _  /");
        console.log("  |     /_\\'");
        console.log("   \\    \\_/");
        console.log("    \"\"\"\"");

        console.log(cliColor.green('|||||| The battle has begun |||||||'))

        do {
            console.log();
            console.log(cliColor.magenta("Player, it's your turn"))
            console.log(cliColor.magenta("Enter coordinates for your shot :"))
            var position = Battleship.ParsePosition(readline.question());
            var hitShip = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: hitShip}});

            if (hitShip) {
                gameController.DamageShip(this.enemyFleet, position, hitShip);

                beep();

                console.log("                \\         .  ./");
                console.log("              \\      .:\";'.:..\"   /");
                console.log("                  (M^^.^~~:.'\").");
                console.log("            -   (/  .    . . \\ \\)  -");
                console.log("               ((| :. ~ ^  :. .|))");
                console.log("            -   (\\- |  \\ /  |  /)  -");
                console.log("                 -\\  \\     /  /-");
                console.log("                   \\  \\   /  /");
            }

            if (hitShip) {
                console.log(cliColor.green("Yeah ! Nice hit !⛴️💥"))
            } else {
                console.log(cliColor.yellow("Miss"))
            }

            var computerPos = this.GetRandomPosition();
            hitShip = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: hitShip}});

            console.log();

            if (hitShip) {
                gameController.DamageShip(this.myFleet, computerPos, hitShip);
                console.log(cliColor.red(`Computer shot in ${computerPos.column}${computerPos.row} and has hit your ship ! 💣`))
                beep();

                console.log("                \\         .  ./");
                console.log("              \\      .:\";'.:..\"   /");
                console.log("                  (M^^.^~~:.'\").");
                console.log("            -   (/  .    . . \\ \\)  -");
                console.log("               ((| :. ~ ^  :. .|))");
                console.log("            -   (\\- |  \\ /  |  /)  -");
                console.log("                 -\\  \\     /  /-");
                console.log("                   \\  \\   /  /");
            } else {
                console.log(cliColor.yellow(`Computer shot in ${computerPos.column}${computerPos.row} and missed 😮‍💨`))
            }
        }
        while (gameController.FleetHasShips(this.enemyFleet) && gameController.FleetHasShips(this.myFleet));

        if (gameController.FleetHasShips(this.myFleet)) {
            console.log("You are the winner!");
        } else if (gameController.FleetHasShips(this.enemyFleet)) {
            console.log("You lost");
        }
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        const pos = new position(letter, number);
        if (!pos.isValid()) throw 'invalid_position'
        return pos

    }

    GetRandomPosition() {
        var rndColumn = Math.floor((Math.random() * this.maxColumns));
        var letter = letters.get(rndColumn + 1);
        var number = Math.floor((Math.random() * this.maxRows));
        var result = new position(letter, number);
        return result;
    }

    AddShipToBoard(ship) {
        if(ship.positions.length !== ship.size) throw 'invalid_ship_size'
        ship.positions.forEach((position) => this.board[position.column][position.row] = true);
    }

    InitializeGame() {
        this.InitializeBoard()
        this.InitializeMyFleet();
        this.InitializeEnemyFleet();
    }

    InitializeBoard() {
        this.board = {}
        for (let i = 1; i <= this.maxColumns; i++) {
            this.board[letters.get(i)] = {}
            for (let j = 1; j <= this.maxRows; j++) {
                this.board[letters.get(i)][j] = false
            }
        }
    }

    isPositionOccupied({column, row}) {
        return this.board[column.key] && this.board[column.key][row] !== false
    }

    reservePosition({column, row}) {
        this.board[column.key][row] = true
    }

    clearReservedPositions(positions) {
        positions.forEach(({column, row}) => this.board[column.key][row] = false)
    }
    
    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log('')
        console.log(cliColor.yellow('|||||| SETUP YOUR FLEET ⛴️ 🚢  |||||||'))
        console.log("Please position your fleet (Game board size is from A to H and 1 to 8) :");
    
        this.myFleet.forEach(function (ship) {
            const reservedPositions = []
            console.log();
            console.log(`Please enter the positions for the ${ship.name} (size: ${ship.size})`);
            while (ship.positions.length < ship.size) {
                console.log(`Enter position ${ship.positions.length + 1} of ${ship.size} (i.e A3):`);
                const coordinates = readline.question();
                try {
                    const position = Battleship.ParsePosition(coordinates);
                    if (this.isPositionOccupied(position)) {
                        console.log();
                        console.log("That position is already occupied by another ship. Please choose a different position.");
                        continue;
                    }
                    ship.addPosition(position);
                    this.reservePosition(position)
                    reservedPositions.push(position)
                    telemetryWorker.postMessage({ eventName: 'Player_PlaceShipPosition', properties: { Position: coordinates, Ship: ship.name, PositionInShip: ship.positions.length } });
                } catch (error) {
                    console.log('ERROR', error)
                    console.log();
                    console.log(`That was an invalid position, please enter a position within the board`);
                    console.log();
                    console.log(`Current board size is : ${this.maxColumns} columns and ${this.maxRows} rows`);
                    console.log();
                    console.log(`Enter position ${ship.positions.length + 1} of ${ship.size} (i.e A3):`);
                    this.clearReservedPositions(reservedPositions)
                }
            }
            this.AddShipToBoard(ship);
        }, this);
    }


    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 9));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
    }


}

module.exports = Battleship;
