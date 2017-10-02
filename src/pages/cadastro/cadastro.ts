import { ConfiguracaoPage } from './../configuracao/configuracao';
import { UserValidator } from './../../custom-validators/user-validator';
import { UserProvider } from './../../providers/user/user';
import { PasswordValidator } from './../../custom-validators/password-validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the CadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  userValidator: UserValidator;
  registerForm: FormGroup;
  submitted: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder,
    public toast: ToastController, public loadingCtrl: LoadingController, public userProvider: UserProvider) {

    this.userValidator = new UserValidator(userProvider);

    this.registerForm = fb.group({
      completeName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      login: ['', Validators.compose([Validators.required, this.userValidator.userAlreadyExist])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmation: ['', Validators.compose([Validators.required, PasswordValidator.match])]
    });
  }

  register() {
    this.submitted = true;

    if (this.registerForm.valid) {

      const loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });

      loading.present();

      this.userProvider.registerUser(this.registerForm.value)
        .then((success: any) => {
          loading.dismiss();
          this.toast.create({
            duration: 6000,
            message: success.msg
          }).present();

          this.navCtrl.setRoot(ConfiguracaoPage, { 'user': success.user });
        }, (fail: any) => {
          loading.dismiss();

          this.toast.create({
            duration: 5000,
            message: fail.msg
          }).present();

        });
    } else {
      this.registerForm.patchValue({
        password: '',
        confirmation: ''
      });
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
