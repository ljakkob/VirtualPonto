import { Settings } from './settings';
export class UserModel {

    id: Number;
    completeName: String;
    email: String;
    login: String;
    password: String;
    settings: Settings;
    needSettings:Boolean;


    constructor() {
        
    }
}

export default UserModel;