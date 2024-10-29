import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Public/components/landing-page/landing-page.component';
import { PageNotFoundComponent } from "./Public/components/page-not-found/page-not-found.component";

const routes: Routes = [
  {path: 'landing-page', component: LandingPageComponent},
  {path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes, {
        useHash: true,
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
