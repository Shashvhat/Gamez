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

  snake_Head: number = 1;
  snake_Tail: number = 0;

  snake_length: number = 2;

  direction: string = 'ArrowRight';

  snakeCoords: number[][] = [];

  startGame() {
    this.moveSnake();
    this.snakeCoords[0] = [0, 10];
    this.snakeCoords[1] = [1, 10];
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
        console.log(this.snakeCoords[0], this.snakeCoords[1]);

        this.snakeCoords.push([this.snakeHead_X, this.snakeHead_Y]);

        if (!this.JUST_ATE) {
          this.cutTail();
        }
        this.JUST_ATE = false;
        console.log(this.JUST_ATE);

        // for (let i = 0; i < this.snake_length; ++i) {
        this.colourCell(this.snakeHead_X, this.snakeHead_Y, '#40E0D0');
        // }
        this.snake_Tail++;
        this.snake_Head++;
      }
    }, 400);
  }

  cutTail() {
    this.colourCell(this.snakeCoords[0][0], this.snakeCoords[0][1], '#1a1a1a');
    this.snakeCoords.shift();
  }

  colourCell(x: number, y: number, color: string) {
    const element = this.el.nativeElement.querySelector(`#b${x}_${y}`);
    this.renderer.setStyle(element, 'background-color', color);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowDown':
      case 'ArrowUp':
        this.direction = event.key;
        break;
      case 'x':
      case 'X':
        this.JUST_ATE = true;
        this.snake_length++;
        break;
      case 'c':
        this.cutTail();
        break;
      default:
        break;
    }
  }
}
