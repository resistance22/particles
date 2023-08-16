export class Color {
  constructor(public r: number, public g: number ,public b: number){}
  getGrayScale(){
    return 0.21 * this.r + 0.72 * this.g + 0.07 * this.b
  }
}