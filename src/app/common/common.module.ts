import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerSliderComponent } from './banner-slider/banner-slider.component';
import { BlobEffectImageComponent } from './blob-effect-image/blob-effect-image.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { MenuCardComponent } from './menu-card/menu-card.component';
import { MoveLabelComponent } from './move-label/move-label.component';
import { MoveLabelListBoxComponent } from './move-label-list-box/move-label-list-box.component';
import { MoveSummaryBoxComponent } from './move-summary-box/move-summary-box.component';
import { MoveSummaryListBoxComponent } from './move-summary-list-box/move-summary-list-box.component';
import { MovesWithSideMoveComponent } from './moves-with-side-move/moves-with-side-move.component';
import { PageSectionComponent } from './page-section/page-section.component';
import { PostCardComponent } from './post-card/post-card.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { FaqItemsComponent } from './faq-items/faq-items.component';
import { JsonLdComponent } from './json-ld/json-ld.component';
import { LoaderComponent } from './loader/loader.component';
import { GameSummaryBoxComponent } from './game-summary-box/game-summary-box.component';
import { StudyComponent } from './study/study.component';
import { StaticBoardComponent } from './static-board/static-board.component';
import { MoveIndexMoveNumberPipe } from '../pipes/move-index-move-number.pipe';
import { PlayGroundComponent } from '../base/play-ground/play-ground.component';
import { MoveCommentPipe } from '../pipes/move-comment.pipe';
import { PgnPipe } from '../pipes/pgn.pipe';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { GameTypeFormatterPipe } from '../pipes/game-type-formatter.pipe';
import { YesNoPipe } from '../pipes/yes-no.pipe';
import { MoveCountPipe } from '../pipes/move-count.pipe';
import { DateYearPipe } from '../pipes/date-year.pipe';
import { CdnImagePipe } from '../pipes/cdn-image.pipe';
import { PrintMovesPipe } from '../pipes/print-moves.pipe';
import { BoardIdPipe } from '../pipes/board-id.pipe';
import { MovePercentPipe } from '../pipes/move-percent.pipe';
import { GetKeysPipe } from '../pipes/get-keys.pipe';
import { ParseEvalPipe } from '../pipes/parse-eval.pipe';
import { MatchMovePipe } from '../pipes/match-move.pipe';
import { PipesPipe } from '../pipes.pipe';
import { ShowNumberPipe } from '../pipes/show-number.pipe';
import { UrlSanitizerPipe } from '../pipes/url-sanitizer.pipe';
import { HostnamePipe } from '../pipes/hostname.pipe';
import { SlugifyPipe } from '../pipes/slugify.pipe';
import { Injector } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { postReducer } from '../rx/blogs';
import { PostEffect } from '../rx/blogs/blogs.effect';
import { GamesEffect } from '../rx/games/games.effect';
import { gameReducer } from '../rx/games';
import { PlayerEffect } from '../rx/players/players.effect';
import { playerReducer } from '../rx/players';
import { tournamentReducer } from '../rx/tournaments';
import { TournamentEffect } from '../rx/tournaments/tournaments.effect';
import { studyReducer } from '../rx/study';
import { StudyEffect } from '../rx/study/studies.effect';
import { FormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { gameCollectionReducer } from '../rx/collections';
import { GameCollectionEffect } from '../rx/collections/collections.effect';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import { ScullyLibModule } from '@scullyio/ng-lib';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatSortModule} from '@angular/material/sort';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { RouterModule } from '@angular/router';
import { MovecatPipe } from '../pipes/movecat.pipe';
import { PostCardLongComponent } from './post-card-long/post-card-long.component';
import { DatePipe } from '../pipes/date.pipe';
import { DecimalPipe } from '../pipes/decimal.pipe';
import { AuthorComponent } from './author/author.component';
import { PuzzleSetComponent } from './puzzle-set/puzzle-set.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { RatingFormComponent } from './rating-form/rating-form.component';
import { FeedbackButtonComponent } from './feedback-button/feedback-button.component';
import { RatingButtonComponent } from './rating-button/rating-button.component';
import { SubmitCommentComponent } from './submit-comment/submit-comment.component';
import { CommentsBoxComponent } from './comments-box/comments-box.component';
import { CommentComponent } from './comment/comment.component';
import { Base64Pipe } from '../pipes/base64.pipe';
import { GoogleChartsModule } from 'angular-google-charts';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CustomizeBoardComponent } from './customize-board/customize-board.component';
import { TrainingStartButtonComponent } from './training-start-button/training-start-button.component';
import { AdComponent } from './ad/ad.component';
import { AdsenseModule } from 'ng2-adsense';
import { SquareAdsComponent } from './square-ads/square-ads.component';
import { BannerAdsComponent } from './banner-ads/banner-ads.component';
import { GridAdsComponent } from './grid-ads/grid-ads.component';
import { WeaknessPipe } from '../pipes/weakness.pipe';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';
import { GoogleRegisterComponent } from './google-register/google-register.component';
import { AlertDialogeComponent } from './alert-dialoge/alert-dialoge.component';


