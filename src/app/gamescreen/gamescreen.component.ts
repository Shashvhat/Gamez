import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css'],
})
export class GamescreenComponent {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // setTimeout(() => {
    //   const ele = this.el.nativeElement.querySelector(`#introid`);
    //   // this.renderer.addClass(ele, 'introcom');
    // }, 400);
  }

  goToGame(gameName: string) {
    const transition_to_game = this.el.nativeElement.querySelector(
      `#${gameName}btn`
    );
    this.renderer.addClass(transition_to_game, 'transition_to_game');
    setTimeout(() => {
      this.router.navigate([gameName]);
    }, 400);
  }
}
