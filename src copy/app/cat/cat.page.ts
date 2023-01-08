import { Component, OnInit } from '@angular/core';
import { Catagories } from './Catagories.model';
import { CatagoriesService } from '../catagories.service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MenuServiceService } from '../menu-service.service';
import { AlertController } from '@ionic/angular';
declare const fbq: any;

@Component({
  selector: 'app-cat',
  templateUrl: './cat.page.html',
  styleUrls: ['./cat.page.scss'],
})
export class CatPage implements OnInit {
  //catagories: Catagories []
  catagories = [];
  private arabicCat = [];
  private subProducts: Subscription;
  loadingIsDone = false;
  langague = true;

  constructor(private alertController: AlertController, private menuService: MenuServiceService, private catagoriesService: CatagoriesService) {
    fbq('track', 'Purchase');
   }

  ngOnInit() {


    this.menuService.getLangugue().subscribe(data => {
      this.langague = data;

      this.subProducts = this.catagoriesService.fetchProducts().subscribe(data => {
        //this.catagories = data;
        //console.log(data);

        this.catagories = this.catagoriesService.getCatagories();
        //console.log(this.catagories);
        this.loadingIsDone = true;


    },error => {
      if(!this.langague){
        this.showAlert("please check your internet connect and try again");
        //console.log(error);
      }else{
        this.showAlert("الرجاء التحقق من الانترنت و  إعادة المحاولة");
        //console.log(error);
      }
    });

      //console.log(this.langague);
    });
    // this.catagoriesService.addtodata();

    //this.catagories = this.catagoriesService.getCatagories();
  }

  showAlert(message:string){
    if(!this.langague){
      this.alertController.create({header: 'فشل في الشبكة', message: message, buttons: ['تم']}).then(alert=>alert.present());
    }else{
      this.alertController.create({header: 'Internet problem', message: message, buttons: ['Okey']}).then(alert=>alert.present());
    }
  }

  menuClicked(){
    this.menuService.menuClicked();
  }


  ngOnDestroy() {
    if (this.subProducts) {
      this.subProducts.unsubscribe();
    }
  }

}
