import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SharedModule } from '../sharedModule';
import { HomePageRoutingModule } from './home-routing.module';
import { SwiperModule } from 'swiper/angular';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,SwiperModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [HomePage]
})
export class HomePageModule {}
