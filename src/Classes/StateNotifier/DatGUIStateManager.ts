import { ALGORITHM, COLORS } from '../../types'
import { StateNotifier } from './StateNotifier'
// @ts-ignore
import dat from 'dat.gui'

export class DatGuiStateNotifier extends StateNotifier {
    gui = new dat.GUI()
    init(): void {
        // this.gui.add(this.actions, 'loadFile').name('Upload Your Image')
        this.gui.add(this.stateManager.state, 'COLOR', ['black', 'invert', 'original', 'grayscale', 'custom']).onChange(
            (value: COLORS) => this.stateManager.set('COLOR', value)
        ).name('Dot Color')
        this.gui.add(this.stateManager.state, 'ALGORITHM', ['grid', 'random', 'poisson']).onChange(
            (value: ALGORITHM) => this.stateManager.set('ALGORITHM', value)
        ).name('Sampling Algorithm')
        this.gui.add(this.stateManager.state, 'SIZE', 0,100, 1).onChange( (size: number) => this.stateManager.set('SIZE', size)).name('Dot Size')
        this.gui.addColor(this.stateManager.state, 'BG_COLOR').onChange((color: string) => this.stateManager.set('BG_COLOR', color)).name('Background Color')
        this.gui.addColor(this.stateManager.state, 'DOT_COLOR').onChange((color: string) => this.stateManager.set('DOT_COLOR', color)).name('Dots Custom Color')
        this.gui.add(this.stateManager.state, 'DENSITY', 1.5 , 150, 0.2).onChange( (density: number) => this.stateManager.set('DENSITY', density)).name('Density')
        this.gui.add(this.stateManager.state, 'MOVE_HORIZENTAL', 0 , 5000, 1).onChange( (val: number) => this.stateManager.set('MOVE_HORIZENTAL', val)).name('Move Horizental') 
        this.gui.add(this.stateManager.state, 'MOVE_VERTICAL', 0 , 5000, 1).onChange( (val: number) => this.stateManager.set('MOVE_VERTICAL', val)).name('Move Vertical') 
        this.gui.add(this.actions, 'exportJPG').name('Export JPG')
        this.gui.add(this.actions, 'exportPNG').name('Export PNG')
        this.gui.add(this.actions, 'exportSVG').name('Export SVG')
    }
}