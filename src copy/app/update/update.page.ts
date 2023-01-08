import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catagories } from 'src/app/cat/Catagories.model';
import { CatagoriesService } from 'src/app/catagories.service';
import { Subscription} from 'rxjs';
import { PathLocationStrategy, NumberSymbol } from '@angular/common';
import { Product } from 'src/app/product.model';
import { ShoppingCartService } from 'src/app/checkout-cart/shopping-cart.service';
import { AuthService } from 'src/app/auth.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { StringDecoder } from 'string_decoder';
import { MenuServiceService } from 'src/app/menu-service.service';
import { ModalPageComponent } from './modal-page/modal-page.component';
import { timer, Subject } from 'rxjs';
import { map, takeUntil, takeWhile, finalize } from 'rxjs/operators';

export interface Subcatagory {
  subcatagory : string;
  catagory : string;
  product: Product []
  //product: Array<{name: string, price: string}>;
}

export interface shoppingCart {
  cartId: string;
  status : string;
  completedOn : string;
  product: Product []
}

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {



  userId = null;
  userIdsubscribtion= this.AuthService.userId.subscribe(resdata => {
    this.userId = resdata;
  })

  userIsAdmin = null;
  userAdminsubcribtion = this.authService.checkIfAdminOrNot(this.userId).subscribe(role => {
    this.userIsAdmin = role;
    if(!this.userIsAdmin){
      this.router.navigateByUrl('/sign-up');
    }
  })

  catagories = [];
  private subProducts: Subscription;
  products : Product [];
  catId: string;
  offers: Product[] = [] ;
  allSubcatagory : string [];
  //tesubcatagory:  { name: string , product: Product [] } [];
  subcatagory = [];
  subsub = [];
  catIdForAnchorUseOnly:string;
  subscribtion: Subscription = null;
  quan:number=1
  sub = "liquid";
  freeDeliveryBelow5: boolean = false;
  //value="";
  langugue: boolean ;
  subscription = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });




  productWithOneCatagory = [];
  arrayOne: Number[] = [

      1,2,3,4,5,6,7,8,9

  ];


  constructor( public modalController: ModalController, private AuthService: AuthService, private menuService: MenuServiceService, public toastController: ToastController, private router:Router, public actionSheetController: ActionSheetController, private httpClient:HttpClient,  private authService: AuthService, private shoppingCart:ShoppingCartService, private activativedRoute : ActivatedRoute, private catagoriesSerive: CatagoriesService) { }

  ngOnInit() {

    this.catagoriesSerive.getOfferArray().subscribe(data => {
      this.offers = data;
      //console.log (this.offers[0].name + "looool3");
    })


    // this.httpClient.post("https://twiick-default-rtdb.firebaseio.com/products/-MVRtwkaxnhgHA9bX0bC.json", { description : '1', name: 'milk', picture: 'ggg', price: 2, catagory : 'choclate' , subcatagory: 'solid '} ,
    // ).subscribe();

      this.catId = "إفطار";
      this.catIdForAnchorUseOnly = "إفطار"
      this.subProducts = this.catagoriesSerive.fetchProducts().subscribe(data => {

      this.products = data;
      //console.log(data);
      this.getProductForEachCatagory(data);
      this.catagories = this.catagoriesSerive.getCatagories();
      this.getAllSubCatagories(data);
      this.products.sort(this.compare);
      //console.log(data,'data');
      this.getProductForEachSubCatagory(data);
      this.subsub=this.selectCat(this.subcatagory);
      //console.log(this.subcatagory,'fff');
      //document.getElementById("qua").setAttribute('value','1');
      //this.getOffsetTopForSubcatagories();
      this.onConfigFirstIonSegmentButton();
      this.defineXposition();
     // this.getXPositionsForcatagoriesIonSegment();

      })
    }

    async presentModal() {
      const modal = await this.modalController.create({
        component: ModalPageComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          data: this.products
        }
      });
      return await modal.present();
    }


    changeDeliveryOption(){
      //console.log(this.freeDeliveryBelow5);
      this.catagoriesSerive.updateDeliveryOptionDelvery(this.freeDeliveryBelow5).subscribe(data => {
        //console.log(data);
      })
    }

    addToOffers(Product: Product){
      let index;
      if (this.offers === null){
        index = -1;
        this.offers = this.offers || [];
      }else{
        index = this.offers.findIndex(x => x.id === Product.id);
      }
      //console.log(index);
      if(!Product.inOfferArray){
        //console.log("found to be removed");
        if(index>-1){
          //console.log("found to be removed2");
          this.offers.splice(index,1);
        }
      }else{
       // console.log("not found to be added");
        if(index == -1){

          this.offers.push(Product);
        }
      }
      this.update(Product);
      this.catagoriesSerive.updateOfferArray(this.offers).subscribe(data => {
       // console.log(data);
      })
     // console.log(this.offers);
    }

    someMethod(){
      alert('hi');
    }

    compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const bandA = a.name;
      const bandB = b.name;

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison * -1;
    }

    changeLang(){
      this.menuService.changeLangugeForUpdate();
      this.ngOnInit();

    }

    addProduct(){
      console.log("l00ool");
      this.presentModal();
    }



    getOffsetTopForSubcatagories(){
      for(const key in this.subcatagory){
        if(this.subcatagory[key].catagory=== this.catId){
        this.subcatagory[key].offsetTop = document.getElementById(this.subcatagory[key].subcatagory).offsetTop;
        }
      }
    }

    getXPositionsForSubcatagoriesIonSegment(){
      for(const key in this.subcatagory){
        if(this.subcatagory[key].catagory=== this.catId){
          let vari = "button" + this.subcatagory[key].subcatagory;
          //console.log(this.subcatagory[key].xPosition,"xposition");
          if(this.subcatagory[key].xPosition === 5){
              this.subcatagory[key].xPosition = document.getElementById(vari).getBoundingClientRect().left;
          }
        }
      }
      //console.log(this.subcatagory);
    }

    async presentToast() {
      let text;
      if(!this.langugue){
        text = 'Item added to cart.';
      }else {
        text = "تم اضافة المنتج الى السلة";
      }
      const toast = await this.toastController.create({
        message:text,
        duration: 1000,
      });
      toast.present();
    }

    defineXposition(){
      for(const key in this.subcatagory){
        this.subcatagory[key].xPosition = 5;
      }
   }




   update(product:any){

    this.catagoriesSerive.updateProduct(product).subscribe(date => {
      //console.log("done");
      alert("done");
    });
     //console.log(product);
   }

   delete(product: Product){
    this.products.splice(parseInt(product.id),1);
    this.catagoriesSerive.addProduct(this.products).subscribe(date => {
      //console.log("done");
      alert("done");
    });
     //console.log(product);
   }




    onSegmentChangeSubCatagagory(value:any){
      //console.log("yes working" +  value.detail.value);
    }

    onConfigFirstIonSegmentButton(){
      //console.log("hi");
      //console.log(this.subcatagory, this.catId );


        for(const key in this.subcatagory){
          //this.sub = this.subcatagory[key].subcatagory;
         // console.log(this.subcatagory[key].catagory, this.catId );
          if(this.subcatagory[key].catagory=== this.catId){
            this.sub = this.subcatagory[key].subcatagory;
            //console.log(this.sub);
            return;
          }
        }


      }

    onScroll(event){
      let previousValue = 0;
      this.scrollCatagoryAutomaticallytoView(this.catId);

      this.getXPositionsForSubcatagoriesIonSegment();

          this.getOffsetTopForSubcatagories();
          //console.log("yes", this.sub);


          let currentOffsetTop= event.detail.scrollTop+312;
          for(const key in this.subcatagory){
            //this.sub = this.subcatagory[key].subcatagory;
            if(this.subcatagory[key].catagory=== this.catId){
              //console.log(this.subcatagory);
              //console.log(currentOffsetTop + 'fff' + this.subcatagory[key].offsetTop + this.subcatagory[key]);
              if(currentOffsetTop>this.subcatagory[key].offsetTop && previousValue !== this.subcatagory[key].offsetTop){
              this.sub = this.subcatagory[key].subcatagory;
              previousValue = this.subcatagory[key].offsetTop;
              //console.log(this.sub,"inside");
              }
            }
      }
          this.changeSegmentSubcatagoryonScroll(this.sub);
          //console.log(this.subcatagory);


    }


    addItemToCart( index:number,index1:number, product:Product, quantity:any){
      if(!this.langugue){
        product.picture= product.name;
      }
      const id= 'qua' + index + index1;
      //console.log(id);
      document.getElementById(id).setAttribute('value','1');
      //document.getElementById("qua").setAttribute('value','1');
      //console.log(quantity.viewModel);
      quantity = quantity.viewModel;
      let userId=null;
      this.authService.userId.subscribe(data =>{
        userId=data;
      })
      //console.log(userId,'111');
      if(userId!==null){
        //console.log('why');
        this.subscribtion = this.shoppingCart.addItemToCart(userId,product,quantity).subscribe(data =>
          {
            this.presentToast();
            this.shoppingCart.calculateTotalForShoppingCart();
          });
        //this.shoppingCart.shoppingCart.subscribe(data => console.log(data, 'true shopping cart'));

      }else{
        this.presentAlert();
      }
    }

    toTop(subcatagory:string) {

      const id = 'anchor'+ subcatagory;
      //const yOffset = +50;
      //const element = document.getElementById(id);
      //const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      //{behavior: 'smooth', block: "center"}

      //window.scrollTo({top: y, behavior: 'smooth'});
      document.getElementById(id).scrollIntoView();
      //document.getElementById(subcatagory).scrollTop -= 150;
    }


    changeSegmentSubcatagoryonScroll(sub) {
      const id = 'button'+ sub;
      //const yOffset = +50;
      //const element = document.getElementById(id);
      //const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      //window.scrollTo({top: y, behavior: 'smooth'});
      //let positionX= document.getElementById(id).getBoundingClientRect().left
      //console.log(this.sub,"inside");
      //console.log(positionX);
      //document.getElementById(id).scrollTo(400,107);
      let index = this.subcatagory.findIndex(array =>
        array.subcatagory === this.sub
      );
      //console.log(index);
      document.getElementById('subCatIonSegment').scrollTo(this.subcatagory[index].xPosition,107);
      //document.getElementById(id).scrollIntoView({behavior: 'smooth'});
      //scrollTo(0, this.target.nativeElement.offsetTop, 500);
    }

    scrollCatagoryAutomaticallytoView(catid:string){
      //console.log(catid,"ionwillenter");
      let id = "button" + catid;
      //console.log()
      //document.getElementById('catIonSegment').scrollTo(this.subcatagory[index].xPositionForCatagory,107);
      if(document.getElementById(id)!== null){
          document.getElementById(id).scrollIntoView({behavior: 'smooth'});
          //document.getElementById("catIonSegment").scrollLeft +=40;
      }
    }

    menuClicked(){
      this.menuService.menuClicked();
    }


    ionViewDidEnter(){
      //this.getXPositionsForcatagoriesIonSegment();
      this.scrollCatagoryAutomaticallytoView(this.catId);
    }



    segmentChanged(ev: any) {
      ///console.log('Segment changed', ev);
    }


  changeCatagory(newCatagory:string){
    this.catId= newCatagory;
    this.getOffsetTopForSubcatagories();
    this.onConfigFirstIonSegmentButton();
    //this.getXPositionsForSubcatagoriesIonSegment();
  }

  selectCat(data){
    const arrayCat = []
    for(const key in data){
      if(data.hasOwnProperty(key)){
        //console.log('111');
        if(data[key].catagory == this.catId){
          //console.log('222');
          arrayCat.push(data[key].subcatagory);
        }
      }
    }
    return arrayCat;
  }


  getAllSubCatagories(data){
    const subcatagory = [];
    for(const key in data){
      if(data.hasOwnProperty(key)){
        subcatagory.push(data[key].subcatagory);
      }
    }

    this.allSubcatagory = [...new Set(subcatagory)]
    //console.log(this.allSubcatagory, 'allSubcatagory');
  }

  getProductForEachCatagory(data){
    for(const key in data){
      if(data.hasOwnProperty(key)){
       // console.log(data.catagory);
      if(data[key].catagory == this.catId){
        this.productWithOneCatagory.push(data[key]);
      }
    }
   }
  }
    //console.log(this.productWithOneCatagory);




  getProductForEachSubCatagory(data){
    this.subcatagory = [];
    let products: Product [] = [];
    const newArray =  [];
    for(const subcatagoryKey in this.allSubcatagory){
    products = [];
    let catagory;
    for(const prodyctkey in data){
      if(data.hasOwnProperty(prodyctkey)){
        //console.log(catagory,'kkk');
        if (data[prodyctkey].subcatagory ==  this.allSubcatagory[subcatagoryKey]){
          products.push(data[prodyctkey]);
          catagory =  data[prodyctkey].catagory;
        }
      }
    }
    const test: Subcatagory ={ subcatagory: this.allSubcatagory[subcatagoryKey],
      catagory: catagory, product: products} ;
    this.subcatagory.push(test);
  }

    //console.log(this.subcatagory);
  }

  async presentAlert(){
    if(this.langugue){
      const actionSheet = await this.actionSheetController.create({
        header: 'تحتاج الى انشاء حساب جديد،هل انت جاهز',
        cssClass: 'centerr',
        buttons: [{
          text: 'نعم',
          icon: 'person-circle-outline',
          handler: () => {
            this.router.navigateByUrl("/sign-up");
          }
        },
        {
          text: 'إلغاء',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();


    }else{
      const actionSheet = await this.actionSheetController.create({
        header: 'You need to sign up, Are you ready?',
        cssClass: 'centerr',
        buttons: [{
          text: 'Yes',
          icon: 'person-circle-outline',
          handler: () => {
            this.router.navigateByUrl("/sign-up");
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
           // console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();

    }



  }


  ngOnDestroy() {
    if(this.subscribtion!==null){
    this.subscribtion.unsubscribe();
    }

}

}
