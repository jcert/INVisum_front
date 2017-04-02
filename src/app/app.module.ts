import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Ionic2RatingModule } from '../../../ionic2-rating/src';
import { AuthHttp } from 'angular2-jwt';

import { MyApp } from './app.component';

import { InVisumWelcomePage } from '../pages/in-visum-welcome/in-visum-welcome';
import { InVisumLoginPage } from '../pages/in-visum-login/in-visum-login';
import { InVisumFAQPage } from '../pages/in-visum-faq/in-visum-faq';
import { InVisumLegalPage } from '../pages/in-visum-legal/in-visum-legal';
import { InVisumApiPage } from '../pages/in-visum-api/in-visum-api';
import { InVisumSignupPage } from '../pages/in-visum-signup/in-visum-signup';
import { InVisumProfilePage } from '../pages/in-visum-profile/in-visum-profile';
import { InVisumSearchPage } from '../pages/in-visum-search/in-visum-search';
import { InVisumSearchListPage } from '../pages/in-visum-search-list/in-visum-search-list';
import { InVisumSearchResultPage } from '../pages/in-visum-search-result/in-visum-search-result';
import { InVisumOperatePage } from '../pages/in-visum-operate/in-visum-operate';
import { InVisumConfigPlotPage } from '../pages/in-visum-config-plot/in-visum-config-plot';
import { PopupDisplayGraphPage } from '../pages/in-visum-config-plot/popup-display-graph';
import { PopupSelectPage } from '../pages/in-visum-operate/popup-select';
import { PopupSelectTypePage } from '../pages/in-visum-config-plot/popup-select-type';
import { PopupInsertTypePage } from '../pages/in-visum-config-plot/popup-insert-type';
import { PopupInsertPage } from '../pages/in-visum-operate/popup-insert';
import { PopupStringPage } from '../pages/in-visum-operate/popup-string';
import { ReputationIcon } from '../pages/reputation-icon/reputation-icon';

import { ApiTalker, getAuthHttp } from '../providers/api-talker';
import { SetSelect } from '../providers/set-select';
import { Settings } from '../providers/settings';
import { MakeOperation } from '../providers/make-operation';
import { PlotHelp } from '../providers/plot-help';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,
  InVisumWelcomePage,
  InVisumLoginPage,
  InVisumFAQPage,
  InVisumSearchPage,
  InVisumSearchResultPage,
  InVisumLegalPage,
  InVisumApiPage,
  InVisumSignupPage,
  InVisumProfilePage,
  InVisumSearchListPage,
  InVisumOperatePage,
  InVisumConfigPlotPage,
  ReputationIcon,
  PopupSelectPage,
  PopupSelectTypePage,
  PopupInsertPage,
  PopupInsertTypePage,
  PopupStringPage,
  
  PopupDisplayGraphPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    Storage,
    SetSelect,
    PlotHelp,
    ApiTalker,
    MakeOperation,
    {provide: AuthHttp,useFactory: getAuthHttp,deps: [Http]},
    { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
