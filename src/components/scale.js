// scale.js
// Scale bar that lives on the side of the chart

import DOM from "../utils/DOM"
import yAxis from "./axis/yAxis"
import CEL from "./primitives/canvas"
import { drawTextBG } from "../utils/canvas"
import stateMachineConfig from "../state/state-scale"
import { InputController, } from "../input/controller"
import { copyDeep, uid } from '../utils/utilities'

import {
  NAME,
  ID,
  CLASS_DEFAULT,
  CLASS_UTILS ,
  CLASS_BODY,
  CLASS_WIDGETSG,
  CLASS_TOOLS,
  CLASS_MAIN,
  CLASS_TIME,
  CLASS_ROWS,
  CLASS_ROW,
  CLASS_CHART,
  CLASS_SCALE,
  CLASS_WIDGETS,
  CLASS_ONCHART,
  CLASS_OFFCHART,
} from '../definitions/core'

import { 
  YAXIS_TYPES,
  BUFFERSIZE
} from "../definitions/chart";

import { YAxisStyle } from "../definitions/style";
import { isArray } from "../utils/typeChecks"

export default class ScaleBar {

  #ID
  #name = "Y Scale Axis"
  #shortName = "scale"
  #mediator
  #options
  #parent
  #core
  #chart
  #target
  #yAxis
  #elScale
  #elScaleCanvas
  #elViewport

  #yAxisType = YAXIS_TYPES[0]  // default, log, percent

  #viewport
  #layerLabels
  #layerOverlays
  #layerCursor

  #cursorPos


  constructor (mediator, options) {

    this.#mediator = mediator
    this.#options = options
    this.#elScale = mediator.api.elements.elScale
    this.#chart = mediator.api.core.Chart
    this.#parent = mediator.api.parent
    this.#core = this.#mediator.api.core

    this.#options = options
    this.#ID = this.#options.offChartID || uid("TX_scale_")
    this.init()
  }

