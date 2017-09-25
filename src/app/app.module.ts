import { AuthService } from './../providers/auth.service';
import { SignUpPage } from './../pages/sign-up/sign-up';
import { LoginPage } from './../pages/login/login';
import { CadastroPage } from './../pages/cadastro/cadastro';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HttpModule} from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AngularFireModule, FirebaseAppConfig} from 'angularfire2';
import {UserService} from '../providers/user.service';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyB__yF7y59e2SV_jQ51fTJDHkp17rJFbxY",
  authDomain: "virtualponto-b44f3.firebaseapp.com",
  databaseURL: "https://virtualponto-b44f3.firebaseio.com",
  storageBucket: "virtualponto-b44f3.appspot.com",
  messagingSenderId: "666798400851"}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    CadastroPage,
    LoginPage,
    SignUpPage

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    CadastroPage,
    LoginPage,
    SignUpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    AuthService
  ]
})
export class AppModule {}