import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Product } from 'src/app/product.model';
import { CatagoriesService } from 'src/app/catagories.service';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.scss'],
})
export class ModalPageComponent implements OnInit {

  name: string;
  description:string;
  price:number;
  picture:string;
  catagory:string;
  subcatagory:string;
  data:Product [];
  newProduct: Product;
  offerDate: string;

  constructor(public modalController: ModalController, private catagoriesSerive: CatagoriesService) { }

  ngOnInit() {}

  additem(){
    this.newProduct = JSON.parse(JSON.stringify(this.data[2]));
    this.newProduct.description = this.description;
    this.newProduct.catagory = this.catagory;
    this.newProduct.subcatagory = this.subcatagory;
    this.newProduct.name= this.name;
    this.newProduct.picture= this.picture;
    this.newProduct.price = this.price;
    this.newProduct.offerDate = this.offerDate;
    this.data.push(this.newProduct);

    //console.log(this.description, this.newProduct, this.data);


    this.catagoriesSerive.addProduct(this.data).subscribe(data => {
      //console.log("done");
      this.modalController.dismiss({
        'dismissed': true
      });
    })


  }

}
