import './style.css'
import imageURL from '/sad.png'
import dat from 'dat.gui'
const {floor} = Math

type colors = "original" | "black" | "invert"

let controls = {
  speed: 400,
  density: 4,
  color: "original" as colors,
  size: 1
}

function getRandomInt(min: number, max:number) {
  return Math.floor(Math.random() * (max - min) + min);
}

class Pixel {
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
}


function getSelectedPixels(image: HTMLImageElement, canvas: HTMLCanvasElement, density:number = controls.density){
    const selectedPixels: Pixel[] = []
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, image.width, image.height)
    const pixels:Pixel[] = []

    // Convert points array to pixels array
    for(let i=0; i< data.data.length; i+=4){
      const pixelIndex = i / 4
      const x = pixelIndex + 1 - (floor(pixelIndex/data.width) * data.width)
      const y = floor(pixelIndex/data.width) + 1
      const r = data.data[i]
      const g = data.data[i + 1]
      const b = data.data[i + 2]
      const a = data.data[i + 3]
      pixels.push(
        new Pixel(
          x, 
          y,
          r,
          g,
          b,
          a
        )
      )
    }
    
    ctx.clearRect(0, 0 , canvas.width, canvas.height)
    let index = 0
    while (index < pixels.length){
      const particle = pixels[index]

      if(particle.getHSB()[2] < 75){
        selectedPixels.push(particle)
      }
      index += getRandomInt(1, density)
    } 
    return selectedPixels
}

const drawParticles = (
  pixels: Pixel[], 
  ctx: CanvasRenderingContext2D,
  color: "original" | "black" | "invert" = "original",
  size: number = 1
) => {
  ctx.clearRect(0, 0 , window.innerWidth, window.innerHeight)
  for(let i = 0; i< pixels.length; i++){
    const particle = pixels[i]
    if(color === "original"){
      ctx.fillStyle = `rgb(${particle.r}, ${particle.g}, ${particle.b})`
    }
    if(color === "black"){
      ctx.fillStyle = `black`
    }

    if(color === "invert"){
      ctx.fillStyle = `rgb(${255 - particle.r}, ${255 - particle.g}, ${255 - particle.b})`
    }
    
    ctx.fillRect( particle.x, particle.y, size, size)
  }
} 


function setup(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  const image = new Image();
  const canvas= document.getElementById("scene") as HTMLCanvasElement | null

  if(canvas ){
    setup(canvas)
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    let selectedPixels: Pixel[]
    image.onload = () => {
      selectedPixels = getSelectedPixels(image, canvas)
      drawParticles(selectedPixels, ctx, controls.color)
    }
    image.src = imageURL

    const gui = new dat.GUI()
    gui.add(controls, "density", 1 , 20, 1).listen().onChange( () => {
      selectedPixels = getSelectedPixels(image, canvas, controls.density)
      drawParticles(selectedPixels, ctx, controls.color, controls.size)
    })
    gui.add(controls, "color", ["black", "invert", "original"]).listen().onChange( () => {
      drawParticles(selectedPixels, ctx, controls.color, controls.size)
    })
    gui.add(controls, "size", 1,10, 1).listen().onChange( () => {
      drawParticles(selectedPixels, ctx, controls.color, controls.size)
    })
  }
})
