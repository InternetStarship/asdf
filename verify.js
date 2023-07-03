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
          inject('layout/popup.js'),
          inject('layout/rows.js'),
          inject('layout/columns.js'),
          inject('elements/audio_player.js'),
          inject('elements/billing.js'),
          inject('elements/button.js'),
          inject('elements/checkbox.js'),
          inject('elements/countdown.js'),
          inject('elements/divider.js'),
          inject('elements/embed.js'),
          inject('elements/faq_block.js'),
          inject('elements/fb_comments.js'),
          inject('elements/featured_image.js'),
          inject('elements/flex.js'),
          inject('elements/headline.js'),
          inject('elements/icon.js'),
          inject('elements/image_list.js'),
          inject('elements/image_popup.js'),
          inject('elements/image.js'),
          inject('elements/input.js'),
          inject('elements/textarea.js'),
          inject('elements/list.js'),
          inject('elements/nav.js'),
          inject('elements/pricing.js'),
          inject('elements/progress.js'),
          inject('elements/select.js'),
          inject('elements/social_share.js'),
          inject('elements/shipping.js'),
          inject('elements/text_block.js'),
          inject('elements/video.js'),
          inject('elements/video_popup.js'),
        ])

        app.checkImagesLoaded('.containerWrapper', app.init)
      } catch (err) {
        console.error(`Failed to load ClickFunnels Classic verification: ${err}`)
      }
    }
  },
  false
)
