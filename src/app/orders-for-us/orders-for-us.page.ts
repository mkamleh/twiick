import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../checkout-cart/shopping-cart.service';
import { AuthService } from '../auth.service';
import { Product } from '../product.model';
import { NumberSymbol } from '@angular/common';
import { MenuServiceService } from '../menu-service.service';
import { PlaceLocation } from '../LocationMap/location.model';
import { Router } from '@angular/router';


export interface shoppingCart {
  cartId: string;
  userId: string;
  status : string;
  completedOn : string;
  product: Product []
  userIdWithStatus: string;
  total: number;
  dateInNumbers: number;
  orderTime : string
  location : PlaceLocation
  statusForUs : string;
  customerName: string;
  customerNumber: number;
}
@Component({
  selector: 'app-orders-for-us',
  templateUrl: './orders-for-us.page.html',
  styleUrls: ['./orders-for-us.page.scss'],
})
export class OrdersForUsPage implements OnInit {

  langugue: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });

  userId = null;
  userIdsubscribtion= this.AuthService.userId.subscribe(resdata => {
    this.userId = resdata;
  })
  userIsAdmin = null;
  userAdminsubcribtion = this.authService.checkIfAdminOrNot(this.userId).subscribe(role => {
    this.userIsAdmin = role;
    if(!this.userIsAdmin){
      this.router.navigateByUrl('/sign-up');
    }
  })



  myOrders: any[] = [];
  total: number;
  products: Product [];
  isLoading= true;
  noOrders = false;
  testt = true;


  constructor(private router: Router, private AuthService: AuthService, private menuService: MenuServiceService, private authService: AuthService, private shoppingCart:ShoppingCartService) { }

  ngOnInit() {
    //this.isLoading= true;

    //console.log(this.userIsAdmin);






    this.shoppingCart.gettingAllOrdersForUs().subscribe(data => {
      this.myOrders = [];
      //console.log(data,'firstneworder');
      for(const key in data){
        if (data.hasOwnProperty(key)){
          this.products = data[key].product;
          data[key].total = this.calculateTotal(data[key]);

          let temp = data[key].completedOn.split("after");
          data[key].completedOn = temp[0];
          data[key].time= temp[1];
          if(this.langugue){
            let text = data[key].status.split("After");
            data[key].status =  text[1];
          }else {
            let text = data[key].status.split("After");
            data[key].status =  text[0];
          }

          //console.log(data[key]);


          this.myOrders.push(data[key]);
        }
      }
      this.isLoading=false;
    });

    // this.shoppingCart.observablerFiredOnNewOrderSubmittion.subscribe( data => {
    //   console.log("hi");
    //   this.myOrders = [];
    //   if (data !== null){
    //       this.shoppingCart.gettingAllOrders().subscribe(data => {
    //       console.log(data,'neworders created');
    //       for(const key in data){
    //         if (data.hasOwnProperty(key)){
    //           this.products = data[key].product;
    //           data[key].total = this.calculateTotal();
    //           this.myOrders.push(data[key]);
    //         }
    //     }}
    //     );
    //   }
    //   });
  }


  doRefresh(event) {
    //console.log('Begin async operation');

    this.ionViewWillEnter();

    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  menuClicked(){
    this.menuService.menuClicked();
  }

  ionViewWillEnter(){





    this.myOrders = [];
    this.shoppingCart.gettingAllOrdersForUs().subscribe(data => {
      this.myOrders = [];
      //console.log(data,'firstneworder');
      for(const key in data){
        if (data.hasOwnProperty(key)){
          this.products = data[key].product;
          data[key].total = this.calculateTotal(data[key]);

          let temp = data[key].completedOn.split("after");
          data[key].completedOn = temp[0];
          data[key].time= temp[1];
          if(this.langugue){
            let text = data[key].status.split("After");
            data[key].status =  text[1];
          }else {
            let text = data[key].status.split("After");
            data[key].status =  text[0];
          }


          this.myOrders.push(data[key]);
        }
      }
      this.myOrders.sort(this.compare);
      if(this.myOrders.length == 0){
        this.noOrders = true;
      }else{
        this.noOrders = false;
      }
      //console.log(this.myOrders,"afterSort");
    });
}

compare(a, b) {
  // Use toUpperCase() to ignore character casing
  const bandA = a.time.toUpperCase();
  const bandB = b.time.toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison * -1;
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