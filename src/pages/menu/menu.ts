import { RegisterProvider } from './../../providers/register/register';
import _ from 'lodash';
import { END, MONTHS_KEYS } from './../../models/employer-time-track';
import { LoginPage } from './../login/login';
import { UserProvider } from './../../providers/user/user';
import { ConfiguracaoPage } from './../configuracao/configuracao';
import { FolhaPontoPage } from './../folha-ponto/folha-ponto';
import { BancoHorasPage } from './../banco-horas/banco-horas';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  loggedName: String;
  todayRegister: any;
  today: String;
  weekDay: String;
  weekArray = new Array(7);

  constructor(
    public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public toast: ToastController, public loadCtrl: LoadingController, public alertCtrl: AlertController,
    public registerProvider: RegisterProvider
  ) {
    this.init();
  }

  goToBancoHoras() {
    this.navCtrl.push(BancoHorasPage);
  }

  goToFolhaPonto() {
    this.navCtrl.push(FolhaPontoPage);
  }

  goToConfiguracao() {
    this.userProvider.getLoggedUser().then(user => {
      this.navCtrl.push(ConfiguracaoPage, { user });
    });

  }

  logOut() {
    this.userProvider.logout();
    this.toast.create({
      message: 'Ok, te esperamos em breve. :)',
      duration: 4000
    }).present()

    this.navCtrl.setRoot(LoginPage);
  }

  registerPoint() {

    const datePoint = new Date();
    const loading = this.loadCtrl.create({
      content: "Registrando..."
    });


    if (this.todayRegister && this.todayRegister.status === END) {
      this.toast.create({
        message: "Você já registrou todos os horarios de hoje. Vá para casa descansar!",
        duration: 4000
      }).present();
      return;
    }

    this.alertCtrl.create({
      title: 'Registrar Ponto',
      subTitle: `Você irá registrar o ponto de ${this.todayRegister ? this.todayRegister.nextStatus : 'Entrada'} ás ${datePoint.toLocaleTimeString()}`,
      message: 'Está Correto?',
      buttons: [{
        text: 'SIM',
        handler: () => {
          loading.present();

          this.registerProvider.registerPoint(datePoint,this.userProvider.userLogged)
            .then(success => {

              this.todayRegister = success.register;
              loading.dismiss();
              this.toast.create({
                message: "Ponto registrado",
                duration: 4000
              }).present();

            }, fail => {

              loading.dismiss();
              this.toast.create({
                message: "Você já registrou todos os horarios de hoje.",
                duration: 4000
              }).present();

            });
        }
      }, {
        text: 'NÃO',
        role: 'cancel'
      }]
    }).present();


  }


  private init(): void {
    let d = new Date();
    let loading = this.loadCtrl.create({
      content: 'Carregando Dados...'
    });
    loading.present();

    // inicializando array com nomes dos dias da semana
    this.today = d.toLocaleDateString();
    this.weekArray[0] = "Domingo";
    this.weekArray[1] = "Segunda-Feira";
    this.weekArray[2] = "Terça-Feira";
    this.weekArray[3] = "Quarta-Feira";
    this.weekArray[4] = "Quinta-Feira";
    this.weekArray[5] = "Sexta-Feira";
    this.weekArray[6] = "Sabado";

    // pegando o dia da semana referente a data de hoje
    this.weekDay = this.weekArray[d.getDay()];

    this.userProvider.getLoggedUser().then(user => {
      this.userProvider.userLogged = user;
      this.loggedName = user.login;
      this.userProvider.getTodayRegister(MONTHS_KEYS[d.getMonth()]).then(registers => {

        this.todayRegister = _.find(registers, (point) => {
          return point.datePointString === this.today;
        });

        loading.dismiss();
      });

    });
  }
}
