import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersForUsPageRoutingModule } from './orders-for-us-routing.module';

import { OrdersForUsPage } from './orders-for-us.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersForUsPageRoutingModule
  ],
  declarations: [OrdersForUsPage]
})
export class OrdersForUsPageModule {}
