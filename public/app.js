const app = {
  copiedCSS: '',
  copiedJS: '',
  idList: [],
  recommendations: [],
  idLookupTable: [],
  iframeId: '',

  init: () => {
    const clickfunnels_classic = clickfunnels_classic_page_tree.sections(
      document.querySelector('.containerWrapper')
    )

    const clickfunnels_v2 = clickfunnels2_pagetree(clickfunnels_classic)
    clickfunnels_v2.version = 93

    const css = ''
    const google_font_families = ''

    const response = {
      data: {
        css: css,
        page_tree: JSON.stringify(clickfunnels_v2),
        google_font_families: google_font_families,
      },
      recommendations: app.recommendations,
      classic_pagetree: clickfunnels_classic,
      v2_pagetree: app.cleanUp(clickfunnels_v2),
    }

    window.parent.postMessage(response, '*')
  },

  htmlToDom: html => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    return wrapper
  },

  makeId: () => {
    let id = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    const finalId = `6Z-${id}-0`
    if (!app.idLookupTable.includes(finalId)) {
      return finalId
    } else {
      app.makeId()
    }
  },

  cleanUp: obj => {
    if (typeof obj !== 'object' || obj === null) {
      return
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === 'children') {
          if (!Array.isArray(obj[key]) || obj[key] === undefined) {
            obj[key] = []
          }
        }
        if (typeof obj[key] === 'object') {
          app.cleanUp(obj[key])
        }
      }
    }
  },

  checkVisibility: element => {
    const hideOn = element.getAttribute('data-hide-on')
    if (hideOn === 'desktop') {
      return 'desktop'
    } else if (hideOn === 'mobile') {
      return 'mobile'
    } else if (!hideOn && element.style.display === 'none') {
      return 'none'
    } else {
      return null
    }
  },

  columnSize: dom => {
    let output = ''

    dom.classList.forEach(className => {
      if (className.includes('col-md-')) {
        output = className.replace('col-md-', '')
      }
    })

    return output
  },

  convertBackgroundPositionClassName: (backgroundClasses, callback) => {
    const classic_classnames = ['bgCover', 'bgCover100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']
    const cf2_classnames = ['bgCoverCenter', 'bgW100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']

    classic_classnames.forEach((item, index) => {
      if (backgroundClasses.contains(item)) {
        callback(cf2_classnames[index])
      }
    })
  },
}
