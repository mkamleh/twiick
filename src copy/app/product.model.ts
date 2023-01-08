export class Product {
  constructor(
  public id:string,
  public name: string,
  public description: string,
  public price: number,
  public catagory:string,
  public subcatagory: string,
  public picture: string,
  public discount: boolean = false,
  public discountPrice : number = 0,
  public offerQuntityLeft = 0,
  public quaLeft: boolean = false,
  public outOfStock: boolean = false,
  public total: number = 0,
  public inOfferArray:boolean = false,
  public wholesalePrice?:string,
  public offerDate?:string
  ) {}
}
