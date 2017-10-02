import { ConfiguracaoPage } from './../configuracao/configuracao';
import { UserProvider } from './../../providers/user/user';
import { CadastroPage } from './../cadastro/cadastro';
import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  submitted: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public fb: FormBuilder, public toast: ToastController, public loadCtrl: LoadingController) {

    this.loginForm = fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  doLogin() {
    this.submitted = true;

    const loading = this.loadCtrl.create({
      content: "Aguarde..."
    });

    loading.present();

    if (this.loginForm.valid) {

      this.userProvider.login(this.loginForm.value)
        .then((success: any) => {
          loading.dismiss();

          if (success.user.needSettings) {
            this.toast.create({
              duration: 3500,
              message: "Complete seu cadastro e comece a utilizar o app."
            }).present();
            this.navCtrl.setRoot(ConfiguracaoPage, { 'user': success.user });

          } else {
            this.userProvider.setLoggedUser(success.user);
            this.toast.create({
              duration: 4000,
              message: success.msg
            }).present();
            this.navCtrl.setRoot(MenuPage);
          }


        }, (fail: any) => {

          loading.dismiss();

          this.toast.create({
            duration: 4000,
            message: fail.msg

          }).present();
        });


    } else {

      loading.dismiss();

    }

  }

  toCadastro() {
    this.navCtrl.push(CadastroPage);
  }

}
