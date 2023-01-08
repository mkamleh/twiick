import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatPage } from './cat.page';

const routes: Routes = [
  {
    path: '',
    component: CatPage
  },
  {
    path:':catId',
    loadChildren: () => import('./catinside/catinside.module').then( m => m.CatinsidePageModule)

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatPageRoutingModule {}
