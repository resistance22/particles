import type { interactiveData } from "./Classes/App"
import { App } from "./Classes/App"
import { Color } from "./Classes/Color";
import { Pixel } from "./Classes/Pixel";
import { Particle } from "./Classes/Shapes/Particle";
import { State } from "./Classes/Controls";
import { Vector2 } from "./Classes/Vector2";
// @ts-ignore
import PoissonDiskSampling from "poisson-disk-sampling"
import "./style.css"


let URL: string | null = null

const appState = new State()
let controls = appState.subscribableStates


function getImageData(ctx:CanvasRenderingContext2D ,canvas:HTMLCanvasElement  ,url: string, callback: (data: ImageData) => void) {
    // load an image, draw it on a canvas, retrieve the pixel values / image data
    // see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
    const img = new Image();
    img.onload = function () {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const scale = img.width / img.height
      if(img.height < canvas.height){
        canvas.height = img.height
      }
      
      const height = canvas.height
      const width  = canvas.height * scale
      canvas.width = width
      ctx.drawImage(
        img, 
        0,
        0, 
        img.width, 
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      )
      const imageData = ctx.getImageData(0, 0, width - 2, height - 2)
      appState.setIMG(img)



      callback(imageData)
    }
    img.src = url
    ctx.clearRect(0,0,canvas.width, canvas.height)
  }


let sample:Particle[] = []



const drawFN = (time: number, ctx:CanvasRenderingContext2D, _canvas: HTMLCanvasElement, data: interactiveData)=> {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  ctx.fillStyle = controls.BG_COLOR
  ctx.fillRect(0, 0, _canvas.width, _canvas.height)
  if(sample.length > 0){
    for(let i = 0; i < sample.length; i++){
      sample[i].draw(time / 500, data, controls.INTERACTION, controls.UNEASY, controls.UNEAZYRANGE)
    }
  }
}




const setup = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  if(URL){
    getImageData(ctx,canvas, URL, (imageData: ImageData) => {
      const pds = new PoissonDiskSampling({
        shape: [imageData.width, imageData.height],
        minDistance: controls.MIN_DIST,
        maxDistance: 55,
        tries: 10,
        distanceFunction: function (point: any) {
          // get the index of the red pixel value for the given coordinates (point)
          var Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4;
          var Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1;
          var Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2;
          const color = new Color(
            imageData.data[Rindex],
            imageData.data[Gindex],
            imageData.data[Bindex]
          )
          // map the value to 0-1 and apply Math.pow for flavor
          return Math.pow(color.getGrayScale() / controls.DENSITY, 2.7);
        }
      });
      const points = pds.fill()
      const selectedPixesl: Particle[] = []


      for(let i =0; i < points.length; i++){
        const point = points[i]
        var Rindex = (Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4;
        var Gindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 1;
        var Bindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 2;
        var Aindex = ((Math.round(point[0]) + Math.round(point[1]) * imageData.width) * 4) + 3;
        const pixel = new Pixel(
          point[0],
          point[1],
          imageData.data[Rindex],
          imageData.data[Gindex],
          imageData.data[Bindex],
          imageData.data[Aindex]
        )
        const particle = new Particle(
          controls.SIZE,
          pixel,
          controls.COLOR,
          controls.DOT_COLOR,
          ctx,
          new Vector2(0,0),
          new Vector2(0,0),
          controls.MOVE_HORIZENTAL,
          controls.MOVE_VERTICAL,
        ) 
        selectedPixesl.push(particle)
      }
      sample = selectedPixesl
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App("app", drawFN, true)
  const uploadBTN = document.querySelector<HTMLInputElement>("#imagePicker")
  if(uploadBTN){
    uploadBTN.onchange = function(e){
      e.preventDefault()
      //@ts-ignore
      const file = e.target.files[0]
      if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            // @ts-ignore
            URL= event.target.result;
            app.call(setup)
        };
        reader.readAsDataURL(file);
    }
    }
  }
  appState.subscribe(() => app.call(setup), ["MIN_DIST", "DOT_COLOR", "BG_COLOR", "COLOR", "DENSITY", "INTERACTION", "SIZE", "UNEASY", "UNEAZYRANGE"])
  appState.subscribe(() => {
    if(sample.length > 0){
      for(let i = 0; i < sample.length; i++){
        sample[i].setDeformityX(controls.MOVE_HORIZENTAL)
      }
    }
  }, ["MOVE_HORIZENTAL"])
  appState.subscribe(() => {
    if(sample.length > 0){
      for(let i = 0; i < sample.length; i++){
        sample[i].setDeformityY(controls.MOVE_VERTICAL)
      }
    }
  }, ["MOVE_VERTICAL"])
  app.start(setup)
})

