import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css'],
})
export class SnakeComponent {
  emptyTable: any[][] = [];
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.emptyTable = new Array(20)
      .fill(null)
      .map(() => new Array(50).fill(null));
    this.startGame();
  }

  snakeHead_X: number = -1;
  snakeHead_Y: number = 10;

  JUST_ATE: boolean = false;
  BITTEN: boolean = false;
  NEW_INTERVAL: boolean = false;

  snake_Head: number = 1;
  snake_Tail: number = 0;

  snake_length: number = 2;
  SNAKE_SPEED: number = 140;
  SCORE: number = 0;

  direction: string = 'ArrowRight';

  snakeCoords: number[][] = [];
  apples: number[][] = [];

  startGame() {
    this.moveSnake();
    this.apple();
    this.snakeCoords[0] = [0, 10];
    this.snakeCoords[1] = [1, 10];
  }

  apple() {
    const intervalId = setInterval(() => {
      let appleX = this.randomNumber(49, 0);
      let appleY = this.randomNumber(19, 0);

      while (true) {
        let x = 0;
        for (let i = 0; i < this.snake_length; i++) {
          if (
            appleX == this.snakeCoords[i][0] &&
            appleY == this.snakeCoords[i][1]
          ) {
            x = 1;
            console.log('haan');

            break;
          }
        }
        if (x == 1) {
          appleX = this.randomNumber(49, 0);
          appleY = this.randomNumber(19, 0);
        } else {
          break;
        }
      }
      this.apples.push([appleX, appleY]);

      const scoreEl = this.el.nativeElement.querySelector(
        `#b${appleX}_${appleY}`
      );
      this.renderer.removeClass(scoreEl, 'score-animation-class');
      this.renderer.addClass(scoreEl, 'apple');
    }, 3000);
  }

  moveSnake() {
    const intervalId = setInterval(() => {
      switch (this.direction) {
        case 'ArrowRight':
          this.snakeHead_X++;
          break;
        case 'ArrowLeft':
          this.snakeHead_X--;
          break;
        case 'ArrowDown':
          this.snakeHead_Y++;
          break;
        case 'ArrowUp':
          this.snakeHead_Y--;
          break;

        default:
          break;
      }
      if (
        this.snakeHead_X > 49 ||
        this.snakeHead_X < 0 ||
        this.snakeHead_Y > 19 ||
        this.snakeHead_Y < 0
      ) {
        clearInterval(intervalId);
      } else {
        //Self Bite Check
        for (let i = 1; i < this.snakeCoords.length; ++i) {
          if (
            this.snakeHead_X == this.snakeCoords[i][0] &&
            this.snakeHead_Y == this.snakeCoords[i][1]
          ) {
            this.BITTEN = true;
            break;
          }
        }

        if (this.BITTEN) {
          clearInterval(intervalId);
          this.lose();
        } else {
          this.snakeCoords.push([this.snakeHead_X, this.snakeHead_Y]);

          //Apple Check
          for (let i = 0; i < this.apples.length; ++i) {
            if (
              this.snakeHead_X == this.apples[i][0] &&
              this.snakeHead_Y == this.apples[i][1]
            ) {
              this.JUST_ATE = true;
              let x = this.apples[i];
              this.apples[i] = this.apples[0];
              this.apples[0] = x;
              this.apples.shift();

              this.SCORE++;
              if (this.SCORE % 2 == 0) {
                // this.SNAKE_SPEED -= 7;
                this.NEW_INTERVAL = true;
                this.speedIncAnim();
              }

              const scoreEl = this.el.nativeElement.querySelector(
                `#b${this.snakeHead_X}_${this.snakeHead_Y}`
              );
              this.renderer.removeClass(scoreEl, 'apple');

              break;
            }
          }

          if (!this.JUST_ATE) {
            this.cutTail();
            this.snake_length--;
          }
          this.snake_length++;
          this.JUST_ATE = false;
          // console.log(this.JUST_ATE);

          // for (let i = 0; i < this.snake_length; ++i) {
          this.colourCell(this.snakeHead_X, this.snakeHead_Y, '#40E0D0');
          // }
        }
      }
      if (this.NEW_INTERVAL) {
        clearInterval(intervalId);
        this.moveSnake();
      }
    }, this.SNAKE_SPEED);
  }

  speedIncAnim() {
    const element = this.el.nativeElement.querySelector('.speedup');
    this.renderer.addClass(element, 'speedupanim');
    setTimeout(() => {
      this.renderer.removeClass(element, 'speedupanim');
    }, 1000);
  }

  lose() {
    console.log('lost');
  }
  cutTail() {
    this.colourCell(
      this.snakeCoords[0][0],
      this.snakeCoords[0][1],
      'transparent'
    );
    this.snakeCoords.shift();
  }

  randomNumber(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  colourCell(x: number, y: number, color: string) {
    const element = this.el.nativeElement.querySelector(`#b${x}_${y}`);
    this.renderer.setStyle(element, 'background-color', color);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        if (this.direction != 'ArrowLeft') {
          this.direction = event.key;
        }
        break;
      case 'ArrowLeft':
        if (this.direction != 'ArrowRight') {
          this.direction = event.key;
        }
        break;
      case 'ArrowDown':
        if (this.direction != 'ArrowUp') {
          this.direction = event.key;
        }
        break;
      case 'ArrowUp':
        if (this.direction != 'ArrowDown') {
          this.direction = event.key;
        }
        break;
      case 'x':
      case 'X':
        this.JUST_ATE = true;
        break;
      case 'c':
        this.cutTail();
        break;
      default:
        break;
    }
  }
}
