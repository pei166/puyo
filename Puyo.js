const PUYO_SIZE = 10;
const FIELD_HEIGHT = 15;
const FIELD_WIDTH = 8;
const NEXT_COUNT = 2;

var context = document.querySelector("canvas").getContext("2d"); 

const TYPE = {
  NONE:   0,
  RED:    1,
  BLUE:   2,
  YELLOW: 3,
  GREEN:  4,
  OJAMA:  5,
  WALL:   6
}

const COLOR = [
  "gray",
  "red",
  "blue",
  "yellow",
  "green",
  "",
  "black"
]

const LOCATE = {
  UNDER: 0,
  ABOVE: 1,
  LEFT: 2,
  RIGHT: 3
} 

const KEY = {
  MOVE_LEFT: 65,
  MOVE_RIGHT: 68,
  DOWN: 83,
  TURN_LEFT: 74,
  TURN_RIGHT: 75
}

class Puyo {
  constructor(axis = 0, sub = 0) {
    this.axis = axis;
    this.sub = sub;
  
  }
}

class Field {
  constructor(width, height, nextCount, puyoClass) {
    this.height = height 
    this.width = width;
    this.nextCount = nextCount;
    this.puyoClass = puyoClass;
    this.locate = LOCATE.ABOVE;
    this.initField();
    this.setPosition();
    this.puyo = new puyoClass(TYPE.RED, TYPE.RED, this.positionX, this.positionY);

  }

  initField() {
    this.field = new Array(this.height);
    for (let y = 0; y < this.height; y++) {
      this.field[y] = new Array(this.width).fill(0);
    }

    for (let y = 0; y < this.height; y++) {
      this.field[y][0] = TYPE.WALL; 
      this.field[y][this.width - 1] = TYPE.WALL;
    }

    for (let x = 0; x < this.width; x++) {
      this.field[this.height - 1][x] = TYPE.WALL;
    }
  }

  setPosition() {
    this.positionX = Math.floor(this.width / 2) - 1; 
    this.positionY = 2; 
  }

  getAxisPos() {
    let x = this.positionX;
    let y = this.positionY;
    return [x, y];
  }

  getSubPos() {
    let x = this.positionX, y = this.positionY;
    if (this.locate === LOCATE.UNDER) {
      x = this.positionX;
      y = this.positionY + 1;
    }
    if (this.locate === LOCATE.ABOVE) {
      x = this.positionX;
      y = this.positionY - 1;
    }
    if (this.locate === LOCATE.RIGHT) {
      x = this.positionX + 1;
      y = this.positionY;
    }
    if (this.locate === LOCATE.LEFT) {
      x = this.positionX - 1;
      y = this.positionY;
    }
    return [x, y];
  }

  canMove(x, y) {
    let [axisX, axisY] = this.getAxisPos();
    let [subX, subY ] = this.getSubPos();
    if (this.getPuyo(axisX + x, axisY + y)) return false;
    if (this.getPuyo(subX + x, subY + y)) return false;
    
    return true;
  }

  canRightTurn() {
    let [subX, subY] = this.getSubPos();
    if (this.locate === LOCATE.UNDER) {
      if (this.getPuyo(subX - 1, subY) || this.getPuyo(subX - 1, subY - 1)) {
        return false;
      }
    }
    if (this.locate === LOCATE.LEFT) {
      if (this.getPuyo(subX, subY - 1) || this.getPuyo(subX + 1, subY - 1)) {
        return false;
      }
    }
    if (this.locate === LOCATE.ABOVE) {
      if (this.getPuyo(subX + 1, subY) || this.getPuyo(subX + 1, subY + 1)) {
        return false;
      }
    }
    if (this.locate === LOCATE.RIGHT) {
      if (this.getPuyo(subX, subY + 1) || this.getPuyo(subX - 1, subY + 1)) {
        return false;
      }
    }
    return true;
  }

  canLeftTurn() {
    let [subX, subY] = this.getSubPos();
    if (this.locate === LOCATE.UNDER) {
      if (this.getPuyo(subX + 1, subY) || this.getPuyo(subX + 1, subY - 1)) {
        return false;
      }
    }
    if (this.locate === LOCATE.LEFT) {
      if (this.getPuyo(subX, subY + 1) || this.getPuyo(subX + 1, subY + 1)) {
        return false;
      }
    }
    if (this.locate === LOCATE.ABOVE) {
      if (this.getPuyo(subX - 1, subY) || this.getPuyo(subX - 1, subY + 1)) {
        return false;
      }
    }
    if (this.locate === LOCATE.RIGHT) {
      if (this.getPuyo(subX, subY - 1) || this.getPuyo(subX - 1, subY - 1)) {
        return false;
      }
    }
    return true;
  }

