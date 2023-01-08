import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { MenuServiceService } from 'src/app/menu-service.service';

@Component({
  selector: 'app-checkout-button-arabic',
  templateUrl: './checkout-button-arabic.component.html',
  styleUrls: ['./checkout-button-arabic.component.scss'],
})
export class CheckoutButtonArabicComponent implements OnInit {

  total:number

  constructor(private shoppingCartService: ShoppingCartService, private menuService:MenuServiceService) { }

  ngOnInit() {
    this.shoppingCartService.shoppingCart.subscribe(data => {
      this.total = +Number(this.shoppingCartService.calculateTotalForShoppingCart()).toFixed(2);
    }

    )
  }

}
