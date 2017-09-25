import { UserService } from './../../providers/user.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



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
    public navParams: NavParams,
    public UserService: UserService

  ) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({

      name:['',[Validators.required, Validators.minLength(3)]],
      username:['',[Validators.required, Validators.minLength(3)]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      email: ['',Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
    }

    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  onSubmit(): void {
    console.log(this.signupForm.value);
    this.UserService.create(this.signupForm.value)
    .then(() =>{

      console.log('usuário Cadastrado');
    }

    );
  }
}
