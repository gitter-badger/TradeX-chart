// state-chart.js

export default
{
  id: "offChart",
  initial: "idle",
  context: {},
  states: {
    idle: {
      onEnter(stateMachine, data) {
        stateMachine.context.origin.setCursor("crosshair")

        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onEnter`)
      },
      onExit(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onExit (${stateMachine.event})`)
      },
      on: {
        chart_pan: {
          target: 'chart_pan',
          action: (stateMachine, data) => {
            stateMachine.context.origin.setCursor("grab")

            // console.log('transition action for "chart_pan" in "idle" state')
          },
        },
        chart_zoom: {
          target: 'chart_zoom',
          action: (stateMachine, data) => {
            // console.log(`${stateMachine.id}: transition from "${stateMachine.state}" to  "chart_zoom"`)
          },
        },
        chart_tool: {
          target: 'chart_tool',
          action: (stateMachine, data) => {
            // console.log('transition action for "chart_tool" in "idle" state')
          },
        },
        xAxis_scale: {
          target: 'xAxis_scale',
          action: (stateMachine, data) => {
            // console.log('transition action for "xAxis_scale" in "idle" state')
          },
        },
        offChart_mouseDown: {
          target: 'offChart_mouseDown',
          action: (stateMachine, data) => {
            // console.log('transition action for "xAxis_scale" in "idle" state')
          },
        },
        offChart_mouseUp: {
          target: 'offChart_mouseUp',
          action: (stateMachine, data) => {
            // console.log('transition action for "xAxis_scale" in "idle" state')
          },
        },
      }
    },
    chart_pan: {
      onEnter(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onEnter`)
      },
      onExit(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onExit (${stateMachine.event})`)
      },
      on: {
        chart_pan: {
          target: 'chart_pan',
          action: (stateMachine, data) => {
            // console.log('offChart action for "chart_panDone" in "chart_pan" state')
            stateMachine.context.origin.updateRange(data) 
          },
        },
        chart_panDone: {
          target: 'idle',
          action: (stateMachine, data) => {
            // console.log('offChart action for "chart_panDone" in "chart_pan" state')
            stateMachine.context.origin.updateRange(data) 
          },
        },
      }
    },
    chart_zoom: {
      onEnter(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onEnter`)
      },
      onExit(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: - onExit (${stateMachine.event})`)
      },
      on: {
        always: {
          target: 'idle',
          condition: 'zoomDone',
          action: (stateMachine, data) => {
            // console.log(`${stateMachine.id}: transition from "${stateMachine.state}" to "chart_zoom"`)
            const range = stateMachine.context.origin.range
            stateMachine.context.origin.zoomRange()
          },
        },
      }
    },
    xAxis_scale: {
      onEnter(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onEnter`)
      },
      onExit(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onExit (${stateMachine.event})`)
      },
      on: {
        Idle: {
          target: 'idle',
          action: (stateMachine, data) => {
            // console.log('transition action for "onIdle" in "XScale" state')
          },
        },
      }
    },
    offChart_mouseDown: {
      onEnter(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onEnter`)
      },
      onExit(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onExit (${stateMachine.event})`)
      },
      on: {
        Idle: {
          target: 'idle',
          action: (stateMachine, data) => {
            // console.log('transition action for "onIdle" in "XScale" state')
          },
        },
      }
    },
    offChart_mouseUp: {
      onEnter(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onEnter`)
      },
      onExit(stateMachine, data) {
        // console.log(`${stateMachine.id}: state: "${stateMachine.state}" - onExit (${stateMachine.event})`)
      },
      on: {
        Idle: {
          target: 'idle',
          action: (stateMachine, data) => {
            // console.log('transition action for "onIdle" in "XScale" state')
          },
        },
      }
    },
  },
  guards: {
    zoomDone: (context, event, { cond }) => { return true }
  }
}
