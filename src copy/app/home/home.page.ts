import { Component, AfterContentChecked, ViewChild } from '@angular/core';
import { MenuServiceService } from '../menu-service.service';
import { Product } from '../product.model';
import { CatagoriesService } from '../catagories.service';
import { AngularFireStorage } from '@angular/fire/storage';
//import SwiperCore from 'swiper/core';
import { SwiperComponent } from "swiper/angular";
import  { Swiper, Autoplay, EffectCube, EffectFade } from 'swiper';
import { IonicSwiper } from '@ionic/angular';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from 'swiper/core';



SwiperCore.use([EffectFade,EffectCube,Autoplay, Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  constructor(private catagoriesSerive: CatagoriesService, private storage: AngularFireStorage, private menuService: MenuServiceService) {}
  urll;
  langague = false;
  products : Product [];
  product:any
  loadingIsDone: boolean = false;
  offersArray : Product[] =[];



  ngOnInit() {



    this.catagoriesSerive.getOfferArray().subscribe(data => {
      this.offersArray = data;
      this.offersArray.forEach(element => {
        if(!element.hasOwnProperty("offerDate")){
          element.offerDate = "false";
          //console.log("looolmw");
        }
      });
      let str = JSON.stringify(this.offersArray);
      //console.log(str);
      this.loadingIsDone = true;
    })

    this.menuService.getLangugue().subscribe(data => {
      this.langague = data;
      //console.log(this.langague, 'langge');
    }
    );





    //var pathReference = this.storage.ref('caseImg3.png');
    //pathReference.getDownloadURL()
    //.subscribe((url) => {
      //var img = document.getElementById('myimg');
      //img.setAttribute('src', url);
      //this.urll= url;
      //console.log(url);
    //});
    // // .catch((error) => {
    // //   console.log(error);
    // });
}


mouseOver(){
  //this.swiper.autoplay = false;
  //alert("in");
}

mouseout(){
 // this.swiper.stop
  //alert("out")
}

ngAfterContentChecked(){
  if(this.swiper){
    this.swiper.updateSwiper({});
  }
}

// menuClick() {
//   $(".menu").toggleClass("close");
//     document.getElementById("menuResponsive").toggleClass("openMenuResponsive");
// };

menuClicked(){
  this.menuService.menuClicked();
}

goToOffers(){
  //alert("hi");
}

}
