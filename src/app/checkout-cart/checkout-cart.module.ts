import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutCartPageRoutingModule } from './checkout-cart-routing.module';

import { CheckoutCartPage } from './checkout-cart.page';
import { ConfirmCheckoutComponent } from './confirm-checkout/confirm-checkout.component';
import { SharedModule } from '../sharedModule';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CheckoutCartPageRoutingModule,
    SharedModule
  ],
  declarations: [CheckoutCartPage,ConfirmCheckoutComponent]
})
export class CheckoutCartPageModule {}
