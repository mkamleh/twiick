import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/checkout-cart/shopping-cart.service';
import { Product } from 'src/app/product.model';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuServiceService } from 'src/app/menu-service.service';

export interface shoppingCart {
  cartId: string;
  userId: string;
  status : string;
  completedOn : string;
  product: Product []
  userIdWithStatus: string;
  deliveryTime: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})


export class OrderPage implements OnInit {

  myOrder: any;
  orderId: string;
  products: Product[];
  orderTotal:number;
  doneLoading: boolean = false;
  langugue: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });

  constructor(private menuService: MenuServiceService, private shoppingCart:ShoppingCartService, private activatedrouter: ActivatedRoute) { }

  ngOnInit() {
    this.activatedrouter.paramMap.subscribe( par => {
    this.orderId = par.get('orderId');
    //console.log(this.orderId);
    });

    this.shoppingCart.getOrderById(this.orderId).subscribe(data => {

      if(data.deliveryOption == "express"){
        if(this.langugue){
          data.deliveryTime ="اليوم خلال ساعة"
        }else{
          data.deliveryTime = "Today, within 1 hour"
        }
      }
      let temp = data.completedOn.split("after");
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
    });
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
    //     if(total<0){
    //       total = 0;
    //     }
    //   }
    // }
    return total;
  }
}
