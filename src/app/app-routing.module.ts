import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
   {path: '404', redirectTo: 'home',},
  {path: '**',  redirectTo: 'home',},
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'cat',
    loadChildren: () => import('./cat/cat.module').then( m => m.CatPageModule)
  },
  {
    path: 'checkout-cart',
    loadChildren: () => import('./checkout-cart/checkout-cart.module').then( m => m.CheckoutCartPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./my-orders/my-orders.module').then( m => m.MyOrdersPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'orders-for-us',
    loadChildren: () => import('./orders-for-us/orders-for-us.module').then( m => m.OrdersForUsPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule), canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
