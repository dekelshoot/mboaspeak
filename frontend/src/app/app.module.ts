import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/start/start.component';
import { NavComponent } from './layouts/nav/nav.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MentorComponent } from './components/dashboard-mentor/mentor/mentor.component';
import { MenteeComponent } from './components/dashboard-mentee/mentee/mentee.component';
import { StatComponent } from './layouts/stat/stat.component';
import { SessionMenteeComponent } from './components/dashboard-mentee/session-mentee/session-mentee.component';
import { SessionMentorComponent } from './components/dashboard-mentor/session-mentor/session-mentor.component';
import { AddSessionMentorComponent } from './components/dashboard-mentor/add-session-mentor/add-session-mentor.component';
import { RessourceComponent } from './components/dashboard-mentor/ressource/ressource.component';
import { RessourceMenteeComponent } from './components/dashboard-mentee/ressource-mentee/ressource-mentee.component';
import { EvaluationMenteeComponent } from './components/dashboard-mentee/evaluation-mentee/evaluation-mentee.component';
import { EvaluationMentorComponent } from './components/dashboard-mentor/evaluation-mentor/evaluation-mentor.component';
import { StatMenteeComponent } from './layouts/stat-mentee/stat-mentee.component';
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

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    AppsComponent,
    NavComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    MentorComponent,
    MenteeComponent,
    StatComponent,
    SessionMenteeComponent,
    SessionMentorComponent,
    AddSessionMentorComponent,
    RessourceComponent,
    RessourceMenteeComponent,
    EvaluationMenteeComponent,
    EvaluationMentorComponent,
    StatMenteeComponent,
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




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
