import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from "./components/main-content/main-content.component";

import { environment } from '../../src/environments/environment';

const CONTEXT_PATH = environment.CONTEXT_PATH;

const routes: Routes = [
    {
      path: CONTEXT_PATH + 'content/we-retail-journal/angular/blog.html',
      component: MainContentComponent,
      data: {
        path: '/' + CONTEXT_PATH + 'content/we-retail-journal/angular/blog'
      }
    },
    {
      path: CONTEXT_PATH +'content/we-retail-journal/angular/blog/aboutus.html',
      component: MainContentComponent,
      data: {
        path: '/' + CONTEXT_PATH + 'content/we-retail-journal/angular/blog/aboutus'
      }
    },
    {
      path: CONTEXT_PATH +'content/we-retail-journal/angular/blog/weather.html',
      component: MainContentComponent,
      data: {
        path: '/' + CONTEXT_PATH + 'content/we-retail-journal/angular/blog/weather'
      }
    },
    {
      path: CONTEXT_PATH +'content/we-retail-journal/angular/home.html',
      component: MainContentComponent,
      data: {
        path: '/' + CONTEXT_PATH + 'content/we-retail-journal/angular/home'
      }
    },
    {
      path: CONTEXT_PATH +'content/we-retail-journal/angular.html',
      redirectTo: '/' + CONTEXT_PATH + 'content/we-retail-journal/angular/home.html'
    },
    {
      path: '',
      redirectTo: '/' + CONTEXT_PATH + 'content/we-retail-journal/angular.html',
      pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(
      routes
    )],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
