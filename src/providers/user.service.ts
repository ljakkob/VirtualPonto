import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserService {

  users: FirebaseListObservable<User[]>;

  constructor(
    public http: Http,
    public af: AngularFire,
  ) {
    
    this.users = this.af.database.list(`/users`);
  }

  create(user: User):firebase.Promise<void>{

    return this.users
      .push(user);
  }

}
