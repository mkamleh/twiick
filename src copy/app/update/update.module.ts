import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePageRoutingModule } from './update-routing.module';

import { UpdatePage } from './update.page';
import { SharedModule } from 'src/app/sharedModule';
import { ModalPageComponent } from './modal-page/modal-page.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [UpdatePage,ModalPageComponent]
})
export class UpdatePageModule {}
