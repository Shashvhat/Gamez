import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.startIntro();
  }

  COLOURS: any[] = [
    '#ff0000',
    '#ffa500',
    '#ffff00',
    '#5ce600',
    '#00c7fe',
    '#ff00ff',
  ];

  DONE: number[] = [];
  FONTS: any[] = [
    'Ubuntu',
    'Shrikhand',
    'Press Start 2P',
    'Pinyon Script',
    'Orange Juice',
    'Monoton',
    'Amatic SC',
    'Lilita One',
  ];

  NAME: string = 'Shashvat Rawat';
  NGIF: boolean = true;

  startIntro() {
    setTimeout(() => {
      this.gotoGameScreen();
    }, 13000);

    const intervalId = setInterval(() => {
      this.flickerAnim(this.randomNumber(5, 1), 100);

      if (this.DONE.length == 5) {
        clearInterval(intervalId);
        setTimeout(() => {
          this.redBlueEff();
        }, 3000);
      }
    }, 300);
  }

  redBlueEff() {
    const element = this.el.nativeElement.querySelector(`.rawat`);
    this.renderer.addClass(element, `spis`);
    const intervalId = setInterval(() => {
      this.renderer.addClass(element, `spisanim`);
      setTimeout(() => {
        this.renderer.removeClass(element, `spisanim`);
      }, 500);
    }, 700);

    // const element2 = this.el.nativeElement.querySelector(`.rawat`);
    // this.renderer.addClass(element2, `spir`);
  }

  flickerAnim(num: number, duration: number) {
    if (this.DONE.includes(num)) {
      this.flickerAnim(this.randomNumber(5, 1), duration);
      console.log(this.DONE);
    } else {
      this.DONE.push(num);
      this.flickerAnimChar(num);
    }
  }

  flickerAnimChar(num: number) {
    const element = this.el.nativeElement.querySelector(`#char${num}`);
    this.renderer.setStyle(element, 'opacity', '100%');
    setTimeout(() => {
      this.renderer.setStyle(element, 'opacity', '0%');
    }, 30);
    setTimeout(() => {
      this.renderer.setStyle(element, 'opacity', '70%');
    }, 100);
    setTimeout(() => {
      this.renderer.setStyle(element, 'opacity', '0%');
    }, 130);
    setTimeout(() => {
      this.renderer.setStyle(element, 'opacity', '100%');
    }, 330);
  }

  changeFont() {
    const element = this.el.nativeElement.querySelector(`#my`);

    const intervalId = setInterval(() => {
      let rcol = this.randomNumber(5, 0);
      let rfon = this.randomNumber(7, 0);
      this.renderer.setStyle(element, 'color', this.COLOURS[rcol]);
      this.renderer.setStyle(
        element,
        'font-family',
        `${this.FONTS[rfon]}, sans-serif`
      );
      this.NAME = this.FONTS[rfon];

      // this.NGIF = false;
      setTimeout(() => {
        // this.NGIF = true;
      }, 1);
    }, 2000);
  }

  displayFont(font_name: string, duration: number, color: string) {
    setTimeout(() => {
      const element = this.el.nativeElement.querySelector(`#my`);
      this.renderer.setStyle(element, 'color', color);
      this.renderer.setStyle(element, 'font-family', font_name);
    }, duration);
  }

  gotoGameScreen() {
    this.router.navigate(['app-gamescreen']);
  }

  randomNumber(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
