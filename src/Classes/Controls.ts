import { COLORS } from "../types";
import dat from 'dat.gui'

export class State {
  public state = {
    MIN_DIST: 1.9,
    DENSITY: 200,
    COLOR: "original" as COLORS,
    SIZE: 1,
    UNEAZYRANGE: 2,
    INTERACTION: false,
    UNEASY: false,
    DEFORMITY_X: 0,
    DEFORMITY_Y: 0,
  }
  gui = new dat.GUI()
  private subscribers: Array<(state: typeof this.state) => void> = []
  constructor(){
    this.gui.add(this.state, "COLOR", ["black", "invert", "original", "grayscale"]).listen().onChange(() => this.notify())
    this.gui.add(this.state, "SIZE", 1,6, 0.5).listen().onChange( () => this.notify())
    this.gui.add(this.state, "DENSITY", 180 , 300, 20).listen().onChange( () => this.notify())
    this.gui.add(this.state, "MIN_DIST", 1.9 , 10, 0.2).listen().onChange( () => this.notify()) 
    this.gui.add(this.state, "INTERACTION").listen().onChange( () => this.notify()) 
    this.gui.add(this.state, "UNEASY").listen().onChange( () => this.notify()) 
    this.gui.add(this.state, "UNEAZYRANGE", 1 , 10, 1).listen().onChange( () => this.notify()) 
    this.gui.add(this.state, "DEFORMITY_X", 0 , 50, 1).listen().onChange( () => this.notify()) 
    this.gui.add(this.state, "DEFORMITY_Y", 0 , 50, 1).listen().onChange( () => this.notify()) 
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