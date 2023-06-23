function loadScript(url, callback) {
  const base_url = 'https://classic-parser.onrender.com/'
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = `${base_url}${url}`
  script.onload = callback
  document.head.appendChild(script)
}

loadScript('init.js')
loadScript('generate.js')

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
