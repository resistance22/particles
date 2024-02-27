import type { ALGORITHM, COLORS } from './types'
import { App } from './Classes/App'
import './style.css'
import { StateManager } from './Classes/StateManager'
import { DatGuiStateNotifier } from './Classes/StateNotifier/DatGUIStateManager'

const initialState = {
    MIN_DIST: 1.9,
    DENSITY: 1.9,
    BG_COLOR: '#FFFFFF',
    DOT_COLOR: '#000000',
    COLOR: 'original' as COLORS,
    SIZE: 1,
    ALGORITHM: 'grid' as ALGORITHM,
    UNEAZYRANGE: 2,
    INTERACTION: false,
    UNEASY: false,
    MOVE_HORIZENTAL: 0,
    MOVE_VERTICAL: 0,
}

export type AppState = typeof initialState

document.addEventListener('DOMContentLoaded', () => {
    const uploadBTN = document.querySelector<HTMLInputElement>('#imagePicker')
    const setTextBTN = document.querySelector<HTMLDivElement>('#draw-text')
    const textInput = document.querySelector<HTMLInputElement>('#text-input')

    
    const app = new App('#app')
    const actions = {
        loadFile : () => {
            if(uploadBTN){
                uploadBTN.click()
            }
        },
        exportJPG: () => {
            app.exportJPG()       
        },
        exportPNG: () => {
            app.exportPNG()
        },
        exportSVG: () => {
            app.exportSVG()
        }
    }
    const stateManager = new StateManager(initialState)
    stateManager.subscribe(app.setParticleRadius, 'SIZE')
    stateManager.subscribe(app.setCanvasBG, 'BG_COLOR')
    stateManager.subscribe(app.redraw, 'DENSITY')
    stateManager.subscribe(app.redraw, 'ALGORITHM')
    stateManager.subscribe(app.setVerticalDeformity, 'MOVE_VERTICAL')
    stateManager.subscribe(app.setHorizentalDeformity, 'MOVE_HORIZENTAL')
    stateManager.subscribe(app.setDotColorMode, 'COLOR')
    stateManager.subscribe(app.setDotColorMode, 'DOT_COLOR')
    
    const datGUIStateNotifier = new DatGuiStateNotifier(
        stateManager,
        actions
    )


    datGUIStateNotifier.init()

    app.init()
    const reader = new FileReader()
    reader.onload = function (event) {
        const target = event.target 
        if(!target){
            return
        }
        app.goToImageUploadedState(event.target.result as string, stateManager.state)
    }

    if(uploadBTN){
        uploadBTN.onchange = function(e){
            e.preventDefault()
            const target = e.target as HTMLInputElement
            if(!target){
                return
            }
            if(!target.files){
                return
            }
            const file = target.files[0]
            if (file) {
                reader.readAsDataURL(file)
            }
        }
    }
    if(setTextBTN){
        setTextBTN.addEventListener('click', () => {
            if(textInput){
                if(textInput.value){
                    app.goToImageUploadedState(textInput.value, stateManager.state)
                }
            }
        })
    }

})

