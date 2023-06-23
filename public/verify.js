function inject(url) {
  return new Promise((resolve, reject) => {
    const base_url = 'https://classic-parser.onrender.com/'
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `${base_url}${url}`

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
          inject('app.js'),
          inject('settings/animations.js'),
          inject('settings/params.js'),
          inject('settings/properties.js'),
          inject('settings/settings.js'),
          inject('layout/popup.js'),
          inject('layout/sections.js'),
          inject('layout/rows.js'),
          inject('layout/columns.js'),
          inject('layout/elements.js'),
          inject('elements/audio_player.js'),
          inject('elements/billing.js'),
          inject('elements/button.js'),
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
          inject('elements/list.js'),
          inject('elements/nav.js'),
          inject('elements/pricing.js'),
          inject('elements/progress.js'),
          inject('elements/select.js'),
          inject('elements/shipping.js'),
          inject('elements/text_block.js'),
          inject('elements/video_popup.js'),
          inject('page-tree/clickfunnels-classic.js'),
          inject('page-tree/clickfunnels2.js'),
        ])

        app.init()
      } catch (err) {
        console.error(`Failed to load ClickFunnels Classic verification: ${err}`)
      }
    }
  },
  false
)
