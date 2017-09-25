import { UserService } from './../../providers/user.service';
import { User } from './../../models/user.model';
import { FirebaseListObservable } from 'angularfire2';
import { SignUpPage } from './../sign-up/sign-up';
import { Component, NgModule } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 

  users: FirebaseListObservable<User[]>;
  constructor(public navCtrl: NavController, public UserService: UserService) {

  }

 onSignUp(): void {

  this.navCtrl.push(SignUpPage)
 }
 
 ionViewDidLoad(){
  
  this.users = this.UserService.users;

 }

 onChatCreate(user: User): void {
   console.log('User: ', user)
 }
 } 
 
 
 



