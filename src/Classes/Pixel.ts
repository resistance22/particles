export class Pixel {
  constructor(
    public x: number, 
    public y: number, 
    public r: number, 
    public g:number,
    public b: number, 
    public a: number
  ){}
  getHSB(){
    let r = this.r/ 255;
    let g = this.g/ 255;
    let b = this.b /255;
    const v = Math.max(r, g, b),
      n = v - Math.min(r, g, b);
    const h =
      n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
  }

  getGrayScale(){
    return 0.21 * this.r + 0.72 * this.g + 0.07 * this.b
  }
}