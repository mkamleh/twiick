import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/checkout-cart/shopping-cart.service';
import { Product } from 'src/app/product.model';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuServiceService } from 'src/app/menu-service.service';
import { PlaceLocation } from 'src/app/LocationMap/location.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MapModalComponent } from 'src/app/LocationMap/pickers/map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';
import { runInThisContext } from 'vm';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

export interface shoppingCart {
  cartId: string;
  userId: string;
  status : string;
  completedOn : string;
  product: Product []
  userIdWithStatus: string;
  orderTime : string
  location : PlaceLocation
  statusForUs : string;
  customerName: string;
  customerNumber: number;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  myOrder: any;
  form: FormGroup ;
  locationAvaialble = false;
  loadingIsDone= false;
  completedOnBeforeSplit: string;



  orderId: string;
  statusBothLangugue: string;
  products: Product[];
  orderTotal:number;
  doneLoading: boolean = false;
  langugue: boolean;
  orderLocation: PlaceLocation;

  sub = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });

  constructor(private launchNavigator: LaunchNavigator, private modalCtrl: ModalController, private menuService: MenuServiceService, private shoppingCart:ShoppingCartService, private activatedrouter: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      firstName: new FormControl()
    });


    this.activatedrouter.paramMap.subscribe( par => {
    this.orderId = par.get('orderId');
    //console.log(this.orderId);
    });

    this.shoppingCart.getOrderByIdForUs(this.orderId).subscribe(data => {
      this.statusBothLangugue = data.status;
      let temp = data.completedOn.split("after");
      this.completedOnBeforeSplit = data.completedOn;
      if(this.langugue){
        let text = data.status.split("After");
        data.status =  text[1];
      }else {
        let text = data.status.split("After");
        data.status =  text[0];
      }
      data.completedOn = temp[0];
      this.myOrder = data;
      this.products = data.product
      for(const key in this.products){
        this.products[key].total = +Number(+this.products[key].catagory *this.products[key].price).toFixed(2);
      }
      this.orderTotal = this.calculateTotal(data);
      this.doneLoading = true;
      this.orderLocation = data.location;
      //console.log(this.orderLocation);
      //this.form.patchValue({ location: data.location });
    });
  }

  onLocationPicked() {

      this.modalCtrl.create({ component: MapModalComponent,
      componentProps: {
        center: {lat:this.orderLocation.lat, lng:this.orderLocation.lng},
        closeButtonText: 'nice'
      }

      }).then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
        });
        modalEl.present();
      });


  }

  onclick(){
    //this.launchNavigator.navigate('Toronto, ON');
    //console.log("clicked");


// let options: LaunchNavigatorOptions = {
//   start: 'London, ON',
// }



    // this.launchNavigator.navigate('Toronto, ON', options)
    //   .then(
    //     success => console.log('Launched navigator'),
    //     error => console.log('Error launching navigator', error)
    //   );
  }

  updateStatues(){
    this.shoppingCart.updateStatues(this.myOrder,this.statusBothLangugue, this.completedOnBeforeSplit).subscribe(data => {
      //console.log("done", this.statusBothLangugue);
    });

    this.shoppingCart.updateStatuesForCustomer(this.myOrder, this.statusBothLangugue).subscribe(data => {
      //console.log("done2");
    });




    //console.log(this.myOrder.statusForUs, this.statusBothLangugue);
  }






  menuClicked(){
    this.menuService.menuClicked();
  }

  calculateTotal(data:any){
    let total = data.total;
    // for(const Key in this.products){
    //   const sum= this.products[Key].price * +this.products[Key].catagory;
    //   total = total + sum;
    // }
    // if(total<7.99){
    //   total = total + 1;
    // }
    // if(data.promoApplied){
    //   if(data.discountType === "percentage"){
    //     total = total * data.discount;
    //     total= +Number(total).toFixed(2);
    //   }else{
    //     total = total - data.discount;
    //     total= +Number(total).toFixed(2);
    //   }
    // }
    return total;
  }

}
