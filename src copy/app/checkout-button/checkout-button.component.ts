import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ShoppingCartService } from '../checkout-cart/shopping-cart.service';
import { MenuServiceService } from '../menu-service.service';


@Component({
  selector: 'app-checkout-button',
  templateUrl: './checkout-button.component.html',
  styleUrls: ['./checkout-button.component.scss'],
})
export class CheckoutButtonComponent implements OnInit {
  total:number
  langugue: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });

  constructor(private shoppingCartService: ShoppingCartService, private menuService:MenuServiceService) { }

  ngOnInit() {
    this.shoppingCartService.shoppingCart.subscribe(data => {
      this.total = +Number(this.shoppingCartService.calculateTotalForShoppingCart()).toFixed(2);

    }

    )
  }

}
