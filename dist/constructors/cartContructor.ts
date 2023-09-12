export class CartsContructor {
  _id: string;

  code: string;

  cartdata: {
    productname: string;
    productimage: string;
    productpromotion: Number;
    productprice: string;
    qty: Number;
  }[];

  createdAt: string;

  updatedAt: string;

  constructor(_id: string, code: string, cartdata: {
    productname: string,
    productimage: string,
    productpromotion: Number,
    productprice: string,
    qty: Number,
  }[], createdAt: string, updatedAt: string) {
    this._id = _id;
    this.code = code;
    this.cartdata = cartdata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  data() {
    const reslut = {
      _id: this._id,
      code: this.code,
      cartdata: this.cartdata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    return reslut;
  }
}