  moveRight() {
    if (this.canMove(1, 0)) this.positionX += 1;
  }

  moveLeft() {
    if (this.canMove(-1, 0)) this.positionX -= 1;
  }

  down() {
    if (this.canMove(0, 1)) this.positionY += 1;
    else this.fixPuyo(puyo);
  }

  turnRight() {
    if (!this.canRightTurn()) return;
    if (this.locate === LOCATE.UNDER) {
      this.locate = LOCATE.LEFT;
    } else if (this.locate === LOCATE.LEFT) {
      this.locate = LOCATE.ABOVE;
    } else if (this.locate === LOCATE.ABOVE) {
      this.locate = LOCATE.RIGHT;
    } else {
      this.locate = LOCATE.UNDER;
    }
  }

  turnLeft() {
    if (!this.canLeftTurn()) return;
    if (this.locate === LOCATE.UNDER) {
      this.locate = LOCATE.RIGHT;
    } else if (this.locate === LOCATE.LEFT) {
      this.locate = LOCATE.UNDER;
    } else if (this.locate === LOCATE.ABOVE) {
      this.locate = LOCATE.LEFT;
    } else {
      this.locate = LOCATE.ABOVE;
    }
  }
  
  fixPuyo(puyo) {
    let [axisX, axisY] = this.getAxisPos();
    let [subX, subY] = this.getSubPos();
    this.field[axisY][axisX] = puyo.axis;
    this.field[subY][subX] = puyo.sub;
  }

  getPuyo(x, y) {
    return this.field[y][x];
  }

  setPuyo(x, y, type) { 
    this.field[y][x] = type;
  } 
}

class View {
  constructor(width, height, nextCount, puyoClass) {
    this.height = height; 
    this.width = width;
    this.nextCount = nextCount;
    this.puyoClass = puyoClass;
  }

  drawPuyo(_field) {
    let [axisPosX, axisPosY] = _field.getAxisPos();
    axisPosX *= PUYO_SIZE;
    axisPosY *= PUYO_SIZE;
    let [subPosX, subPosY] = _field.getSubPos();
    subPosX *= PUYO_SIZE;
    subPosY *= PUYO_SIZE;
    context.fillStyle = "red";
    context.fillRect(subPosX, subPosY, PUYO_SIZE, PUYO_SIZE);
    context.fillRect(axisPosX, axisPosY, PUYO_SIZE, PUYO_SIZE);
  }

  drawField(_field) {
    context.fillStyle = "black";
    context.clearRect(0, 0, 60, 130);

    for (let y = 1; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let px = x * PUYO_SIZE;
        let py = y * PUYO_SIZE;
        context.fillStyle = COLOR[_field.getPuyo(x, y)];
        context.fillRect(px, py, PUYO_SIZE, PUYO_SIZE);
      }
    }
  }
}


class Game {
  constructor(width, height, nextCount, puyoClass) {
    this.field = new Field(width, height, nextCount, puyoClass);
    this.view = new View(width, height, nextCount, puyoClass);
    this.puyo = new Puyo(1, 1);
  }

  main() {
    this.view.drawField(this.field);
    this.view.drawPuyo(this.field);
  }
}

let game = new Game(FIELD_WIDTH, FIELD_HEIGHT, NEXT_COUNT, Puyo);

game.view.drawField(game.field);
game.view.drawPuyo(game.field);

document.onkeydown = function(e) {
  switch(e.keyCode) {
    case KEY.MOVE_LEFT:
      game.field.moveLeft();
      game.main();
      console.log(game.field.getSubPos());
      break;
    case KEY.MOVE_RIGHT:
      game.field.moveRight();
      game.main();
      console.log(game.field.getSubPos());
      break;
    case KEY.DOWN:
      game.field.down();
      game.main();
      console.log(game.field.getSubPos());
      break;
    case KEY.TURN_LEFT:
      game.field.turnLeft();
      game.main();
      console.log(game.field.getSubPos());
      break;
    case KEY.TURN_RIGHT:
      game.field.turnRight();
      game.main();
      console.log(game.field.getSubPos());
      break;
  }
}





