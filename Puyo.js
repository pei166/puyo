const PUYO_SIZE = 10;
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

class Puyo {
  constructor(par = 0, child = 0, positionX, positionY) {
    this.axis = {
      color: par,
      posX: positionX,
      posY: positionY
    }

    this.sub = {
      color: child,
      posX: positionX,
      poY:  positionY + 1
    }
  }

  isLeft() {
    if (this.axis.posY === this.sub.posY && this.axis.posX > this.sub.posX) return true;
    return false;
  }

  isRight() {
    if (this.axis.posY === this.sub.posY && this.axis.posX < this.sub.posX) return true;
    return false;
  }

  isUnder() {
    if (this.axis.posX === this.sub.posX && this.axis.posY > this.sub.posY) return true;
    return false;
  }

  isAbove() {
    if (this.axis.posX === this.sub.posX && this.axis.posY < this.sub.posY) return true; return false;
  }
}

class Field {
  constructor(width, height, nextCount, puyoClass) {
    this.height = width;
    this.width = height;
    this.nextCount = nextCount;
    this.puyoClass = puyoClass;
  
    this.field = new Array(height);
    for (let y = 0; y < this.height; y++) {
      this.field[y] = new Array(this.width).fill(0);
    }

    this.puyo = new puyoClass();
    this.nextPuyo = new Array(this.nextCount);

    this.setPosition();
  }

  setPosition() {
    this.positionX = Math.floor(this.width / 2); 
    this.positionY = 1; 
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

   // this.initView();
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

let field = new Field(6, 13, 2, Puyo);
let view = new View(6, 13, 2, Puyo);

view.drawField();
//context.fillRect(5 * 10, 10 * 11, 10, 10);











