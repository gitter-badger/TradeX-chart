// stateMachine.js
// a simple Finite State Machine

import { isArray, isFunction, isObject, isString } from "../utils/typeChecks"
import { isArrayEqual } from "../utils/utilities"

export default class StateMachine {

  #id
  #state
  #statePrev
  #context
  #config
  #mediator
  #status = "stopped"
  #event
  #actions
  #statuses = ["await", "idle", "running", "stopped"]

  constructor(config, mediator) {
    this.#id = config.id
    this.#config = config
    this.#state = config.initial
    this.#context = config.context
    this.#actions = config.actions
    this.#mediator = mediator

    if (!StateMachine.validateConfig) return false

    this.#subscribe()
  }

  get id() { return this.#id }
  get state() { return this.#state }
  get previousSate() { return this.#statePrev }
  get context() { return this.#context }
  get mediator() { return this.#mediator }
  get status() { return this.#status }
  get event() { return this.#event }
  get actions() { return this.#actions }

  notify(event, data) {
    this.#event = event
    const currStateConfig = this.#config.states[this.#state]
      let destTransition = currStateConfig.on[event]
    if ( !destTransition 
      || !isFunction(destTransition.action)
      || this.#status !== "running") {
      return false
    }
    const destState = destTransition.target
    const destStateConfig = this.#config.states[destState]

    currStateConfig?.onExit(this, data)
    destTransition.action(this, data)

    this.#statePrev = this.#state
    this.#state = destState

    destStateConfig?.onEnter(this, data)

    // null event - immediately transition (transient transition)
    if ( this.#config.states[destState]?.on
      && (this.#config.states[destState].on[''] 
      || this.#config.states[destState].on?.always) ) {

        const transient
          = this.#config.states[destState].on[''] 
          || this.#config.states[destState].on.always

        // Do we have an array of conditions to check?
        if (isArray(transient)) {
          for (let transition of transient) {
            let cond = transition?.condition.type || transition?.condition || false
            if (
                this.condition(cond, null, {cond}) 
                && isString(transition.target)
              ) {
              transition?.action(this, data)
              this.#statePrev = this.#state
              this.#state = transition?.target
              this.notify(null, null)
            }
          }
        }
        // otherwise if only one condition
        else if (isObject(transient) && isString(transient.target)) {
          let cond = transient?.condition.type || transient?.condition || false
          if (
              this.condition(cond, null, {cond}) 
              && isString(transient.target)
            ) {
            transient?.action(this, data)
            this.#statePrev = this.#state
            this.#state = transient.target
            this.notify(null, null)
          }
        }
    }

    return this.#state
  }

  condition(cond, event=null, params={}) {
    return (cond)? this.#config.guards[cond](this.#context, event, params) : false
  }

  canTransition(event) {
    const currStateConfig = this.#config.states[this.#state]
    return event in currStateConfig.on
  }

  start() { this.#status = "running" }
  stop() { this.#status = "stopped" }

  #subscribe() {
    const events = new Set()

    for (let state in this.#config.states) {
      for (let event in this.#config.states[state].on) {
        events.add(event)
      }
    }

    for (let event of events) {
      this.#mediator.on(event, (data) => {this.notify(event, data)}, this.context)
    }
  }

  static validateConfig(c) {
    if (!isObject(c)) return false

    const required = ["id", "initial", "context", "states"]
      let keys = Object.keys(c)

    if (!isArrayEqual(required, keys)) return false

    if (!(c.initial in c.states)) return false

    for (state in c.states) {
      if ("onEnter" in c.states[state] && !isFunction(c.states[state])) return false
      if ("onExit" in c.states[state] && !isFunction(c.states[state])) return false
      if ("on" in c.states[state]) {
        for (let event of c.states[state].on) {
          if (!isString(event.target)) return false
          if ("action" in event && !isFunction(event.action)) return false
        }
      }
    }

    return true
  }

}

