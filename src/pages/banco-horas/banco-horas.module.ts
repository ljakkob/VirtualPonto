import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BancoHorasPage } from './banco-horas';

@NgModule({
  declarations: [
    BancoHorasPage,
  ],
  imports: [
    IonicPageModule.forChild(BancoHorasPage),
  ],
})
export class BancoHorasPageModule {}
