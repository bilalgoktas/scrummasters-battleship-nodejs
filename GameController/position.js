class Position {
    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.hit = false;
    }

    setHit() {
        this.hit = true;
    }

    toString() {
        return this.column.toString() + this.row.toString()
    }

}

module.exports = Position;