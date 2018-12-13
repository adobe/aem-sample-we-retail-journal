import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { AemPageDataResolver, AemPageRouteReuseStrategy } from "@adobe/cq-angular-editable-components";
import { MainContentComponent } from "./components/main-content/main-content.component";

export function AemPageMatcher(url: UrlSegment[]): UrlMatchResult {
  if (url.length) {
    return (
      {
        consumed: url,
        posParams: {
          path: url[url.length - 1]
        }
      }
    );
  }
}

const routes: Routes = [
  {
    matcher: AemPageMatcher,
    component: MainContentComponent,
    resolve: {
      path: AemPageDataResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AemPageDataResolver, {
    provide: RouteReuseStrategy,
    useClass: AemPageRouteReuseStrategy
  }]
})

export class AppRoutingModule {}