  log(l) { this.#mediator.log(l) }
  info(i) { this.#mediator.info(i) }
  warning(w) { this.#mediator.warn(w) }
  error(e) { this.#mediator.error(e) }

  get ID() { return this.#ID }
  get name() { return this.#name }
  get shortName() { return this.#shortName }
  get mediator() { return this.#mediator }
  get options() { return this.#options }
  set height(h) { this.setHeight(h) }
  get height() { return this.#elScale.clientHeight }
  get width() { return this.#elScale.clientWidth }
  get yAxisHeight() { return this.#yAxis.height }
  get yAxisRatio() { return this.#yAxis.yAxisRatio }
  get layerLabels() { return this.#layerLabels }
  get layerOverlays() { return this.#layerOverlays }
  set yAxisType(t) { this.#yAxisType = YAXIS_TYPES.includes(t) ? t : YAXIS_TYPES[0] }
  get yAxisType() { return this.#yAxisType }
  get yAxisGrads() { return this.#yAxis.yAxisGrads }
  get viewport() { return this.#viewport }
  get pos() { return this.dimensions }
  get dimensions() { return DOM.elementDimPos(this.#elScale) }
  get theme() { return this.#core.theme }
  get config() { return this.#core.config }

  init() {
    this.mount(this.#elScale)

    this.yAxisType = this.options.yAxisType

    this.log(`${this.#name} instantiated`)
  }


  start(data) {
    this.emit("started",data)

    this.#yAxis = new yAxis(this, this, this.yAxisType)

    // prepare layered canvas
    this.createViewport()
    // draw the scale
    this.draw()

    // set up event listeners
    this.eventsListen()

    // start State Machine 
    const newConfig = copyDeep(stateMachineConfig)
    newConfig.context.origin = this
    this.mediator.stateMachine = newConfig
    this.mediator.stateMachine.start()
  }

  end() {
    // this.off(`${this.#parent.ID}_mousemove`, (e) => { this.offMouseMove(e) })
    // this.off(`${this.#parent.ID}_mouseout`, (e) => { this.offMouseMove(e) })
    // this.off("chart_pan", (e) => { this.drawCursorPrice() })
    // this.off("chart_panDone", (e) => { this.eraseCursorPrice() })
  }

  eventsListen() {
    let canvas = this.#viewport.scene.canvas
    // create controller and use 'on' method to receive input events 
    const controller = new InputController(canvas);

    this.on(`${this.#parent.ID}_mousemove`, (e) => { this.onMouseMove(e) })
    this.on(`${this.#parent.ID}_mouseout`, (e) => { this.eraseCursorPrice() })
    // this.on("chart_pan", (e) => { this.drawCursorPrice() })
    // this.on("chart_panDone", (e) => { this.drawCursorPrice() })
    // this.on("resizeChart", (dimensions) => this.onResize.bind(this))
  }

  on(topic, handler, context) {
    this.mediator.on(topic, handler, context)
  }

  off(topic, handler) {
    this.mediator.off(topic, handler)
  }

  emit(topic, data) {
    this.mediator.emit(topic, data)
  }

  onResize(dimensions) {
    this.setDimensions(dimensions)
  }

  onMouseMove(e) {
    this.#cursorPos = (isArray(e)) ? e : [Math.floor(e.position.x), Math.floor(e.position.y)]
    this.drawCursorPrice()
  }

  mount(el) {
    el.innerHTML = this.defaultNode()

    this.#elViewport = el.querySelector(`.viewport`)
  }

  setHeight(h) {
    this.#elScale.style.height = `${h}px`
  }

  setDimensions(dim) {
    const width = this.#elScale.clientWidth
    this.#viewport.setSize(width, dim.h)
    // adjust layers
    this.#layerLabels.setSize(width, dim.h)
    this.#layerOverlays.setSize(width, dim.h)
    this.#layerCursor.setSize(width, dim.h)

    this.setHeight(dim.h)
    this.draw(undefined, true)
  }

  defaultNode() {
    const api = this.mediator.api
    const node = `
      <div class="viewport"></div>
    `
    return node
  }

  // -----------------------

  // convert chart price or offchart indicator y data to pixel pos
  yPos(yData) { return this.#yAxis.yPos(yData) }

  // convert pixel pos to chart price
  yPos2Price(y) { return this.#yAxis.yPos2Price(y) }

  nicePrice($) {
    let digits = this.#yAxis.countDigits($)
    return this.#yAxis.limitPrecision(digits)
  }

  // create canvas layers with handling methods
  createViewport() {

    const width = this.#elScale.clientWidth
    const height = this.#elScale.clientHeight
    const layerConfig = { 
      width: width, 
      height: height
    }

    // create viewport
    this.#viewport = new CEL.Viewport({
      width: this.#elScale.clientWidth,
      height: this.#elScale.clientHeight,
      container: this.#elViewport
    });

    // create layers - labels, overlays, cursor
    this.#layerLabels = new CEL.Layer(layerConfig);
    this.#layerOverlays = new CEL.Layer(layerConfig);
    this.#layerCursor = new CEL.Layer();

    // add layers
    this.#viewport
          .addLayer(this.#layerLabels)
          .addLayer(this.#layerOverlays)
          .addLayer(this.#layerCursor);
  }

  draw() {
    this.#yAxis.draw()
    this.#viewport.render()
  }

  drawCursorPrice() {
    let [x, y] = this.#cursorPos,
        price =  this.yPos2Price(y),
        nice = this.nicePrice(price),

        options = {
          fontSize: YAxisStyle.FONTSIZE * 1.05,
          fontWeight: YAxisStyle.FONTWEIGHT,
          fontFamily: YAxisStyle.FONTFAMILY,
          txtCol: YAxisStyle.COLOUR_CURSOR,
          bakCol: YAxisStyle.COLOUR_CURSOR_BG,
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 3,
          paddingRight: 3
        },
        
        height = options.fontSize + options.paddingTop + options.paddingBottom,
        yPos = y - (height * 0.5);

    this.#layerCursor.scene.clear()
    const ctx = this.#layerCursor.scene.context
    ctx.save()

    ctx.fillStyle = options.bakCol
    ctx.fillRect(1, yPos, this.width, height)

    drawTextBG(ctx, `${nice}`, 1, yPos , options)

    ctx.restore()
    this.#viewport.render()
  }

  eraseCursorPrice() {
    this.#layerCursor.scene.clear()
    this.#viewport.render()
    return
  }

  resize(width=this.width, height=this.height) {
    // adjust partent element
    this.setDimensions({w: width, h: height})
    // // adjust layers
    // width -= this.#elScale.clientWidth
    // this.#layerCursor.setSize(width, height)
    // // adjust width for scroll buffer
    // const buffer = this.config.buffer || BUFFERSIZE
    //       width = Math.round(width * ((100 + buffer) * 0.01))
    // this.#layerLabels.setSize(width, height)
    // this.#layerOverlays.setSize(width, height)
    // // render
    // this.draw(undefined, true)
  }

}
