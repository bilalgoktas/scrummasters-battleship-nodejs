class Position {
    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.hit = false;
        this.maxGridSize = 8;
        this.offset = 1;
    }

    setHit() {
        this.hit = true;
    }

    toString() {
        return this.column.toString() + this.row.toString()
    }

    isValid() {
        return this.row - this.offset <= this.maxGridSize && this.column - this.offset <= this.maxGridSize;
    }
}

module.exports = Position;