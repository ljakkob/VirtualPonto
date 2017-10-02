import { Storage } from '@ionic/storage';
import { LoginPage } from './../pages/login/login';
import { MenuPage } from './../pages/menu/menu';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public localStorageBd: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      localStorageBd.get('logged').then(logged => {

        if (logged) {
          this.rootPage = MenuPage;
        } else {
          this.rootPage = LoginPage;
        }

        statusBar.styleDefault();
        splashScreen.hide();
      });
    });
  }
}

