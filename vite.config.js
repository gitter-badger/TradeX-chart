// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

const name = "TradeX-chart"
const id = "tradex-chart"

export default defineConfig(({ command, mode }) => {

  if (command === 'build') {
    // command === 'build'
    return {
      // build specific config
      build: {
        base: "/TradeX-chart/",
        lib: {
          entry: path.resolve(__dirname, 'src/index.js'),
          name: name,
          fileName: (format) => `${id}.${format}.js`
        },
        emptyOutDir: true,
        target: "esnext",
        rollupOptions: {
          // make sure to externalize deps that shouldn't be bundled into your library
          external: [
            'talib-web',
          ],
          output: {
            // Provide global variables to use in the UMD build for externalized deps
            globals: {
              // vue: 'Vue'
            }
          }
        }
      },
    }
  }
  else if (command === 'serve') {
    // demo specific config
    return {
      // server: {
      //   open: '/demo.html'
      // }
    }
  }
  else {
    return {
      // dev / serve specific config
    }
  } 
})


// module.exports = defineConfig({
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, 'src/index.js'),
//       name: name,
//       fileName: (format) => `${id}.${format}.js`
//     },
//     emptyOutDir: true,
//     target: "esnext",
//     rollupOptions: {
//       // make sure to externalize deps that shouldn't be bundled into your library
//       external: [
//         'talib-web',
//       ],
//       output: {
//         // Provide global variables to use in the UMD build for externalized deps
//         globals: {
//           // vue: 'Vue'
//         }
//       }
//     }
//   },
//   server: {
//     open: '/demo.html'
//   }
// })
