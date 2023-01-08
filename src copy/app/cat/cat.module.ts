import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatPageRoutingModule } from './cat-routing.module';

import { CatPage } from './cat.page';
import { CheckoutButtonComponent } from '../checkout-button/checkout-button.component';
import { SharedModule } from '../sharedModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatPageRoutingModule,
    SharedModule

  ],
  declarations: [CatPage]
})
export class CatPageModule {}
