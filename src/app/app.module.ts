import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamescreenComponent } from './gamescreen/gamescreen.component';
import { TetrisComponent } from './tetris/tetris.component';
import { SnakeComponent } from './snake/snake.component';
import { IntroComponent } from './intro/intro.component';
import { LudoComponent } from './ludo/ludo.component';

@NgModule({
  declarations: [
    AppComponent,
    GamescreenComponent,
    TetrisComponent,
    SnakeComponent,
    IntroComponent,
    LudoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
