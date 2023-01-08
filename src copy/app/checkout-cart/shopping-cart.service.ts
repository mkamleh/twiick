import { Injectable } from '@angular/core';
import { Product } from '../product.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Key } from 'protractor';
import { PlaceLocation } from '../LocationMap/location.model';
import { MenuServiceService } from '../menu-service.service';
import { ToastController } from '@ionic/angular';

export interface shoppingCart {
  cartId: string;
  userId: string;
  status : string;
  completedOn : string;
  product: Product []
  userIdWithStatus: string;
  location : PlaceLocation
  orderTime ? : string;
  promoApplied ? : boolean ;
  discount ? : number;
  deliveryAdded? : boolean
  discountType ? : string;
  deliveryOption ? : string;
  deliveryTime? : any;
  total?: number;
}


export interface shoppingCartDatabase{
  userId: string;
  status : string;
  completedOn : string;
  product: Product []
  userIdWithStatus: string;
}



@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {



    total: number;


    //shoppingCartnew: shoppingCart = { cartId: 'abc', userId:'232', status: 'notCompleted',
    //completedOn:null, product: this.products};

  // shoppingCartTable: shoppingCart [] = [{ cartId: '3234', userId:'abc', status: 'notCompleted',
  // completedOn:null, product: this.products},
  // { cartId: '3244', userId:'rtf', status: 'notCompleted',
  // completedOn:null, product: this.products}];
  currentShoppingCart:shoppingCart = {cartId: 'ttt', userId: 'rrr', status: 'ggg', completedOn:'ff', userIdWithStatus: 'tt', product:[], location: null};
  thereIsAlreadyOpenCart = false;
  //userId = this.AuthService.userId;
  userId = null;
  userIdsubscribtion= this.AuthService.userId.subscribe(resdata => {
    this.userId = resdata;
  })

  langugue: boolean ;
  subscription = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });


  private _shoppingCart = new BehaviorSubject<shoppingCart>(null);
   observablerFiredOnNewOrderSubmittion = new Subject;

  get shoppingCart(){
    return this._shoppingCart.asObservable();
  }

  calculateTotalForShoppingCart(){
    let total =0;
    this.shoppingCart.subscribe(shoppingCart =>{
      if(shoppingCart===null){
        return total;
      }
      let products = shoppingCart.product;
    for(const Key in products){
      const sum= products[Key].price * +products[Key].catagory;
      total = total + sum;
    }
    })
    return total;
  }





  constructor(private menuService: MenuServiceService, public toastController: ToastController, private AuthService:AuthService, private httpService:HttpClient) { }


  addItemToCart(userId:string,product:Product, quantity:number){
    if(product.discount == true){
      product.price = product.discountPrice;
    }
        //check if there is opencart if yes return it else create new cart
        //update database


    if(this.thereIsAlreadyOpenCart){
      //console.log('retriving old shopping cart from application')
      return this.shoppingCart.pipe(
        take(1),
        tap(shoppingCart => {
          //product.catagory= quantity.toString();

          if(shoppingCart.product.some(pro => pro.id === product.id)){
            const int= shoppingCart.product.findIndex(pro => pro.id === product.id)
            if((+shoppingCart.product[int].catagory + quantity > 2) && product.quaLeft){
              //console.log("to much orders 1");
              this.presentToastTwoMuch();
            }else{
              this.presentToast();
              shoppingCart.product[int].catagory = (+shoppingCart.product[int].catagory + quantity).toString();
            }
            //console.log("old 1");
          }else{
            //console.log("new 1");
            if(!product.quaLeft){
              this.presentToast();
              product.catagory= quantity.toString();
              shoppingCart.product = shoppingCart.product.concat(product);
            } else{
              if(quantity <3){
                this.presentToast();
                product.catagory= quantity.toString();
                shoppingCart.product = shoppingCart.product.concat(product);
              }else{
                this.presentToastTwoMuch();
              }
            }



          }
          //console.log(shoppingCart.product);
          this._shoppingCart.next(shoppingCart);
          this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${shoppingCart.cartId}.json`,this.currentShoppingCart).subscribe();


        })
      )
    }else {
      //console.log("222");
      //console.log('no open cart found in appliaction will start searchin database')





      const test = this.userId + '_' + 'notCompleted';
      return this.httpService.get(`https://twiick-default-rtdb.firebaseio.com/shoppingCart.json?orderBy="userIdWithStatus"&equalTo="${test}"&print=pretty`).pipe(
        take(1),
        tap(
        data => {
          //console.log(data);
          //for (const key in data){
            if(Object.keys(data).length === 0){
              this.currentShoppingCart.product = [];
            //console.log('no opencart found in database will create new one')

            product.catagory = quantity.toString();

            this.currentShoppingCart.userId= this.userId;
            this.currentShoppingCart.completedOn= null;
            this.currentShoppingCart.status="notCompleted";
            this.currentShoppingCart.userIdWithStatus = this.userId + "_" + "notCompleted";
            this.currentShoppingCart.cartId = null;
            if(quantity < 3 ){
              this.currentShoppingCart.product.push(product);
              this.presentToast();
            }else{
              if(!product.quaLeft){
                this.currentShoppingCart.product.push(product);
                this.presentToast();
              }else{
                this.presentToastTwoMuch();
              }
            }
            //this.currentShoppingCart.product.push(product);
            //console.log( 'new', this.currentShoppingCart);
            this.thereIsAlreadyOpenCart = true;
            this.httpService.post<{ [key: string] : any}>('https://twiick-default-rtdb.firebaseio.com/shoppingCart.json',this.currentShoppingCart).subscribe(data => {
              //for(const key in data){
              this.currentShoppingCart.cartId = data.name;
              //console.log(data, data.name,"test");
              //}
              this._shoppingCart.next(this.currentShoppingCart);
            });


          }else {
            //console.log('opencart foound in database')

            this.thereIsAlreadyOpenCart= true;


            for(const key in data ){

              if(data[key].product.some(pro => pro.id === product.id)){
                const int= data[key].product.findIndex(pro => pro.id === product.id)
                if((+data[key].product[int].catagory + quantity)>2 && product.quaLeft){
                  this.presentToastTwoMuch();
                }else{
                  data[key].product[int].catagory = (+data[key].product[int].catagory + quantity).toString();
                  this.presentToast();
                  //console.log("old 2", data[key].product[int].catagory);
                }

              }else{
                //console.log("new 2");
                product.catagory= quantity.toString();
                if(+quantity> 2 && product.quaLeft){
                  this.presentToastTwoMuch();
                }else{
                  this.presentToast();
                  data[key].product = data[key].product.concat(product);
                }
              }


            this.currentShoppingCart.userId= data[key].userId;
            this.currentShoppingCart.completedOn= data[key].completedOn;
            this.currentShoppingCart.status="notCompleted";
            this.currentShoppingCart.userIdWithStatus = data[key].userId + "_" + "notCompleted";
            this.currentShoppingCart.cartId = key;
            this.currentShoppingCart.product = data[key].product;
            //console.log("old", this.currentShoppingCart);
            this._shoppingCart.next(this.currentShoppingCart);
            this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${key}.json`,this.currentShoppingCart).subscribe();

          }
        }

        }
        ));





      }


  }

  gettingAllOrders(){
    //console.log(this.userId,"from gettingallorders");
    const test = this.userId + '_' + 'completed';
    return this.httpService.get(`https://twiick-default-rtdb.firebaseio.com/shoppingCart.json?orderBy="userIdWithStatus"&equalTo="${test}"&print=pretty`).pipe(
      take(1));

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

  async presentToastTwoMuch() {
    let text;
    if(this.langugue){
      text = 'الحد الاقصي حبتين للمنجات تحت العرض';
    }else {
      text= "Maximum of two pieces are allowed from items under promotion";
    }
    const toast = await this.toastController.create({
      message:text,
      duration: 1000,
    });
    toast.present();
  }

  gettingAllOrdersForUs(){
    //console.log(this.userId,"from gettingallorders");
    const test = this.userId + '_' + 'completed';
    return this.httpService.get("https://twiick-default-rtdb.firebaseio.com/ordersPlaced.json").pipe(
      take(1));
  }



  getOrderById(id:string){
    return this.httpService.get<shoppingCart>(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${id}.json`).pipe(
      take(1));

  }

  getOrderByIdForUs(id:string){
    return this.httpService.get<any>(`https://twiick-default-rtdb.firebaseio.com/ordersPlaced/${id}.json`).pipe(
      take(1));

  }


  updateStatues(myOrder: any,statusForCustomer:string, completedOnBeforeSplit: string){
    myOrder.status = statusForCustomer;
    myOrder.completedOn = completedOnBeforeSplit;
    //console.log(myOrder);

    return this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/ordersPlaced/${myOrder.cartId}.json`,myOrder).pipe(
      take(1));;



  }

  updateStatuesForCustomer(myOrder: any, statusForCustomer:string){
    return this.httpService.patch(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${myOrder.cartId}.json`,{status: statusForCustomer}).pipe(
      take(1));;
  }

  clearShoppingCart(){
    this._shoppingCart.next(null);
    this.thereIsAlreadyOpenCart = false;
  }

  itiateShoppinintgCart(){

    let userId=null;
    this.AuthService.userId.subscribe(data =>{
      userId=data;
    })
    //console.log("222");
    //console.log('no open cart found in appliaction will start searchin database')

    const test = this.userId + '_' + 'notCompleted';
    return this.httpService.get(`https://twiick-default-rtdb.firebaseio.com/shoppingCart.json?orderBy="userIdWithStatus"&equalTo="${test}"&print=pretty`).pipe(
      take(1),
      tap(
      data => {
        //console.log(data);
        //for (const key in data){
          if(Object.keys(data).length === 0){
          //console.log('no opencart found in database will create new one')
        }else {
          //console.log('opencart foound in database')

          this.thereIsAlreadyOpenCart= true;
          for(const key in data ){
          this.currentShoppingCart.userId= data[key].userId;
          this.currentShoppingCart.completedOn= data[key].completedOn;
          this.currentShoppingCart.status="notCompleted";
          this.currentShoppingCart.userIdWithStatus = data[key].userId + "_" + "notCompleted";
          this.currentShoppingCart.cartId = key;
          this.currentShoppingCart.product = data[key].product;
          //console.log("old", this.currentShoppingCart);
          this._shoppingCart.next(this.currentShoppingCart);

        }
      }

      }
      ));






  }



  updateCart(id:number, newQuantity:string){
    return this.shoppingCart.pipe(
      take(1),
      tap(shoppingCart => {
        //product.catagory= quantity.toString();
        if(+newQuantity === 0){
          //console.log("zero");
          shoppingCart.product.splice(id, 1);
        }else{
          if(+newQuantity >2 &&  shoppingCart.product[id].quaLeft){
            this.presentToastTwoMuch();
          }else{
            shoppingCart.product[id].catagory = newQuantity;
          }
          //console.log("reduce");
          //product[id].catagory= quantity.toString();
        }
        //console.log(shoppingCart.product);
        this._shoppingCart.next(shoppingCart);
        this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${shoppingCart.cartId}.json`,this.currentShoppingCart).subscribe();

      }));

    }

  ChangeDeliveryStatus(status: boolean){
      return this.shoppingCart.pipe(
        take(1),
        tap(shoppingCart => {
          //product.catagory= quantity.toString();
          shoppingCart.deliveryAdded = status;
          this._shoppingCart.next(shoppingCart);
          this.httpService.put(`https://twiick-default-rtdb.firebaseio.com/shoppingCart/${shoppingCart.cartId}.json`,this.currentShoppingCart).subscribe();
        }));

      }



}
