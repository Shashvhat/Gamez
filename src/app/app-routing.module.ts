import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TetrisComponent } from './tetris/tetris.component';
import { GamescreenComponent } from './gamescreen/gamescreen.component';
import { SnakeComponent } from './snake/snake.component';
import { IntroComponent } from './intro/intro.component';
import { LudoComponent } from './ludo/ludo.component';

const routes: Routes = [
  { path: 'ludogame', component: LudoComponent },
  { path: 'tetrisgame', component: TetrisComponent },
  { path: 'snakegame', component: SnakeComponent },
  { path: 'app-gamescreen', component: GamescreenComponent },
  { path: 'intro-screen', component: IntroComponent },
  { path: '', redirectTo: 'app-gamescreen', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
