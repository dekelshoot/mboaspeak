import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/start/start.component';
import { NavComponent } from './layouts/nav/nav.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StatComponent } from './layouts/stat/stat.component';

import { AboutComponent } from './components/about/about.component';
import { AppsComponent } from './components/apps/apps.component';
import { AuthService } from './services/auth.service';
import { DashComponent } from './components/dashboard/dash/dash.component';
import { WordComponent } from './components/dashboard/word/word.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { AdminComponent } from './components/dashboard/admin/admin.component';
import { DictionaryComponent } from './components/feeds/dictionary/dictionary.component';
import { ExpressionComponent } from './components/dashboard/expression/expression.component';
import { CommonPhraseComponent } from './components/feeds/common-phrase/common-phrase.component';
import { PostComponent } from './components/dashboard/post/post.component';
import { ForumComponent } from './components/forum/forum.component';
import { LearningSpaceComponent } from './components/learning-space/learning-space.component';
import { LearningComponent } from './components/dashboard/learning/learning.component';


import { ModuleWithProviders } from '@angular/core';
import { provideTranslateService } from "@ngx-translate/core";

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';




@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AppsComponent,
    NavComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,

    StatComponent,
    AboutComponent,
    AppsComponent,
    DashComponent,
    WordComponent,
    ProfileComponent,
    AdminComponent,
    DictionaryComponent,
    ExpressionComponent,
    CommonPhraseComponent,
    PostComponent,
    ForumComponent,
    LearningSpaceComponent,
    LearningComponent,



  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  providers: [AuthService,

    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
