function loadScript(url, callback) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  script.onload = callback
  document.head.appendChild(script)
}

loadScript('https://classic-parser.onrender.com/init.js')
loadScript('https://classic-parser.onrender.com/generate.js')

console.info('Clickfunnels Classic Verification loaded.')

window.addEventListener(
  'message',
  event => {
    if (event.data.type === 'import-classic') {
      console.info('Classic has GOT the message.')

      init()
    }
  },
  false
)
