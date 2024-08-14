class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.alive = true;
        this.positions = [];
    }

    kill() {
        this.alive = false;
    }

    isDead() {
        var hitPositions = 0;
        this.positions.forEach(function (position) {
            if (position.hit) {
                hitPositions++;
            }
        });

        return hitPositions === this.positions.length;
    }

    addPosition(position) {
        this.positions.push(position);
    }
}

module.exports = Ship;