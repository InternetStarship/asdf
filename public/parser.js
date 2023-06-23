import { init } from 'https://classic-parser.onrender.com/init.js'
import { generate } from 'https://classic-parser.onrender.com/generate.js'

console.info('Clickfunnels Classic Verification loaded.')

window.addEventListener(
  'message',
  event => {
    if (event.data.type === 'import-classic') {
      init()
    }
  },
  false
)
