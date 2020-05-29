const PUYO_SIZE = 10;
const FIELD_HEIGHT = 14;
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
    this.positionY = 0; 
    this.state = LOCATE.UNDER;
  }

  moveRight() {
    this.positionX += 1;
  }

  moveLeft() {
    this.positionX -= 1;
  }

  down() {
    this.positionY += 1;
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
    let axisPosX = _field.positionX * PUYO_SIZE;
    let axisPosY = _field.positionY * PUYO_SIZE;
    let subPosX = axisPosX;
    let subPosY = axisPosY + PUYO_SIZE;
    context.fillStyle = "red";
    context.fillRect(subPosX, subPosY, PUYO_SIZE, PUYO_SIZE);
    context.fillRect(axisPosX, axisPosY, PUYO_SIZE, PUYO_SIZE);
  }

  drawField(_field) {
    context.fillStyle = "black";
    context.clearRect(0, 0, 60, 130);

    for (let y = 0; y < this.height; y++) {
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
      break;
    case KEY.MOVE_RIGHT:
      game.field.moveRight();
      game.main();
      break;
    case KEY.DOWN:
      game.field.down();
      game.main();
      break;
  }
}





