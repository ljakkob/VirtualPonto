import { UserModel } from './../../models/userModel';
import _ from 'lodash';
import { STATUS_LIST } from './../../models/employer-time-track';
import { Settings } from './../../models/settings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MenuPage } from './../menu/menu';
import { UserProvider } from './../../providers/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-configuracao',
  templateUrl: 'configuracao.html',
})
export class ConfiguracaoPage {
  userAuthenticated: UserModel;
  userLoggedSetting: Settings;
  submitted: Boolean;
  configForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder,
    public userProvider: UserProvider, public localNotification: LocalNotifications, public plat: Platform) {

    this.userAuthenticated = this.navParams.get('user');
    this.userLoggedSetting = this.userAuthenticated.settings;

    this.configForm = fb.group({
      workDayTime: [this.userLoggedSetting ? this.userLoggedSetting.workDayTimeString : '', Validators.required],
      startTime: [this.userLoggedSetting ? this.userLoggedSetting.startTimeString : '', Validators.required],
      intervalTime: [this.userLoggedSetting ? this.userLoggedSetting.intervalTimeString : '', Validators.required],
      returnTime: [this.userLoggedSetting ? this.userLoggedSetting.returnTimeString : '', Validators.required],
      endTime: [this.userLoggedSetting ? this.userLoggedSetting.endTimeString : '', Validators.required],
      startAlarm: [this.userLoggedSetting ? this.userLoggedSetting.startAlarm : false],
      intervalAlarm: [this.userLoggedSetting ? this.userLoggedSetting.intervalAlarm : false],
      returnAlarm: [this.userLoggedSetting ? this.userLoggedSetting.returnAlarm : false],
      endAlarm: [this.userLoggedSetting ? this.userLoggedSetting.endAlarm : false],
      alarmeAntecipatedIn: [this.userLoggedSetting ? this.userLoggedSetting.alarmeAntecipatedIn : 0]
    });

    plat.ready().then(rdy => {
      this.localNotification.on('trigger', (notification, state) => {
        this.afterTriggerUpdateNotification(JSON.parse(notification.data));
      });

    });

  }

  saveConfig() {
    this.submitted = true;

    if (this.configForm.invalid) {
      return;
    }

    this.userProvider.saveSettings(this.configForm.value, this.userAuthenticated)
      .then(success => {
        this.userProvider.setLoggedUser(this.userAuthenticated);
        this.schedulerNotification(success.settings);
        this.navCtrl.setRoot(MenuPage);

      }, fail => {
        //tratar fail se cair aqui...
        console.log(fail);
      });

  }

  public schedulerNotification(settings: Settings): void {
    let notifyFor = [];

    if (settings.startAlarm)
      notifyFor.push({ id: 1, for: settings.startTime });

    if (settings.intervalAlarm)
      notifyFor.push({ id: 2, for: settings.intervalTime });

    if (settings.returnAlarm)
      notifyFor.push({ id: 3, for: settings.returnTime });

    if (settings.endAlarm)
      notifyFor.push({ id: 4, for: settings.endTime });


    _.forEach(notifyFor, (value) => {
      let dateAt = new Date();

      if (dateAt.getHours() >= value.for.hour && dateAt.getMinutes() >= value.for.minute) {
        dateAt.setDate(dateAt.getDate() + 1);
      }

      value.for = this.calculateTime(value.for, settings);
      dateAt.setHours(value.for.hour, value.for.minute, 0);

      this.localNotification.isScheduled(value.id).then(isSchedule => {

        if (!isSchedule) {
          console.log(`Notificacao agendada para ${value.for.hour}:${value.for.minute}`);
          this.localNotification.schedule({
            id: value.id,
            at: new Date(dateAt.getTime()),
            title: 'Virtual Ponto avisa:',
            text: `Não Perca o horario: Ponto de ${STATUS_LIST[value.id]}`,
            data: { id: value.id, for: value.for, settings: settings }
          });

          console.log(`Agendou a Notificação : ${STATUS_LIST[value.id]} para: ${dateAt.toLocaleDateString()} ${dateAt.toLocaleTimeString()}`)
        } else {
          this.localNotification.update({
            id: value.id,
            at: new Date(dateAt.getTime()),
            title: 'Virtual Ponto avisa:',
            text: `Não Perca o horario: Ponto de ${STATUS_LIST[value.id]}`,
            data: { id: value.id, for: value.for, settings: settings }
          });

          console.log(`Atualizou a Notificação : ${STATUS_LIST[value.id]} para: ${dateAt.toLocaleDateString()} ${dateAt.toLocaleTimeString()}`)
        }
      })

    });

  }

  public afterTriggerUpdateNotification(value): void {
    let dateAt = new Date();
    dateAt.setDate(dateAt.getDate()+1);

    const time = this.calculateTime(value.for, value.settings);
    dateAt.setHours(time.hour, time.minute, 0);
    console.log(`${dateAt.toLocaleDateString()}:${dateAt.toLocaleTimeString()} valores de hora : ${value.for} , subtraindo tempo:${time}`);

    this.localNotification.schedule({
      id: value.id,
      at: new Date(dateAt.getTime()),
      title: 'Virtual Ponto avisa:',
      text: `Não Perca o horario: Ponto de ${STATUS_LIST[value.id]}`,
      data: { id: value.id, for: value.for, settings: value.settings }
    });

    console.log(`Reagendou a Notificação : ${STATUS_LIST[value.id]} para: ${dateAt.toLocaleDateString()} ${dateAt.toLocaleTimeString()}`)
  }

  private calculateTime(timeValue: any, settings: Settings): any {
    const totalTimeInMinute = (60 * timeValue.hour) + timeValue.minute - settings.alarmeAntecipatedIn;
    const resultTime = {
      hour: totalTimeInMinute / 60,
      minute: totalTimeInMinute % 60
    }

    return resultTime;
  }
}
