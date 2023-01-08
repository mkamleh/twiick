import { Injectable } from '@angular/core';
import { Catagories } from './cat/Catagories.model';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Product } from './product.model';
import { BehaviorSubject } from 'rxjs';
import { link } from 'fs';
import { MenuServiceService } from './menu-service.service';

interface products{
  id:string;
  name: string;
  description: string;
  price: number;
  catagory:string;
  subcatagory: string
  picture: string;
  discount?: boolean;
  discountPrice?: number;
  offerQuntityLeft: number;
  quaLeft? : boolean;
  outOfStock?: boolean
  englishCat?: string;
  wholesalePrice?:string;
  offerDate?:string;
  inOfferArray?:boolean;
}

interface productsUp{
  name: string;
  description: string;
  price: number;
  catagory:string;
  subcatagory: string
  picture: string;
}

// interface arabicCat{
//   arabicName: string;
//   englishName: string;
// }

@Injectable({
  providedIn: 'root'
})
export class CatagoriesService {

  private _products = new BehaviorSubject<Product[]>([]);
  private products: productsUp[] =  [

    { description : '1', name: 'milk', picture: 'ggg',price: 2, catagory : 'drinks' , subcatagory: 'juices '} ,
    { description : '1', name: 'milk', picture: 'ggg',price: 2, catagory : 'cleaners' , subcatagory: 'house '} ,
    { description : '1', name: 'milk', picture: 'ggg',price: 2, catagory : 'choclate' , subcatagory: 'liquid '} ,
    { description : '1', name: 'milk', picture: 'ggg',price: 2, catagory : 'babies' , subcatagory: '4-6 '} ,
    { description : '1', name: 'milk', picture: 'ggg',price: 2, catagory : 'cans' , subcatagory: 'tuna '} ,
    { description : '1', name: 'milk', picture: 'ggg',price: 2, catagory : 'rice' , subcatagory: 'seeds '} ,
    { description : '1', name: 'milk', picture: 'ggg', price: 2, catagory : 'choclate' , subcatagory: 'solid '} ,
    { description : '2', name: 'bread', picture: 'ggg', price: 2, catagory : 'choclate' , subcatagory: ' gas'} ,
    { description : '3', name: 'drink', picture: 'ggg', price: 2, catagory : 'choclate' , subcatagory: 'plasma '} ,
    { description : '4', name: 'baby', picture: 'ggg', price: 2, catagory : 'babies' , subcatagory: ' old'} ,
    { description : '5', name: 'cleaners', picture: 'g', price: 2, catagory : 'babies' , subcatagory: ' vey old'} ,
    { description : '6', name: 'others', picture: 'ggg', price: 2, catagory : 'cans' , subcatagory: ' non-sea'}
  ]
  private catagories = [];
 // private arabicCat: arabicCat[] = [];
  private productsforEachCatagory = [];
  langugue: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.langugue = data;
  });
  //arabic:arabicCat = {arabicName: "hi", englishName:"hi"};

  //private catagoriesAndSubcatories


  constructor(private http:HttpClient, private menuService:MenuServiceService) { }

  updateProduct(product:any){
    let linkk = null;
    if(this.langugue == false){
       linkk = `https://twiick-default-rtdb.firebaseio.com/products/k/-MYEO4zWv2-aHjxujufO/${product.id}.json`;
    }else {
      linkk = `https://twiick-default-rtdb.firebaseio.com/products/k/arabicNewNew/${product.id}.json`;
    }

    return this.http.put(linkk,product)


  }

  addProduct(product:any){
    let linkk = null;
    if(this.langugue == false){
       linkk = `https://twiick-default-rtdb.firebaseio.com/products/k/-MYEO4zWv2-aHjxujufO/${product.id}.json`;
    }else {
      linkk = `https://twiick-default-rtdb.firebaseio.com/products/k/arabicNewNew.json`;
    }

    return this.http.put(linkk,product)


  }

  updateDeliveryOptionDelvery(deliveryOption: boolean){
    return this.http.put("https://twiick-default-rtdb.firebaseio.com/controlOptions/freeDeliveryUnder5.json", deliveryOption);
  }


  fetchProducts () {
    this.catagories = [];
    let linkk = null;
    if(this.langugue == false){
       linkk = 'https://twiick-default-rtdb.firebaseio.com/products/k/-MYEO4zWv2-aHjxujufO.json';
    }else {
      linkk = 'https://twiick-default-rtdb.firebaseio.com/products/k/arabicNewNew.json';
    }
    //console.log("1")
     return this.http.get<{[key:string]: products}>(linkk)
     .pipe(map(data => {
       const products = [];
       for(const key in data){
         if(data.hasOwnProperty(key)){
           //for(const key in data){
             //if(data.hasOwnProperty(key)){
               if(data[key] !== null){
                this.catagories.push(data[key].catagory);
                products.push(new Product(key, data[key].name, data[key].description,
                data[key].price, data[key].catagory, data[key].subcatagory, data[key].picture,data[key].discount, data[key].discountPrice, data[key].offerQuntityLeft,  data[key].quaLeft,
                 data[key].outOfStock,0,data[key].inOfferArray,data[key].wholesalePrice,data[key].offerDate));
               }

             //}
           //}
         }
       }
      // console.log(products,"productd frtch");
       return products;

     }),

    tap(products => {
      //console.log(this.catagories);
      //console.log('inside');
      this._products.next(products);
    })

     );
    //return [...this.Catagories];
  }

  getCatagories () {
   return [...new Set(this.catagories)];
   //return [...this.catagories];
 }

 updateOfferArray(offers: Product[]){
   return this.http.put("https://twiick-default-rtdb.firebaseio.com/offersArray.json",offers);
 }

 getOfferArray(){
  return this.http.get<Product[]>("https://twiick-default-rtdb.firebaseio.com/offersArray.json")
 }

    getOfferArray2(){
      return this.http.get<Product[]>("https://twiick-default-rtdb.firebaseio.com/offersArray.json")
      .pipe(
        map(data => {
          let str = JSON.stringify(data);
          console.log(str+ ";;;;");
        const products = [];
           for(const key in data){
             if(data.hasOwnProperty(key)){
               //for(const key in data){
                 //if(data.hasOwnProperty(key)){
                   if(data[key] !== null){
                    products.push(new Product(key, data[key].name, data[key].description,
                      data[key].price, data[key].catagory, data[key].subcatagory, data[key].picture,data[key].discount, data[key].discountPrice, data[key].offerQuntityLeft,  data[key].quaLeft,
                     data[key].outOfStock,0,data[key].inOfferArray,data[key].wholesalePrice,data[key].offerDate));

                     // products.push(data[key]);
                   }
              }
              console.log(products+ "loool2")
              return products;

            }
         }))

        }


 getProducts(){
  //this.fetchProducts ();
   return this._products.asObservable();
 }

  addtodata(){
    this.http.put('https://twiick-default-rtdb.firebaseio.com/products/-MVRtwkaxnhgHA9bX0bC.json',[...this.products]).subscribe();
  }

  getCatagoryItems(catagoryId: string){
    return {
      ...this.products.find(cat => {
       if( cat.catagory == catagoryId){

       }
    }
    )
  };
}
}
