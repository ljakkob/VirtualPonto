import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth.service';
import { UserService } from './../../providers/user.service';
import { Component } from '@angular/core';
import 'rxjs/add/operator/first'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseAuthState } from 'angularfire2';



@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  signupForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public AuthService: AuthService

  ) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({

      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
    }

    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  onSubmit(): void {


    let loading: Loading = this.showLoading();
    let formUser: User = this.signupForm.value;
    let username: string = formUser.username;
    this.UserService.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {

        if (!userExists) {
          this.AuthService.creatAuthUser({
            email: formUser.email,
            password: formUser.password

          }).then((authState: FirebaseAuthState) => {

            delete formUser.password;
            formUser.uid = authState.auth.uid;

            this.UserService.create(formUser)
              .then(() => {

                console.log('usuário Cadastrado');
                loading.dismiss();
              }).catch((error: any) => {
                console.log(error);
                loading.dismiss();
                this.showAlert(error);

              });
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);

          });
        } else {

          this.showAlert(`O username' ${username} já está sendo usado em outra conta`);
          loading.dismiss();
        }

      })

  }

  private showLoading(): Loading {

    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }

}
