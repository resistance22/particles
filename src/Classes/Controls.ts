import { COLORS } from "../types";
import dat from 'dat.gui'

export class State {
  public state = {
    MIN_DIST: 1.9,
    DENSITY: 200,
    BG_COLOR: "#FFFFFF",
    COLOR: "original" as COLORS,
    SIZE: 1,
    UNEAZYRANGE: 2,
    INTERACTION: false,
    UNEASY: false,
    MOVE_HORIZENTAL: 0,
    MOVE_VERTICAL: 0,
    loadFile : function() { 
      const button = document.getElementById('imagePicker')
      if(button){
        button.click()
      }
    }

  }
  gui = new dat.GUI()
  private subscribers: Array<(state: typeof this.state) => void> = []
  constructor(){
    this.gui.add(this.state, "COLOR", ["black", "invert", "original", "grayscale"]).listen().onChange(() => this.notify()).name("Dot Color")
    this.gui.addColor(this.state, "BG_COLOR").listen().onChange(() => this.notify()).name("Background Color")
    this.gui.add(this.state, "SIZE", 0,100, 0.5).listen().onChange( () => this.notify()).name("Dot Size")
    this.gui.add(this.state, "DENSITY", 180 , 300, 20).listen().onChange( () => this.notify()).name("Density")
    this.gui.add(this.state, "MIN_DIST", 1.9 , 10, 0.2).listen().onChange( () => this.notify()).name("Minimum distance") 
    this.gui.add(this.state, "INTERACTION").listen().onChange( () => this.notify()).name("Interactive") 
    this.gui.add(this.state, "UNEASY").listen().onChange( () => this.notify()) .name("Uneaze")
    this.gui.add(this.state, "UNEAZYRANGE", 1 , 10, 1).listen().onChange( () => this.notify()).name("Un Eeazy range")
    this.gui.add(this.state, "MOVE_HORIZENTAL", 0 , 50, 1).listen().onChange( () => this.notify()).name("Move Horizental") 
    this.gui.add(this.state, "MOVE_VERTICAL", 0 , 50, 1).listen().onChange( () => this.notify()).name("Move Vertical") 
    this.gui.add(this.state, 'loadFile').name('Upload Your Image');
  }

  subscribe(
    FN: (state: typeof this.state) => void
  ){
    this.subscribers.push(FN)
  }
  notify(){
    for(let i = 0; i< this.subscribers.length; i++ ){
      const fn = this.subscribers[i]
      fn(this.state)
    }
  }
  
}