import { MONTHS_KEYS } from './../../models/employer-time-track';
import { UserProvider } from './../../providers/user/user';
import { RegisterProvider } from './../../providers/register/register';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the FolhaPontoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-folha-ponto',
  templateUrl: 'folha-ponto.html',
})
export class FolhaPontoPage {
  monthsList = MONTHS_KEYS;
  loginUser: string;
  actualMonth: string;
  registers: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController,
    public registerProvider: RegisterProvider, public userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    this.init();
  }


  updateDataInfo(): void {
    const load = this.loadCtrl.create({
      content: "Aguarde..."
    });
    load.present();
    
    this.registerProvider.getMonthRegisterOfUser(this.actualMonth, this.loginUser)
      .then(registers => {
        this.registers = registers;
        load.dismiss();
      });
  }


  private init(): void {
    const load = this.loadCtrl.create({
      content: "Aguarde..."
    });
    load.present();

    this.actualMonth = MONTHS_KEYS[new Date().getMonth()];

    this.userProvider.getLoggedUser().then(user => {
      this.userProvider.userLogged = user;
      this.loginUser = user.login.toString();

      this.registerProvider.getMonthRegisterOfUser(this.actualMonth, this.loginUser)
        .then(registers => {
          this.registers = registers;
          load.dismiss();
        });
    })
  }
}
