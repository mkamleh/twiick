import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';


import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { SharedModule } from 'src/app/sharedModule';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OrderPageRoutingModule
  ],
  declarations: [OrderPage], providers: [LaunchNavigator]
})
export class OrderPageModule {}
