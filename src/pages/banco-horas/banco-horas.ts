import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { RegisterProvider } from './../../providers/register/register';
import { UserProvider } from './../../providers/user/user';
import { MONTHS_KEYS } from './../../models/employer-time-track';

/**
 * Generated class for the BancoHorasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-banco-horas',
  templateUrl: 'banco-horas.html',
})
export class BancoHorasPage {

  dataBaseTimeInfo: any;
  monthsSelectBox: any;
  actualMonth: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public registerProvider: RegisterProvider, public loadCtrl: LoadingController) {

    this.monthsSelectBox = MONTHS_KEYS;
    this.actualMonth = MONTHS_KEYS[new Date().getMonth()];

  }

  ionViewDidLoad() {
    this.init();
  }

  backMenu(): void {
    this.navCtrl.pop();
  }

  changeMonthDataTimeInfo(): void {
    const load = this.loadCtrl.create({
      content: 'Carregando...'
    });

    load.present();

    this.registerProvider.getRegisterFromDatebaseTime(this.actualMonth, this.userProvider.userLogged.login.toString())
      .then(registers => {
        this.dataBaseTimeInfo = registers;
        load.dismiss();
      });

  }


  private init(): void {
    const load = this.loadCtrl.create({
      content: 'Carregando...'
    });

    load.present();
    this.userProvider.getLoggedUser().then(user => {
      this.userProvider.userLogged = user;

      const subKey = user.login.toString();

      this.registerProvider.getRegisterFromDatebaseTime(this.actualMonth, subKey).then(result => {
        this.dataBaseTimeInfo = result;
        load.dismiss();
      });
    });
  }

}
