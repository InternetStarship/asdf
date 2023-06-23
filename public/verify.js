function inject(url) {
  const base_url = 'https://classic-parser.onrender.com/'
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = `${base_url}${url}`
  document.head.appendChild(script)
}

inject('app.js')
inject('settings/animations.js')
inject('settings/params.js')
inject('settings/properties.js')
inject('settings/settings.js')
inject('layout/sections.js')
inject('layout/rows.js')
inject('layout/columns.js')
inject('layout/elements.js')

const elements = [
  'audio_player.js',
  'billing',
  'button',
  'countdown',
  'divider',
  'embed',
  'faq_block',
  'fh_comments',
  'featured_image',
  'flex',
  'headline',
  'icon',
  'image_list',
  'image_popup',
  'image',
  'input',
  'list',
  'nav',
  'pricing',
  'progress',
  'select',
  'shipping',
  'text_block',
  'video_popup',
]
elements.forEach(element => {
  inject(`elements/${element}.js`)
})

inject('page-tree/clickfunnels-classic.js')
inject('page-tree/clickfunnels2.js')

window.addEventListener(
  'message',
  event => {
    if (event.data.type === 'import-classic') {
      app.init()
    }
  },
  false
)
