import { FormGroup } from '@angular/forms';

export class PasswordValidator {

    static match(formGroup: FormGroup): any {

        const fg = formGroup.root;


        if (!fg.get('confirmation') || (fg.get('password') && fg.get('password').value === '')) {
            return null;
        }

        if (fg.get('confirmation').value === '') {
            return null;
        }

        const password = fg.get('password').value;
        const confirmation = fg.get('confirmation').value;

        if (password !== confirmation) {
            return {
                "passwordMismatch": true
            }
        }

        return null;
    }
}