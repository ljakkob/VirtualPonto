
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CadastroPageModule } from './../pages/cadastro/cadastro.module';
import { LoginPageModule } from './../pages/login/login.module';
import { ConfiguracaoPageModule } from './../pages/configuracao/configuracao.module';
import { FolhaPontoPageModule } from './../pages/folha-ponto/folha-ponto.module';
import { BancoHorasPageModule } from './../pages/banco-horas/banco-horas.module';
import { MenuPageModule } from './../pages/menu/menu.module';



import { MyApp } from './app.component';
import { UserProvider } from '../providers/user/user';
import { RegisterProvider } from '../providers/register/register';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__virtualponto',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    MenuPageModule,
    BancoHorasPageModule,
    FolhaPontoPageModule,
    ConfiguracaoPageModule,
    LoginPageModule,
    CadastroPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    RegisterProvider,
    LocalNotifications
  ]
})
export class AppModule { }
