export type interactiveData = {
  mouseX: number
  mouseY: number
}

type drawFNType = (time: number,context: CanvasRenderingContext2D, canvas: HTMLCanvasElement,data:interactiveData )=>void
type initFNType = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement)=>void
export class App{
  public canvas: HTMLCanvasElement
  public container: HTMLElement
  private loopRunning: boolean
  private FRAMES_PER_SECOND = 10000
  private FRAME_MIN_TIME = (1000/60) * (60 / this.FRAMES_PER_SECOND) - (1000/60) * 0.5
  private lastFrameTime = 0
  private context:CanvasRenderingContext2D
  constructor(
    containerID: string, 
    public drawFN: drawFNType, 
    startLoop: boolean = true,
    private mouseX: number = 0,
    private mouseY: number =0
  ){
    const containerElem: HTMLCanvasElement | null = document.querySelector(`#${containerID}`)
    if(!containerElem){
      throw new Error("No Container Found!")
    }
    this.container = containerElem
    this.canvas = document.createElement("canvas")
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.offsetX
      this.mouseY = e.offsetY
    })
    const context = this.canvas.getContext("2d")
    if(!context){
      throw new Error("Can't create context!")
    }
    this.context = context
    this.loopRunning = startLoop
  }

  update = (time: number) => {
    if(time - this.lastFrameTime < this.FRAME_MIN_TIME){ 
        if(this.loopRunning){
          requestAnimationFrame(this.update)
        }
        return
    }
    this.lastFrameTime = time; 
    this.drawFN(time, this.context, this.canvas, {
      mouseX: this.mouseX,
      mouseY: this.mouseY
    })
    if(this.loopRunning){
      requestAnimationFrame(this.update)
    }
  }

  startLoop = () => {
    this.loopRunning = true
    requestAnimationFrame(this.update)
  }

  stopLoop = () => {
    this.loopRunning = false
  }

  start = (
    initiFN: initFNType = () => {}
  ) => {
    this.canvas.setAttribute("id", "scene")
    this.container.appendChild(this.canvas)
    initiFN(this.context, this.canvas)
    if(this.loopRunning){
      this.startLoop()
    }
  }

  call = (
    FN: initFNType
  ) => {
    FN(this.context, this.canvas)
  }
}