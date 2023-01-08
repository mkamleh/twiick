import { Component, OnInit } from '@angular/core';
import { ShoppingCartService, shoppingCart } from '../shopping-cart.service';
import { Route, Router } from '@angular/router';
import { MenuServiceService } from 'src/app/menu-service.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  constructor(private menuService: MenuServiceService, private shoppingCart: ShoppingCartService, private router:Router) { }
  shoppingCartinUse:shoppingCart = null;
  shoppingCartinUseIsNull = true;
  total:number;
  products = [];
  langugue: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });

  ngOnInit() {
    this.shoppingCart.shoppingCart.subscribe(
      data => {
        if(data!==null){
        //console.log(data);
        this.shoppingCartinUse = data;
        this.products= data.product;
        this.calculateTotal();
        this.shoppingCartinUseIsNull = false;
        //this.shoppingCart.clearShoppingCart();
        }else{
          this.router.navigateByUrl("/");
        }
      }
    );
  }

  menuClicked(){
    this.menuService.menuClicked();
  }

  ionViewWillEnter(){
    if(this.shoppingCartinUse === null){
     // this.router.navigateByUrl("/");
    }
  }

  ionViewWillLeave(){
      this.shoppingCart.clearShoppingCart();
      //console.log("will leave");
      //this.shoppingCart.observablerFiredOnNewOrderSubmittion.next("new orders");
  }


  calculateTotal(){
    this.total = this.shoppingCartinUse.total;


    // for(const Key in this.products){
    //   const sum= this.products[Key].price * this.products[Key].catagory;
    //   this.total = this.total + sum;
    // }
    // if(this.total<7.99){
    //   this.total = this.total + 1;
    // }
    // if(this.shoppingCartinUse.promoApplied){
    //   if(this.shoppingCartinUse.discountType === "percentage"){
    //     this.total = this.total * this.shoppingCartinUse.discount;
    //     this.total= +Number(this.total).toFixed(2);
    //   }else{
    //     this.total = this.total - this.shoppingCartinUse.discount;
    //     this.total= +Number(this.total).toFixed(2);
    //     if(this.total<0){
    //       this.total = 0;
    //     }
    //   }
    // }
  }

}
