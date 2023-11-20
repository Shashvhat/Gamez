import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-ludo',
  templateUrl: './ludo.component.html',
  styleUrls: ['./ludo.component.css'],
})
export class LudoComponent {
  emptyTable: any[][] = [];
  OPENING_TILES: any[] = [
    [6, 1],
    [1, 8],
    [13, 6],
    [8, 13],
  ];
  MAKE_BOARD: any[] = [
    [0, 0, 'red'],
    [0, 9, 'blue'],
    [9, 0, 'green'],
    [9, 9, 'yellow'],
  ];
  g: any[] = [
    [0, 0],
    [3, 0],
    [3, 3],
    [0, 3],
  ];
  W_TILES: any[] = [];
  PIECE_POS: any = [
    ['red', 1, 1, 'WBishop.png'],
    ['blue', 1, 10, 'WQueen.png'],
    ['green', 10, 1, 'WKnight.png'],
    ['yellow', 10, 10, 'WRook.png'],
  ];
  red_pieces: any[] = [];
  blue_pieces: any[] = [];
  green_pieces: any[] = [];
  yellow_pieces: any[] = [];
  DICE_NUM: number = 0;
  CHANCE_ORDER: any[] = ['red', 'blue', 'yellow', 'green'];
  CHANCE: string = 'red';

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.emptyTable = new Array(15)
      .fill(null)
      .map(() => new Array(15).fill(null));
    setTimeout(() => {
      this.makeBoard();
    }, 10);
  }

  startGame() {}

  diceRoll() {
    this.DICE_NUM = this.randomNumber(6, 1);
  }

  makeBoard() {
    for (let k = 0; k < 4; k++) {
      for (let i = this.MAKE_BOARD[k][0]; i < this.MAKE_BOARD[k][0] + 6; i++) {
        for (
          let j = this.MAKE_BOARD[k][1];
          j < this.MAKE_BOARD[k][1] + 6;
          j++
        ) {
          this.colourCell(i, j, this.MAKE_BOARD[k][2]);
        }
      }
    }

    for (let i = 6; i < 9; i++) {
      for (let j = 0; j < 6; j++) {
        this.colourCell(i, j, 'white');
        this.colourCell(j, i, 'white');
      }
    }
    for (let i = 6; i < 9; i++) {
      for (let j = 9; j < 15; j++) {
        this.colourCell(i, j, 'white');
        this.colourCell(j, i, 'white');
      }
    }

    for (let j = 1; j < 6; j++) {
      this.colourCell(7, j, this.MAKE_BOARD[0][2]);
      this.colourCell(j, 7, this.MAKE_BOARD[1][2]);
      this.colourCell(7, j + 8, this.MAKE_BOARD[3][2]);
      this.colourCell(j + 8, 7, this.MAKE_BOARD[2][2]);
    }
    for (let j = 0; j < 4; j++) {
      this.colourCell(
        this.OPENING_TILES[j][0],
        this.OPENING_TILES[j][1],
        this.MAKE_BOARD[j][2]
      );
    }

    for (let j = 0; j < 6; j++) {
      this.W_TILES.push([6, j]);
    }
    for (let j = 5; j > -1; j--) {
      this.W_TILES.push([j, 6]);
    }
    this.W_TILES.push([0, 7]);

    for (let j = 0; j < 6; j++) {
      this.W_TILES.push([j, 8]);
    }
    for (let j = 9; j < 15; j++) {
      this.W_TILES.push([6, j]);
    }
    this.W_TILES.push([7, 14]);

    for (let j = 14; j > 8; j--) {
      this.W_TILES.push([8, j]);
    }
    for (let j = 9; j < 15; j++) {
      this.W_TILES.push([j, 8]);
    }
    this.W_TILES.push([14, 7]);
    for (let j = 14; j > 8; j--) {
      this.W_TILES.push([j, 6]);
    }
    for (let j = 5; j > -1; j--) {
      this.W_TILES.push([8, j]);
    }
    this.W_TILES.push([7, 0]);

    for (let i = 0; i < 4; i++) {
      const x = this.PIECE_POS[i][3];
      const y = this.PIECE_POS[i][1];
      const z = this.PIECE_POS[i][2];

      this.setimg(x, y, z);
      this.setimg(x, y + 3, z);
      this.setimg(x, y + 3, z + 3);
      this.setimg(x, y, z + 3);
    }
    for (let i = 1; i < 5; i++) {
      this.red_pieces.push([this.g[i - 1][0] + 1, this.g[i - 1][1] + 1]);
      this.blue_pieces.push([this.g[i - 1][0] + 1, this.g[i - 1][1] + 10]);
      this.green_pieces.push([this.g[i - 1][0] + 10, this.g[i - 1][1] + 1]);
      this.yellow_pieces.push([this.g[i - 1][0] + 10, this.g[i - 1][1] + 10]);
    }
    console.log(this.red_pieces);
    console.log(this.blue_pieces);
    console.log(this.green_pieces);
    console.log(this.yellow_pieces);
  }

  move() {
    let i = 0,
      prev: number[] = [],
      next: number[] = [];
    const intervalId = setInterval(() => {
      let y = this.W_TILES[i][0],
        x = this.W_TILES[i][1],
        transx = '',
        transy = '';
      if (prev.length != 0) {
        let element = this.el.nativeElement.querySelector(
          `#b${prev[0]}_${prev[1]}`
        );
        this.renderer.removeStyle(element, 'transform');
        this.setimg('trans.png', prev[0], prev[1]);
        this.setimg('WRook.png', y, x);
      }

      let element = this.el.nativeElement.querySelector(`#b${y}_${x}`);

      ++i;
      if (this.W_TILES.length == i) {
        i = 0;
      }

      next = [this.W_TILES[i][0], this.W_TILES[i][1]];

      transx = x == next[1] ? '' : x < next[1] ? '+' : '-';
      transy = y == next[0] ? '' : y < next[0] ? '+' : '-';

      if (transy != '' && transx != '') {
        this.renderer.setStyle(
          element,
          'transform',
          `translateX(${transx}40px) translateY(${transy}40px)`
        );
      } else if (transx != '') {
        this.renderer.setStyle(
          element,
          'transform',
          `translateX(${transx}40px)`
        );
      } else if (transy != '') {
        this.renderer.setStyle(
          element,
          'transform',
          `translateY(${transy}40px)`
        );
      }

      prev = [y, x];
    }, 400);
  }

  setimg(imgname: string, pos_y: number, pos_x: number) {
    const element = this.el.nativeElement.querySelector(`#b${pos_y}_${pos_x}`);
    element.src = `../../assets/${imgname}`;
  }

  randomNumber(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  colourCell(i: number, j: number, color: string) {
    const element1 = this.el.nativeElement.querySelector(`#b${i}_${j}`);
    element1.src = `../../assets/trans.png`;
    const element = this.el.nativeElement.querySelector(`#a${i}_${j}`);
    if (color == 'white') {
      this.renderer.setStyle(
        element,
        'box-shadow',
        `inset 1px 1px 0px black,
      inset -1px -1px 0px black`
      );
      return;
    }
    this.renderer.setStyle(element, 'background-color', color);
  }
}
