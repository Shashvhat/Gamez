import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css'],
})
export class TetrisComponent {
  emptyTable: any[][] = [];
  funcArray: any[][] = [];
  COLOURS: any[] = [
    'd',
    '#DFFF00',
    '#FFBF00',
    '#FF7F50',
    '#DE3163',
    '#9FE2BF',
    '#40E0D0',
    '#6495ED',
    '#CCCCFF',
  ];
  SHAPES: any[][] = [
    [[0, 0], [0, 1], [1, 0], [1, 1], 2, 2, 0, 0],

    [[0, 0], [0, 1], [0, 2], [0, 3], 4, 1, 0, 1],
    [[0, 0], [1, 0], [2, 0], [3, 0], 1, 4, 1, 1],

    [[0, 1], [1, 0], [1, 1], [1, 2], 3, 2, 0, 2],
    [[0, 0], [1, 0], [1, 1], [2, 0], 2, 3, 1, 2],
    [[0, 0], [0, 1], [0, 2], [1, 1], 3, 2, 2, 2],
    [[0, 1], [1, 0], [1, 1], [2, 1], 2, 3, 3, 2],

    [[0, 0], [1, 0], [1, 1], [1, 2], 3, 2, 0, 3], //l..
    [[0, 0], [0, 1], [1, 0], [2, 0], 2, 3, 1, 3], //l'
    [[0, 0], [0, 1], [0, 2], [1, 2], 3, 2, 2, 3], //'':
    [[0, 1], [1, 1], [2, 1], [2, 0], 2, 3, 3, 3], //.l

    [[0, 2], [1, 0], [1, 1], [1, 2], 3, 2, 0, 4], //..l
    [[0, 0], [2, 1], [1, 0], [2, 0], 2, 3, 1, 4], //l.
    [[0, 0], [0, 1], [0, 2], [1, 0], 3, 2, 2, 4], //:''
    [[0, 1], [1, 1], [0, 0], [2, 1], 2, 3, 3, 4], //'l

    [[0, 0], [0, 1], [1, 1], [1, 2], 3, 2, 0, 5],
    [[0, 1], [1, 1], [1, 0], [2, 0], 2, 3, 1, 5],

    [[0, 1], [0, 2], [1, 0], [1, 1], 3, 2, 0, 6],
    [[0, 0], [1, 0], [1, 1], [2, 1], 2, 3, 1, 6],
  ];

  horz: number = 4;
  randomShape: number = 0;
  randomColor: number = 0;
  Y_AXIS: number = 0;
  SPEED: number = 300;
  PEAK_HEIGHT: number = 19;
  currentBlockCoords: number[][] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.emptyTable = new Array(20)
      .fill(null)
      .map(() => new Array(10).fill(null));
    this.funcArray = new Array(21).fill(null).map(() => new Array(10).fill(0));
    for (let k = 0; k < 10; k++) {
      this.funcArray[20][k] = 1;
    }

