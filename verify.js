console.log('ClickFunnels Classic Transfer Loaded')

function inject(url) {
  return new Promise((resolve, reject) => {
    const base_url = 'https://4f2102016945-3911214117516183263.ngrok-free.app/'
    const script = document.createElement('script')
    script.type = 'text/javascript'
    if (url.includes('http')) {
      script.src = url
    } else {
      script.src = `${base_url}${url}`
    }
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

window.addEventListener(
  'message',
  async event => {
    if (event.data.type === 'import-classic') {
      try {
        await Promise.all([
          inject('https://cdn.jsdelivr.net/npm/cssbeautify@0.3.1/cssbeautify.min.js'),
          inject('app.js'),
        ])

        app.checkImagesLoaded('.containerWrapper', app.init)
      } catch (err) {
        console.error(`Failed to load ClickFunnels Classic verification: ${err}`)
      }
    }
  },
  false
)
