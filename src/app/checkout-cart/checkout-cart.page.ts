import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService, shoppingCart } from './shopping-cart.service';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { Key } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MenuServiceService } from '../menu-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlaceLocation } from '../LocationMap/location.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.page.html',
  styleUrls: ['./checkout-cart.page.scss'],
})
export class CheckoutCartPage implements OnInit, OnDestroy {

  // public formm = [
  //   { val: 'Pepperoni', isChecked: true },
  //   { val: 'Sausage', isChecked: false },
  //   { val: 'Mushroom', isChecked: false }
  // ];

  subscribtion:Subscription;
  mergedObj:any;
  deliveryOption = "normal"
   shoppingCartInUse: shoppingCart;
  loadingIsDone= false;
  cartIsEmpty = true;
  locationAvaialble = false;
  promoApplied = false;
  products = [];
  form: FormGroup;
  orderLocation: PlaceLocation;
  name: string = "";
  subuserId:Subscription;
  customerName="";
  customerPhone="";
  guest: boolean = false;
  msg : string;
  errorMsg: boolean = false;
  discount: number = 1;
  discountType;
  promo
  totalBeforePromo;
  showDeliveryAlert: boolean = false;
  showTime : boolean = true;
  freeDeliveryUnder5: boolean = false;
  deliveryTime;


