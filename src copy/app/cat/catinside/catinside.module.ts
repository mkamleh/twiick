import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatinsidePageRoutingModule } from './catinside-routing.module';

import { CatinsidePage } from './catinside.page';
import { CheckoutButtonComponent } from 'src/app/checkout-button/checkout-button.component';
import { SharedModule } from 'src/app/sharedModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatinsidePageRoutingModule,
    SharedModule
  ],
  declarations: [CatinsidePage]
})
export class CatinsidePageModule {}
