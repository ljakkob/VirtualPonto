import { Settings } from './../../models/settings';
import _ from 'lodash';
import { UserModel } from './../../models/userModel';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';


@Injectable()
export class UserProvider {

  lastId: number;
  userLogged: UserModel;
  registeredUsers: Array<any>;

  constructor(public localStorageDb: Storage) {

    this.load('lastId').then(id => {
      this.lastId = id ? parseInt(id) : 0;
    });
    this.load('registeredUsers').then(users => {
      this.registeredUsers = _.mapKeys(users, 'login');
    });

  }


  // serviços do provider...
  registerUser = (data): Promise<Object> => {
    return new Promise((resolve, reject) => {
      this.lastId++;
      try {
        data.id = this.lastId;

        let newUser = this.builderUserModel(data);
        this.save('lastId', this.lastId);

        this.registeredUsers[newUser.login.toString()] = newUser;
        this.save('registeredUsers', this.registeredUsers);

        resolve({ msg: 'Para começar a usar é preciso completar seu cadastro, configurando seus horarios.', user: newUser });

      } catch (error) {
        reject(error);
      }

    });
  }

  login = (credentials): Promise<Object> => {
    return new Promise((resolve, reject) => {
      try {
        const fetchedUser = this.findByLogin(credentials.login);

        if (fetchedUser) {
          if (fetchedUser.password === credentials.password) {

            resolve({ msg: 'Usuario logado com sucesso', user: fetchedUser });
          } else {
            reject({ msg: 'Você informou uma senha errada, tente novamente.' });
          }
        } else {
          reject({ msg: 'Login não corresponde a nenhum usuario cadastrado.' });
        }

      } catch (error) {

      }
    })
  }

  logout = (): void => {
    this.save('logged', null);
  }

  saveSettings = (dataForm, user: UserModel): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        const settings = this.builderUserSettings(dataForm, user.id.valueOf());

        // após construir as configs, setar needSettings pra false assim o user pode passar
        // para tela de menu
        user.needSettings = false;
        user.settings = settings;

        // atualizando o usuario na lista de users cadastrado..
        this.registeredUsers[user.login.toString()] = user;
        this.save('registeredUsers', this.registeredUsers);

        resolve({ settings: settings });

      } catch (error) {
        reject(error);
      }

    });
  }


  // metodos utils para utilizar fora do provider
  public findByLogin = (login): any => {

    const fetchedUser = _.find(this.registeredUsers, user => {

      if (user.login === login) {
        return user;
      }
      return null;
    })

    return fetchedUser;
  }

  public setLoggedUser = (user): void => {
    this.userLogged = user;
    this.localStorageDb.set('logged', user);
  }

  public getLoggedUser = (): Promise<UserModel> => {
    return this.localStorageDb.get('logged');
  }

  public getTodayRegister = (key): Promise<any> => {
    return new Promise(resolve => {
      this.localStorageDb.get(key).then(users => {
        let registers = [];

        if (users) {
          registers = users[this.userLogged.login.toString()];
        }

        resolve(registers);
      });
    });
  }


  // metodos utils para utilizar somente dentro do provider

  private save = (key, value): void => {
    this.localStorageDb.set(key, value);
  }

  private load = (key): Promise<any> => {
    return this.localStorageDb.get(key);
  }

  private builderUserModel = (data): UserModel => {
    let user = new UserModel();

    user.id = data.id;
    user.completeName = data.completeName;
    user.email = data.email;
    user.login = data.login;
    user.password = data.password;
    user.needSettings = true;

    return user;
  }

  private builderUserSettings = (data: any, userId: number): Settings => {
    let settings = new Settings();
    settings.userId = userId;

    settings.workDayTime.hour = parseInt(data.workDayTime.split(':')[0]);
    settings.workDayTime.minute = parseInt(data.workDayTime.split(':')[1]);

    const { hour, minute } = settings.workDayTime;
    settings.workDayTime.allMinute = (60 * hour) + minute;

    settings.startTime.hour = parseInt(data.startTime.split(':')[0]);
    settings.startTime.minute = parseInt(data.startTime.split(':')[1]);

    settings.intervalTime.hour = parseInt(data.intervalTime.split(':')[0]);
    settings.intervalTime.minute = parseInt(data.intervalTime.split(':')[1]);

    settings.returnTime.hour = parseInt(data.returnTime.split(':')[0]);
    settings.returnTime.minute = parseInt(data.returnTime.split(':')[1]);

    settings.endTime.hour = parseInt(data.endTime.split(':')[0]);
    settings.endTime.minute = parseInt(data.endTime.split(':')[1]);

    settings.workDayTimeString = data.workDayTime;
    settings.startTimeString = data.startTime;
    settings.intervalTimeString = data.intervalTime;
    settings.returnTimeString = data.returnTime;
    settings.endTimeString = data.endTime;

    settings.startAlarm = data.startAlarm;
    settings.intervalAlarm = data.intervalAlarm;
    settings.returnAlarm = data.returnAlarm;
    settings.endAlarm = data.endAlarm;

    settings.alarmeAntecipatedIn = parseInt(data.alarmeAntecipatedIn || 0);
    return settings;
  }

}



