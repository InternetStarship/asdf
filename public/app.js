const app = {
  copiedCSS: '',
  copiedJS: '',
  idList: [],
  recommendations: [],
  idLookupTable: [],
  iframeId: '',

  init: () => {
    // Build page tree (JSON) of ClickFunnels Classic page
    const clickfunnels_classic = clickfunnels_classic_page_tree.sections(
      document.querySelector('.containerWrapper')
    )

    // Convert ClickFunnels Classic page tree to ClickFunnels 2.0 page tree
    const clickfunnels_v2 = convert(clickfunnels_classic)
    clickfunnels_v2.version = 95

    // TODO get CSS and Fonts from ClickFunnels Classic page
    const css = ''
    const google_font_families = ''

    // Optional show recommendations
    const recommendations = app.recommendations

    const response = {
      data: {
        css: css,
        page_tree: JSON.stringify(clickfunnels_v2),
        google_font_families: google_font_families,
      },
      recommendations: recommendations,
      classic_pagetree: clickfunnels_classic,
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
}
