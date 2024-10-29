import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from 'src/shared/material.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

import { ToolbarLandingComponent } from './Public/components/toolbar-landing/toolbar-landing.component';
import { FooterComponent } from './Public/components/footer/footer.component';
import { LandingPageComponent } from './Public/components/landing-page/landing-page.component';
import { PageNotFoundComponent } from './Public/components/page-not-found/page-not-found.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";

import { LanguageSelectionComponent } from "./Public/components/language-selection/language-selection.component";

import { CalendarModule, DateAdapter} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonModule } from '@angular/common';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ToolbarLandingComponent,
    FooterComponent,
    LandingPageComponent,
    PageNotFoundComponent,
    LanguageSelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en', loader: {
        provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient]
      }
    }),
    RouterModule,
    MatDatepickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
