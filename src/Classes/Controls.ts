import { COLORS } from "../types"
// @ts-ignore
import dat from 'dat.gui'
import { changeDpiDataUrl } from '../dpi'

type notifyFN<T> = (state: T) => void

type Subscribers<T extends object> = {
  [key in keyof T]: Array<notifyFN<T>>
}

export class State {
  public subscribableStates = {
    MIN_DIST: 1.9,
    DENSITY: 200,
    BG_COLOR: "#FFFFFF",
    DOT_COLOR: "#000000",
    COLOR: "original" as COLORS,
    SIZE: 1,
    UNEAZYRANGE: 2,
    INTERACTION: false,
    UNEASY: false,
    MOVE_HORIZENTAL: 0,
    MOVE_VERTICAL: 0,
  }
  public FnStates ={
    loadFile : function() { 
      const button = document.getElementById('imagePicker')
      if(button){
        button.click()
      }
    },
    exportToJPG : function() { 
      const canvas = document.querySelector("canvas")
      if(canvas){
        const canvasUrl = canvas.toDataURL('image/jpeg', 1)
        const createEl = document.createElement('a')
        createEl.href = canvasUrl;
        createEl.download = "download-this-canvas"
        createEl.click()
        createEl.remove()
      }
    },
  }
  gui = new dat.GUI()
  private subscribers:Subscribers<State["subscribableStates"]>  = Object.keys(this.subscribableStates).reduce((acc, key) => ({...acc, [key]: []}), {}) as Subscribers<State["subscribableStates"]>

  constructor(){
    this.gui.add(this.FnStates, 'loadFile').name('Upload Your Image')
    this.gui.add(this.subscribableStates, "COLOR", ["black", "invert", "original", "grayscale", "custom"]).onChange(() => this.notify("COLOR")).name("Dot Color")
    this.gui.addColor(this.subscribableStates, "BG_COLOR").onChange(() => this.notify("BG_COLOR")).name("Background Color")
    this.gui.addColor(this.subscribableStates, "DOT_COLOR").onChange(() => this.notify("DOT_COLOR")).name("Dots Custom Color")
    this.gui.add(this.subscribableStates, "SIZE", 0,100, 0.5).onChange( () => this.notify("SIZE")).name("Dot Size")
    // this.gui.add(this.subscribableStates, "DENSITY", 180 , 300, 20).onChange( () => this.notify()).name("Density")
    this.gui.add(this.subscribableStates, "MIN_DIST", 1.5 , 10, 0.2).onChange( () => this.notify("MIN_DIST")).name("Density") 
    this.gui.add(this.subscribableStates, "INTERACTION").onChange( () => this.notify("INTERACTION")).name("Interactive") 
    this.gui.add(this.subscribableStates, "UNEASY").onChange( () => this.notify("UNEASY")) .name("Uneaze")
    this.gui.add(this.subscribableStates, "UNEAZYRANGE", 1 , 10, 1).onChange( () => this.notify("UNEAZYRANGE")).name("Un Eeazy range")
    this.gui.add(this.subscribableStates, "MOVE_HORIZENTAL", 0 , 50, 1).onChange( () => this.notify("MOVE_HORIZENTAL")).name("Move Horizental") 
    this.gui.add(this.subscribableStates, "MOVE_VERTICAL", 0 , 50, 1).onChange( () => this.notify("MOVE_VERTICAL")).name("Move Vertical") 
    this.gui.add(this.FnStates, 'exportToJPG').name('Export to JPG')
  
  }

  subscribe(
    FN: (state: typeof this.subscribableStates) => void,
    states: Array<keyof State['subscribableStates']> = Object.keys(this.subscribableStates) as Array<keyof State['subscribableStates']>
  ){
    for(let i =0; i < states.length; i++){
      this.subscribers[states[i]].push(FN)
    }
  }
  notify(key: keyof State["subscribableStates"]){
      const functions = this.subscribers[key]
      for(let j = 0; j < functions.length; j++){
        functions[j](this.subscribableStates)
      }
  }
}