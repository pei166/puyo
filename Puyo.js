const PUYO_SIZE = 10;
const FIELD_HEIGHT = 13;
const FIELD_WIDTH = 6;
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

const STATE = {
  UNDER: 0,
  ABOVE: 1,
  LEFT: 2,
  RIGHT: 3
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
  
    this.field = new Array(height);
    for (let y = 0; y < this.height; y++) {
      this.field[y] = new Array(this.width).fill(0);
    }

    this.setPosition();

    this.puyo = new puyoClass(TYPE.RED, TYPE.RED, this.positionX, this.positionY);

  }

  setPosition() {
    this.positionX = Math.floor(this.width / 2) - 1; 
    this.positionY = 0; 
  }

  getPuyo(x, y) {
    return field[y][x];
  }

}

class View {
  constructor(width, height, nextCount, puyoClass) {
    this.height = height; 
    this.width = width;
    this.nextCount = nextCount;
    this.puyoClass = puyoClass;
  }

  drawPuyo(field) {
    let axisPosX = field.positionX * PUYO_SIZE;
    let axisPosY = field.positionY * PUYO_SIZE;
    let subPosX = axisPosX;
    let subPosY = axisPosY + PUYO_SIZE;
    context.fillStyle = "red";
    context.fillRect(subPosX, subPosY, PUYO_SIZE, PUYO_SIZE);
    context.fillRect(axisPosX, axisPosY, PUYO_SIZE, PUYO_SIZE);
  }

  drawField() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let px = x * PUYO_SIZE;
        let py = y * PUYO_SIZE;
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
}

let game = new Game(FIELD_WIDTH, FIELD_HEIGHT, NEXT_COUNT, Puyo);
game.view.drawField(game.field);
game.view.drawPuyo(game.field);