  total: number = 0;
  languge: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.languge = data;
  });

  constructor(private router: Router, public alertController: AlertController, public toastController: ToastController, private menuService: MenuServiceService, private authService: AuthService, private shoppingCart:ShoppingCartService, private httpService:HttpClient) { }

  ngOnInit() {

    this.getfreeDeliveryOptionStatus().subscribe(data => {
      this.freeDeliveryUnder5 = data;
      this.calculateTotal();
    });

    this.checkIfGuestOrLogin();

//     this.promo = {
//       activated: true,
// code:
// "2JDOFF",
// discount:
// "2",
// type:
// "amount"

//     };

//     this.httpService.post('https://twiick-default-rtdb.firebaseio.com/promoCode.json', this.promo).subscribe(data => {
//       console.log("done");
//     });

    this.form = new FormGroup({
      location: new FormControl(null, { validators: [Validators.required] })
    });




   this.subscribtion = this.shoppingCart.shoppingCart.subscribe(dataa => {
     //console.log("chekout page observable fied", dataa);
     if (dataa!==null){
        this.products = dataa.product;
        this.convertPriceAndQuantityToInt();
        this.shoppingCartInUse = dataa;
        this.getfreeDeliveryOptionStatus().subscribe(data => {
          this.freeDeliveryUnder5 = data;
          this.calculateTotal();
        });
       }else {
        this.products = [];
        this.shoppingCartInUse = null;
        this.total = 0;
        this.shoppingCart.itiateShoppinintgCart().subscribe();
       }
     this.loadingIsDone = true;
     //console.log(this.total);
     this.shoppingCart.total = this.total;
     if(this.products.length == 0){
       this.cartIsEmpty = true;
     }else{
      this.cartIsEmpty = false;
     }
    });

    this.authService.userId.subscribe(
      data => {
        if (data === null){
          this.shoppingCart.clearShoppingCart();
        }
      }
    );


   // this.shoppingCart.addItemToCart().subscribe(data => {
     // console.log("done", data);
    //});


  }

  menuClicked(){
    this.menuService.menuClicked();
  }

  deliveryOptionChanged(option:string){
    //console.log(option);
    if(option=="express"){
      this.deliveryOption = "express";
      this.showTime = false;
      //console.log(this.showTime)
    }else{
      this.showTime = true;
      this.deliveryOption = "normal";
    }

    this.calculateTotal();
  }

  getfreeDeliveryOptionStatus(){
    return this.httpService.get("https://twiick-default-rtdb.firebaseio.com/controlOptions/freeDeliveryUnder5.json").pipe(map(
      date => {
        if(date){
          return true;
        }else{
          return false;
        }
      }
    ));
  }



  onLocationPicked(location: PlaceLocation) {
    if(location.lat>0){
      this.locationAvaialble = true;
      this.orderLocation = location;
    }
    //console.log(location);
    this.form.patchValue({ location: location });
  }

  convertPriceAndQuantityToInt(){
    for(const key in this.products){
      this.products[key].priceTotalForQuantity =  parseFloat(this.products[key].price) * parseFloat(this.products[key].catagory);
      //console.log(this.products[key].priceTotalForQuantity, parseFloat(this.products[key].price), parseFloat(this.products[key].catagory) );
      this.products[key].priceTotalForQuantity = this.products[key].priceTotalForQuantity.toString()
      this.products[key].priceTotalForQuantity = Number(this.products[key].priceTotalForQuantity).toFixed(2);
      //this.products[key].priceTotalForQuantity.to = Math.floor((this.products[key].priceTotalForQuantity + Number.EPSILON) * 100) / 100;

    }
  }

  updateQuantity(id:string, index:number){
    const divId= 'product'+index;
    let inputval= (<HTMLInputElement>document.getElementById(divId)).value;
    //console.log(inputval);
    if(+inputval > 2 && this.products[index].quaLeft ){
      this.shoppingCart.presentToastTwoMuch();
      (<HTMLInputElement>document.getElementById(divId)).value = "2";
      //console.log(inputval);
    }else{
      this.products[index].catagory = inputval;
      //console.log(this.products[index].catagory);
      this.shoppingCart.updateCart(index,inputval).subscribe();
    }

  }

  calculateTotal(){
    this.total =0;
    for(const Key in this.products){
        const sum= this.products[Key].price * this.products[Key].catagory;
        this.total = this.total + sum;
        this.total = Number(this.total.toFixed(2));
      }
      this.totalBeforePromo = this.total;
      this.DeliveryCharge();
  }


  DeliveryCharge(){
    if (this.totalBeforePromo<4.99){
      if(!this.freeDeliveryUnder5){
        this.total = this.total + 1;
        this.total = Number(this.total.toFixed(2));
        this.showDeliveryAlert = true;
      }else{
        this.showDeliveryAlert = true;
      }
    }else{
      this.showDeliveryAlert = false;
    }

    if(this.deliveryOption == "express"){
      this.total = this.total + 2;
      this.total = Number(this.total.toFixed(2));
      this.showDeliveryAlert = false;
      if(this.totalBeforePromo<4.99){
        this.showDeliveryAlert = true;
      }

    }
  }



  sumbitOrderForUs(){



    this.httpService.get<any>(`https://twiick-default-rtdb.firebaseio.com/users/${this.shoppingCartInUse.userId}.json`).subscribe(
      data => {

        if(this.guest){
          this.mergedObj =  this.shoppingCartInUse;
          this.mergedObj.customerName = this.customerName;
          this.mergedObj.customerNumber = this.customerPhone;
          this.mergedObj.statusForUs = "New order"
        }else{
          this.mergedObj =  this.shoppingCartInUse;
          this.mergedObj.customerName = data.name;
          this.mergedObj.customerNumber = data.number
          this.mergedObj.statusForUs = "New order"
        }



        this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/ordersPlaced/${this.shoppingCartInUse.cartId}.json`,this.mergedObj).subscribe(

          data=> {
            //console.log(this.shoppingCartInUse.cartId,data);

          }
          );
      }
    );
  }



  async presentToast() {
    let text;
    if(!this.languge){
      if(this.errorMsg){
        text = 'PromoCode is not valid';
      }
      if(this.promoApplied){
        text = 'PromoCode applied';
      }
    }else {
      if(this.errorMsg){
        text = 'كود الخصم غير موجود';
      }
      if(this.promoApplied){
        text = 'تم تفعيل كود الخصم';
      }
    }
    const toast = await this.toastController.create({
      message:text,
      duration: 1000,
    });
    toast.present();
  }



  checkCodeAndApply(){



    this.httpService.get<any>(`https://twiick-default-rtdb.firebaseio.com/promoCode.json?orderBy="code"&equalTo="${this.name}"&print=pretty`).subscribe(data => {
      //console.log(data);
      if(Object.keys(data).length>0){
        for(const key in data){
          if(data[key].activated){
            if(!this.promoApplied){
              if(data[key].type==="percentage"){
                this.total = this.total * data[key].discount;
                this.total = Number(this.total.toFixed(2));
                this.promoApplied = true;
                this.discount = data[key].discount;
                this.discountType = data[key].type
              }if(data[key].type==="amount"){
                this.total = this.total - data[key].discount;
                this.total= +Number(this.total).toFixed(2);
                if(this.total < 0){
                  this.total = 0;
                }
                this.promoApplied = true;
                this.discount = data[key].discount;
                this.discountType = data[key].type
              }

            }
          }else{
            this.errorMsg = true;
            //console.log("bad");
          }
        }
      }else{
        this.errorMsg = true;
        //console.log("bad2");
      }
    //   for(const key in data){
    //   if(data.hasOwnProperty(key)){
    //     console.log("goodCode");
    //   }else{
    //     console.log("bad");
    //   }
    // }

    this.presentToast();


    })
  }

  checkIfGuestOrLogin(){
    this.subuserId=this.authService.getuseridd().subscribe(data => {
      //console.log(data);
      if(data.email.startsWith("test")){
        this.guest = true;
        //console.log("guest");
      }else{
        this.guest = false;
        //console.log("login");
      }
    })
    //console.log("loool");
    this.subuserId.unsubscribe();

  }

  async presentAlert() {
    if(this.languge){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class1',
        header: 'خطأ في الإدخال',
        //subHeader: 'Subtitle',
        message: 'الرجاء تحقق من رقم التليفون',
        buttons: ['تم']
      });

      await alert.present();
    }else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class1',
        header: 'Error in data',
        //subHeader: 'Subtitle',
        message: 'Phone number should be 10 digits',
        buttons: ['Done']
      });

      await alert.present();
    }

  }

  sumbitOrder(){

    if(this.guest){
      var phoneno = /^\d{10}$/;
      if(phoneno.test(this.customerPhone)){
        this.sumbitOrderNext();
        //console.log("nice");
      }else{
        this.presentAlert();
        //console.log("bad");
      }
    }else{
      this.sumbitOrderNext();
      //console.log("notguest");
      this.authService.getuseridd().subscribe(data => {
        //console.log(data);
    });
  }



    // if(this.customerPhone== "123"){
    //   this.sumbitOrderNext();
    // }
    // var phoneno = /^\d{10}$/;
    // phoneno.test(this.customerPhone);


  }



  sumbitOrderNext(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hours = today.getHours();
    let miniutes = today.getMinutes();

    for(const key in this.products ){
      if(this.products[key].quaLeft){
        let newQuaLeft = this.products[key].offerQuntityLeft - this.products[key].catagory;
        this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/products/k/arabic/${this.products[key].id}/offerQuntityLeft.json`,newQuaLeft ).subscribe( data => {
          //console.log("sone");
        });

        if(newQuaLeft<1){
          this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/products/k/arabic/${this.products[key].id}/quaLeft.json`, false).subscribe(data => {
            //console.log("done2");
          });

          this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/products/k/arabic/${this.products[key].id}/outOfStock.json`, true).subscribe(data => {
            //console.log("done3");
          });
        }


      }
    }


    let orderTime = hours + " : " + miniutes;
    let todayz = dd + '/' + mm + '/' + yyyy;
    this.shoppingCartInUse.status = "being preparedAfterتحت التحضير";
    this.shoppingCartInUse.userIdWithStatus = this.shoppingCartInUse.userId + "_" + 'completed'
    this.shoppingCartInUse.completedOn = todayz + 'after' + Date.now();
    this.shoppingCartInUse.location = this.orderLocation;
    this.shoppingCartInUse.orderTime = orderTime;
    this.shoppingCartInUse.promoApplied = this.promoApplied;
    this.shoppingCartInUse.discount = this.discount;
    this.shoppingCartInUse.discountType = this.discountType;
    this.shoppingCartInUse.deliveryOption = this.deliveryOption;
    this.shoppingCartInUse.total = this.total;
    if(this.deliveryOption == "normal"){
      this.shoppingCartInUse.deliveryTime = this.deliveryTime;
    }
    console.log(this.shoppingCartInUse);
    //console.log(this.shoppingCartInUse.cartId,todayz,"now", orderTime);
    this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${this.shoppingCartInUse.cartId}.json`,this.shoppingCartInUse).subscribe(

    data=> {
      //console.log(this.shoppingCartInUse.cartId,data);
    }
    );


    this.sumbitOrderForUs();



    //this.shoppingCart.observablerFiredOnNewOrderSubmittion.next('neworder');
    this.shoppingCart.thereIsAlreadyOpenCart = false;
    //this.shoppingCart.clearShoppingCart();



    this.httpService.post('https://formspree.io/f/mnqloqzw',
        { name: "mk", replyto: "mk", message: "new order" },
        ).subscribe(
          response => {
            //console.log(response);
          }
        );


        this.router.navigate(['/checkout-cart/confirmation']);


      }

  ngOnDestroy() {
    if(this.subscribtion!==null){
    this.subscribtion.unsubscribe()
    }
}

}
