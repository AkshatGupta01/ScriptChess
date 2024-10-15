import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseModule } from './common/common.module';
import { GameSummaryBoxComponent } from './common/game-summary-box/game-summary-box.component';
import { StaticBoardComponent } from './common/static-board/static-board.component';
import { StudyComponent } from './common/study/study.component';
import { HomeComponent } from './pages/home/home.component';
import { PageViewerComponent } from './pages/page-viewer/page-viewer.component';
import { postReducer } from './rx/blogs';
import { PostEffect } from './rx/blogs/blogs.effect';
import { gameCollectionReducer } from './rx/collections';
import { GameCollectionEffect } from './rx/collections/collections.effect';
import { gameReducer } from './rx/games';
import { GamesEffect } from './rx/games/games.effect';
import { playerReducer } from './rx/players';
import { PlayerEffect } from './rx/players/players.effect';
import { studyReducer } from './rx/study';
import { StudyEffect } from './rx/study/studies.effect';
import { tournamentReducer } from './rx/tournaments';
import { TournamentEffect } from './rx/tournaments/tournaments.effect';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { NoMatchComponent } from './pages/no-match/no-match.component';
import { AboutComponent } from './pages/about/about.component';
import { PuzzleSetComponent } from './common/puzzle-set/puzzle-set.component';
import { feedbackReducer } from './rx/feedback';
import { GoogleChartsModule } from 'angular-google-charts';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { trainingReducer } from './rx/training/training.reducer';
import { AdsenseModule } from 'ng2-adsense';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { RegisterComponent } from './pages/register/register.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { TrainingEffect } from './rx/training/training.effect';
import { AccountComponent } from './pages/account/account.component';
import { PieceOnSquarePipe } from './pipes/piece-on-square.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageViewerComponent,
    RedirectComponent,
    NoMatchComponent,
    AboutComponent,
    SitemapComponent,
    ContactUsComponent,
    RegisterComponent,
    SignInComponent,
    UpdatePasswordComponent,
    AccountComponent,
    PieceOnSquarePipe
  ],
  imports: [
    AdsenseModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    BaseModule,
    AppRoutingModule,
    GoogleChartsModule,
    StoreModule.forRoot([]),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('posts', postReducer),
    StoreModule.forFeature('feedback', feedbackReducer),
    StoreModule.forFeature('training', trainingReducer),
    EffectsModule.forFeature([TrainingEffect]),
    EffectsModule.forFeature([PostEffect]),
    StoreModule.forFeature('games', gameReducer),
    EffectsModule.forFeature([GamesEffect]),
    StoreModule.forFeature('players', playerReducer),
    EffectsModule.forFeature([PlayerEffect]),
    StoreModule.forFeature('tournaments', tournamentReducer),
    EffectsModule.forFeature([TournamentEffect]),
    StoreModule.forFeature('studies', studyReducer),
    EffectsModule.forFeature([StudyEffect]),
    StoreModule.forFeature('gameCollections', gameCollectionReducer),
    EffectsModule.forFeature([GameCollectionEffect]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector : Injector) {
    let components = [
      {
        tag: 'game-summary',
        component: GameSummaryBoxComponent
      },
      {
        tag: 'study-chess',
        component: StudyComponent
      },
      {
        tag: 'static-board',
        component: StaticBoardComponent
      },
      {
        tag: 'puzzle-set',
        component: PuzzleSetComponent
      }
    ]

    components.forEach( c=> {
      let el = createCustomElement(c.component, {injector})
      customElements.define(c.tag, el)
    })
  }

}
