import {NgModule} from "@angular/core";
import { CheckoutButtonComponent } from './checkout-button/checkout-button.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { CheckoutButtonArabicComponent } from './checkout-cart/checkout-button-arabic/checkout-button-arabic.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './LocationMap/pickers/location-picker/location-picker.component';
import { MapModalComponent } from './LocationMap/pickers/map-modal/map-modal.component';
import { CountDownTimerComponent } from './count-down-timer/count-down-timer.component';


@NgModule({
  imports:[RouterModule,CommonModule,
    IonicModule,FormsModule],
    declarations: [ CountDownTimerComponent, CheckoutButtonComponent,LocationPickerComponent, MapModalComponent, MenuComponent, CheckoutButtonArabicComponent ],
    exports: [CountDownTimerComponent, CheckoutButtonComponent,MenuComponent,CheckoutButtonArabicComponent ,LocationPickerComponent, MapModalComponent],
    entryComponents: [MapModalComponent]

})
export class SharedModule {}
