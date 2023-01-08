import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { MenuServiceService } from 'src/app/menu-service.service';



@Component({
  selector: 'app-confirm-checkout',
  templateUrl: './confirm-checkout.component.html',
  styleUrls: ['./confirm-checkout.component.scss'],
})
export class ConfirmCheckoutComponent implements OnInit {

  langugue: boolean;
  sub = this.menuSerive.getLangugue().subscribe(data =>{
    this.langugue = data;
  });

  constructor(private shoppingCartService:ShoppingCartService, private menuSerive:MenuServiceService) { }

  ngOnInit() {}

  submitOrder(){

  }

}
