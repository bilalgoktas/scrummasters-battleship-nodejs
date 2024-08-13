class Position {
    constructor(column, row) {
        this.column = column;
        this.row = row;
    }

    toString() {
        return this.column.toString() + this.row.toString()
    }

    isValid() {
        return this.row <= 8 && this.column <= 8
    }
}

module.exports = Position;