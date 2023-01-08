import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersForUsPage } from './orders-for-us.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersForUsPage
  },
  {
    path: ':orderId',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersForUsPageRoutingModule {}
