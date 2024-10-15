import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ArticleComponent } from "./article/article.component";
import { ArticlesComponent } from "./articles/articles.component";
import { WeeklyChessComponent } from "./weekly-chess/weekly-chess.component";
import { WeeklyChessesComponent } from "./weekly-chesses/weekly-chesses.component";

const routes: Routes = [
    {
        path:'',
        component: ArticlesComponent,
        pathMatch:'full'
    },
    {
        path:'weekly-chesses',
        component: WeeklyChessesComponent
    },
    {
        path:'weekly-chesses/:slug',
        component: WeeklyChessComponent
    },
    {
        path:':slug',
        component: ArticleComponent,
        pathMatch:'full'
    }
    
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogRoutingModule { }