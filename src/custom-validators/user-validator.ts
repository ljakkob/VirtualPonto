import { UserProvider } from './../providers/user/user';
import { FormControl } from '@angular/forms';

export class UserValidator {
    static userProvider: UserProvider;

    constructor(userProvider: UserProvider) {
        UserValidator.userProvider = userProvider;
    }

    userAlreadyExist(formControl: FormControl) {
        let user = UserValidator.userProvider.findByLogin(formControl.value);

        if (user) {
            return {
                'exists': true
            }
        }

        return null;
    }
}