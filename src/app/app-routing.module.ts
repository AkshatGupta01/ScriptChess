import { CustomizeBoardComponent } from './common/customize-board/customize-board.component';
import { NgModule, Component } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { PlayGroundComponent } from './base/play-ground/play-ground.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { PageViewerComponent } from './pages/page-viewer/page-viewer.component';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { GoogleRegisterComponent } from './common/google-register/google-register.component';
import { RegisterComponent } from './pages/register/register.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { AccountComponent } from './pages/account/account.component';
const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'play-ground',
    component: PlayGroundComponent
  },
  {
    path:'sitemap',
    component: SitemapComponent
  },
  {
    path:'pages/about-scripchess',
    component: AboutComponent
  },

  {
    path:'pages/contact-us',
    component: ContactUsComponent
  },
  {
    path:'pages/:slug',
    component: PageViewerComponent
  },
  {
    path:'tools',
    loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule)
  },
  {
    path:'articles',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
  }
  ,
  {
    path:'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  }
  ,
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'account',
    component:AccountComponent
  }
  ,
  {
    path:'sign-in',
    component:SignInComponent
  },{
    path:'reset-password',
    component:UpdatePasswordComponent
  },
  {
    path:'customize-board',
    component : CustomizeBoardComponent
  },
  {
    path:'**',
    component : RedirectComponent
  }

];
const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  // ...any other options you'd like to use
}

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
