import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponentModule } from '../search-component/search-component.module';
import { ArticleComponent } from './article/article.component';
import { ArticlesComponent } from './articles/articles.component';
import { WeeklyChessComponent } from './weekly-chess/weekly-chess.component';
import { WeeklyChessesComponent } from './weekly-chesses/weekly-chesses.component';
import { BlogRoutingModule } from './blog.router';
import { WeeklyChessCardComponent } from './weekly-chess-card/weekly-chess-card.component';
import { BaseModule } from '../common/common.module';



@NgModule({
  declarations: [
    ArticleComponent,
    ArticlesComponent,
    WeeklyChessComponent,
    WeeklyChessesComponent,
    WeeklyChessCardComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    BaseModule
  ]
})
export class BlogModule { }
