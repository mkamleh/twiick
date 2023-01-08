import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { SharedModule } from './sharedModule';
import { environment } from 'src/environments/environment';
import {AngularFireModule} from '@angular/fire'
import {AngularFireStorageModule} from '@angular/fire/storage'
import { AngularFireAuthModule } from '@angular/fire/auth';
  import { from } from 'rxjs';
import { CheckoutButtonComponent } from './checkout-button/checkout-button.component';
import { CheckoutButtonArabicComponent } from './checkout-cart/checkout-button-arabic/checkout-button-arabic.component';
import { ConfirmCheckoutComponent } from './checkout-cart/confirm-checkout/confirm-checkout.component';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

import "firebase/auth";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [   FormsModule,
    SharedModule,BrowserModule, IonicModule.forRoot(), HttpClientModule,ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireStorageModule, AngularFireAuthModule, AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
