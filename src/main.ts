import type { interactiveData } from "./Classes/App"
import { App } from "./Classes/App"
import { Color } from "./Classes/Color";
import { Pixel } from "./Classes/Pixel";
import PoissonDiskSampling from "poisson-disk-sampling"
import  imageURL from  "/sad.png"
import "./style.css"
import { Particle } from "./Classes/Shapes/Particle";
import { State } from "./Classes/Controls";
import { Vector2 } from "./Classes/Vector2";


interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

let URL = imageURL

const appState = new State()
let controls = appState.state

// const DIMENSIONS = 2
// const MIN_DIST = 15
// const CELL_SIZE = MIN_DIST / Math.sqrt(DIMENSIONS)
// const TRY_LIMITS = 20
// const COLSCOUNT = Math.floor(window.innerWidth / CELL_SIZE)
// const ROWSCOUNT = Math.floor(window.innerHeight / CELL_SIZE)
// // STEP 1
// const  grid= new Grid<Vector2 | null>(COLSCOUNT, ROWSCOUNT)
// const active: Vector2[] = []


// const generateRandomPoint = (colWidth: number, rowWidth: number) => {
//   return new Vector2(
//     generateRandomInt(0, colWidth) * MIN_DIST,
//     generateRandomInt(0, rowWidth) * MIN_DIST
//   )
// }



  // // STEP 2
  // const startPoint = generateRandomPoint(COLSCOUNT, ROWSCOUNT)
  // active.push(startPoint)

  // while (active.length > 0){
  //   const activeIndex = generateRandomInt(0, active.length -1)
  //   const point = active[activeIndex]
  //   let found = false

  //   for(let n = 0; n < TRY_LIMITS; n++){
  //     const newPoint = new Vector2(point.x, point.y)
  //     newPoint.setAngle(generateRandomNumber(0, 2 * Math.PI))
  //     newPoint.setLength(generateRandomNumber(20, 40))
  //     newPoint.add(point)

  //     const newPointCol = Math.floor(newPoint.x / CELL_SIZE)
  //     const newPointRow = Math.floor(newPoint.y / CELL_SIZE)
  //     if(newPointCol > 0 && newPointRow > 0 && newPointCol < COLSCOUNT && newPointRow < ROWSCOUNT && !grid.get(newPointCol, newPointRow)){
  //       let ok = true
  //       for(let i = -1; i<=1; i++){
  //         for(let j = -1; j<=1; j++){
  //           const neighbor = grid.get(newPointCol + i, newPointRow + j)
  //           if(neighbor){
  //             if(dist(neighbor, newPoint) < MIN_DIST){
  //               ok  = false
  //             }
  //           }
  //         }
  //       }
  //       if(ok){
  //         found = true
  //         grid.insert(newPointCol, newPointRow, newPoint)
  //         active.push(newPoint)
  //       }
  //     }
  //   }

  //   if(!found){
  //     active.splice(activeIndex, 1)
  //   }
  // }



    // for(let i =0; i < grid.array.length; i++){
  //   const point = grid.array[i]
  //   if(point){
  //     ctx.beginPath()
  //     ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);

  //     // ctx.fillStyle = `RGB(${generateRandomInt(0, 255)}, ${generateRandomInt(0, 255)}, ${generateRandomInt(0, 255)})`
  //     ctx.fill()
  //   }
  // }




  function getImageData(ctx:CanvasRenderingContext2D ,canvas:HTMLCanvasElement  ,url: string, callback: (data: ImageData) => void) {
    // load an image, draw it on a canvas, retrieve the pixel values / image data
    // see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      callback(ctx.getImageData(0, 0, img.width, img.height));
    }
    img.src = url
    ctx.clearRect(0,0,canvas.width, canvas.height)
  }


let sample:Particle[] = []



const drawFN = (time: number, ctx:CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: interactiveData)=> {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
  if(sample.length > 0){
    for(let i = 0; i < sample.length; i++){
      sample[i].draw(time / 500, data)
    }
  }
}




const setup = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  getImageData(ctx,canvas, URL, (imageData: ImageData) => {
    const pds = new PoissonDiskSampling({
      shape: [imageData.width, imageData.height],
      minDistance: controls.MIN_DIST,
      maxDistance: 55,
      tries: 10,
      distanceFunction: function (point) {
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
        ctx,
      ) 
      selectedPixesl.push(particle)
    }
    sample = selectedPixesl
  })
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
  appState.subscribe(() => app.call(setup))
  app.start(setup)
})