    this.startGame();
  }

  startGame() {
    this.dropNewBlock();
  }

  lose() {
    console.log('lost');
  }

  dropNewBlock() {
    if (this.PEAK_HEIGHT == 0) {
      this.lose();
      return;
    }
    this.Y_AXIS = -1;
    this.horz = 4;
    this.randomShape = this.randomNumber(18, 0);
    this.randomColor = this.randomNumber(8, 1);
    this.dropBlock();
  }

  dropBlock() {
    const intervalId = setInterval(() => {
      this.Y_AXIS++;
      // console.log(this.PEAK_HEIGHT);

      for (let k = 0; k < 4; k++) {
        let r = this.SHAPES[this.randomShape][k];

        let Y =
          this.Y_AXIS - 1 < 0 ? this.Y_AXIS + r[0] : this.Y_AXIS - 1 + r[0];
        let X = r[1] + this.horz;

        this.colourCell(Y, X, '#1a1a1a');
      }
      for (let k = 0; k < 4; k++) {
        let r = this.SHAPES[this.randomShape][k];

        let Y = this.Y_AXIS + r[0];
        let X = r[1] + this.horz;

        this.colourCell(Y, X, this.COLOURS[this.randomColor]);

        this.currentBlockCoords[k] = [Y, X];
      }
      if (this.checkMove('Down')) {
        clearInterval(intervalId);
        setTimeout(() => {
          if (!this.saveBlock()) {
            this.dropBlock();
          }
        }, this.SPEED);
      }
      // console.log(this.currentBlockCoords);
    }, this.SPEED);
  }

  saveBlock() {
    console.log(this.funcArray);
    if (this.checkMove('Down')) {
      for (let k = 0; k < 4; k++) {
        this.funcArray[this.currentBlockCoords[k][0]][
          this.currentBlockCoords[k][1]
        ] = this.randomColor;
        const element = this.el.nativeElement.querySelector(
          `#b${this.currentBlockCoords[k][0]}_${this.currentBlockCoords[k][1]}`
        );
        // this.renderer.setStyle(element, 'background-color', color);
      }
      if (this.Y_AXIS < this.PEAK_HEIGHT) {
        this.PEAK_HEIGHT = this.Y_AXIS;
      }
      setTimeout(() => {
        this.dropNewBlock();
      }, 100);
      this.rowClear();
      return true;
    }
    return false;
  }

  rowClear() {
    // console.log(this.SHAPES[this.randomShape][5]);

    for (let k = this.SHAPES[this.randomShape][5] - 1; k >= 0; k--) {
      let clearThis = true;
      for (let j = 0; j < 10 && clearThis; j++) {
        if (this.isCoordEmpty(k + this.Y_AXIS, j)) {
          clearThis = false;
        }
      }

      if (clearThis) {
        for (let j = 0; j < 10; j++) {
          this.colourCell(k + this.Y_AXIS, j, '#1a1a1a');
          this.funcArray[k + this.Y_AXIS][j] = 0;
        }

        for (let j = k + this.Y_AXIS - 1; j >= this.PEAK_HEIGHT; j--) {
          for (let h = 0; h < 10; h++) {
            if (!this.isCoordEmpty(j, h)) {
              this.colourCell(j, h, '#1a1a1a');
              this.colourCell(j + 1, h, this.COLOURS[this.funcArray[j][h]]);
              this.funcArray[j + 1][h] = this.funcArray[j][h];
              this.funcArray[j][h] = 0;
            }
          }
        }
        ++k;
      }
    }
  }

  checkMove(direction: string) {
    switch (direction) {
      case 'Down':
        for (let k = 0; k < 4; k++) {
          if (
            !this.isCoordEmpty(
              this.currentBlockCoords[k][0] + 1,
              this.currentBlockCoords[k][1]
            )
          ) {
            return true;
          }
        }
        return false;
      case 'Right':
        for (let k = 0; k < 4; k++) {
          if (
            !this.isCoordEmpty(
              this.currentBlockCoords[k][0],
              this.currentBlockCoords[k][1] + 1
            )
          ) {
            return false;
          }
        }
        return true;
      case 'Left':
        for (let k = 0; k < 4; k++) {
          if (
            !this.isCoordEmpty(
              this.currentBlockCoords[k][0],
              this.currentBlockCoords[k][1] - 1
            )
          ) {
            return false;
          }
        }
        return true;
      default:
        return false;
    }
  }

  isCoordEmpty(a: number, b: number) {
    if (this.funcArray[a][b] == 0) {
      return true;
    }
    return false;
  }

  moveHorz(RorL: number) {
    for (let k = 0; k < 4; k++) {
      let r = this.SHAPES[this.randomShape][k];
      this.colourCell(
        this.Y_AXIS - 1 < 0 ? this.Y_AXIS + r[0] : this.Y_AXIS + r[0],
        r[1] + this.horz,
        '#1a1a1a'
      );
    }
    this.horz = this.horz + 1 * RorL;
    for (let k = 0; k < 4; k++) {
      let r = this.SHAPES[this.randomShape][k];
      let Y = this.Y_AXIS + r[0];
      let X = r[1] + this.horz;

      this.colourCell(Y, X, this.COLOURS[this.randomColor]);

      this.currentBlockCoords[k] = [Y, X];
    }
  }

  rotate() {
    let newShape = 0;

    switch (this.SHAPES[this.randomShape][7]) {
      case 1:
      case 5:
      case 6:
        newShape =
          this.randomShape + (this.SHAPES[this.randomShape][6] == 1 ? -1 : 1);
        break;
      case 2:
      case 3:
      case 4:
        newShape =
          this.randomShape + (this.SHAPES[this.randomShape][6] == 3 ? -3 : 1);
        break;
      default:
        break;
    }

    for (let k = 0; k < 4; k++) {
      let r = this.SHAPES[newShape][k];
      let Y = this.Y_AXIS + r[0];
      let X = r[1] + this.horz;
      if (!this.isCoordEmpty(Y, X)) {
        return;
      }
    }

    for (let k = 0; k < 4; k++) {
      let r = this.SHAPES[this.randomShape][k];
      this.colourCell(
        this.Y_AXIS - 1 < 0 ? this.Y_AXIS + r[0] : this.Y_AXIS + r[0],
        r[1] + this.horz,
        '#1a1a1a'
      );
    }
    this.randomShape = newShape;
    for (let k = 0; k < 4; k++) {
      let r = this.SHAPES[this.randomShape][k];
      let Y = this.Y_AXIS + r[0];
      let X = r[1] + this.horz;

      this.colourCell(Y, X, this.COLOURS[this.randomColor]);

      this.currentBlockCoords[k] = [Y, X];
    }
    // console.log(this.SHAPES[this.randomShape][5]);
  }

  randomNumber(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  colourCell(i: number, j: number, color: string) {
    const element = this.el.nativeElement.querySelector(`#b${i}_${j}`);
    this.renderer.setStyle(element, 'background-color', color);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'X':
      case 'x':
        this.rotate();
        break;
      case 'ArrowUp':
        console.log('Arrow Up key pressed');
        // Add your logic for Arrow Up key press here
        break;
      case 'ArrowDown':
        console.log('Arrow Down key pressed');
        // Add your logic for Arrow Down key press here
        break;
      case 'ArrowLeft':
        if (this.horz > 0 && this.checkMove('Left')) {
          this.moveHorz(-1);
        }
        break;
      case 'ArrowRight':
        if (
          this.horz + 1 + this.SHAPES[this.randomShape][4] < 11 &&
          this.checkMove('Right')
        ) {
          this.moveHorz(1);
        }
        break;
      default:
        break;
    }
  }
}