const dbConfig: DBConfig  = {
  name: 'scriptDb',
  version: 2,
  objectStoresMeta:
  [
    {
    store: 'games',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema:
      [
        { name: 'pgn', keypath: 'name', options: { unique: false } },
        { name: 'white', keypath: 'white', options: { unique: false } },
        { name: 'black', keypath: 'black', options: { unique: false } },
        { name: 'eco', keypath: 'eco', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'result', keypath: 'result', options: { unique: false } },
        { name: 'moveCount', keypath: 'moveCount', options: { unique: false } },
      ]
    },
    {
      store: 'analysis',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema:
        [
          { name: 'pgn', keypath: 'name', options: { unique: false } },
          { name: 'moves', keypath: 'moves', options: { unique: false } },
          { name: 'eco', keypath: 'eco', options: { unique: false } },
          { name: 'date', keypath: 'date', options: { unique: false } },
        ]
    },
    {
      store: 'positionAnalysis',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema:
        [
          { name: 'fen', keypath: 'fen', options: { unique: true } },
          { name: 'eval', keypath: 'eval', options: { unique: false } },
        ]
    }
  ]
};
@NgModule({
  declarations: [
    BannerSliderComponent,
    BlobEffectImageComponent,
    FooterComponent,
    MenuComponent,
    MenuCardComponent,
    MoveLabelComponent,
    MoveLabelListBoxComponent,
    MoveSummaryBoxComponent,
    MoveSummaryListBoxComponent,
    MovesWithSideMoveComponent,
    PageSectionComponent,
    PostCardComponent,
    ChessBoardComponent,
    PuzzleComponent,
    FaqItemsComponent,
    JsonLdComponent,
    LoaderComponent,
    GameSummaryBoxComponent,
    StudyComponent,
    StaticBoardComponent,
    MoveIndexMoveNumberPipe,
    PlayGroundComponent,
    MoveCommentPipe,
    PgnPipe,
    CapitalizePipe,
    GameTypeFormatterPipe,
    YesNoPipe,
    MoveCountPipe,
    DateYearPipe,
    CdnImagePipe,
    PrintMovesPipe,
    BoardIdPipe,
    MovePercentPipe,
    GetKeysPipe,
    ParseEvalPipe,
    MatchMovePipe,
    PipesPipe,
    ShowNumberPipe,
    UrlSanitizerPipe,
    HostnamePipe,
    SlugifyPipe,
    MovecatPipe,
    PostCardLongComponent,
    DatePipe,
    AuthorComponent,
    PuzzleSetComponent,
    FeedbackFormComponent,
    RatingFormComponent,
    FeedbackButtonComponent,
    RatingButtonComponent,
    SubmitCommentComponent,
    CommentsBoxComponent,
    CommentComponent,
    Base64Pipe,
    ProgressBarComponent,
    CustomizeBoardComponent,
    TrainingStartButtonComponent,
    AdComponent,
    SquareAdsComponent,
    BannerAdsComponent,
    GridAdsComponent,
    DecimalPipe,
    WeaknessPipe,
    GoogleSignInComponent,
    GoogleRegisterComponent,
    AlertDialogeComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    HttpClientModule,
    MatAutocompleteModule,
    FormsModule,
    NgxJsonLdModule,
    MatSlideToggleModule,
    MatButtonModule,
    ScullyLibModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressBarModule,
    MatSortModule,
    MatMenuModule,
    MatRadioModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    MatCheckboxModule,
    ClipboardModule,
    RouterModule,
    AdsenseModule
  ],
  exports : [
    BannerSliderComponent,
    BlobEffectImageComponent,
    FooterComponent,
    MenuComponent,
    MenuCardComponent,
    MoveLabelComponent,
    MoveLabelListBoxComponent,
    MoveSummaryBoxComponent,
    MoveSummaryListBoxComponent,
    MovesWithSideMoveComponent,
    PageSectionComponent,
    PostCardComponent,
    ChessBoardComponent,
    PuzzleComponent,
    FaqItemsComponent,
    JsonLdComponent,
    LoaderComponent,
    GameSummaryBoxComponent,
    StudyComponent,
    StaticBoardComponent,
    MoveIndexMoveNumberPipe,
    PlayGroundComponent,
    MoveCommentPipe,
    PgnPipe,
    CapitalizePipe,
    GameTypeFormatterPipe,
    YesNoPipe,
    MoveCountPipe,
    DateYearPipe,
    CdnImagePipe,
    PrintMovesPipe,
    BoardIdPipe,
    MovePercentPipe,
    GetKeysPipe,
    ParseEvalPipe,
    MatchMovePipe,
    PipesPipe,
    ShowNumberPipe,
    UrlSanitizerPipe,
    HostnamePipe,
    SlugifyPipe,
    MovecatPipe,
    PostCardLongComponent,
    DatePipe,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    HttpClientModule,
    MatAutocompleteModule,
    FormsModule,
    NgxJsonLdModule,
    MatSlideToggleModule,
    MatButtonModule,
    ScullyLibModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressBarModule,
    MatSortModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    ClipboardModule,
    RouterModule,AuthorComponent,
    CommentComponent,
    SubmitCommentComponent,
    CommentsBoxComponent,
    PuzzleSetComponent,
    FeedbackFormComponent,
    RatingFormComponent,
    FeedbackButtonComponent,
    RatingButtonComponent,
    RatingFormComponent,
    Base64Pipe,
    GoogleChartsModule,
    ProgressBarComponent,
    TrainingStartButtonComponent,
    AdComponent,
    AdComponent,
    SquareAdsComponent,
    BannerAdsComponent,
    GridAdsComponent,
    DecimalPipe,
    WeaknessPipe,
    AlertDialogeComponent
  ]
})
export class BaseModule {

}
