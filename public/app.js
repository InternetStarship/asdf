const app = {
  copiedCSS: '',
  copiedJS: '',
  idList: [],
  recommendations: [],
  idLookupTable: [],
  iframeId: '',

  init: () => {
    const contentId = app.makeId()
    const page_tree = {
      version: 103,
      content: {
        type: 'ContentNode',
        id: contentId,
        params: {},
        attrs: {},
        children: [],
      },
      settings: {},
      popup: {},
    }
    let css = ''
    let google_font_families = ''

    // Build page tree (JSON) of ClickFunnels Classic page
    const clickfunnels_classic = clickfunnels_classic_page_tree.sections(
      document.querySelector('.containerWrapper')
    )

    // Convert ClickFunnels Classic page tree to ClickFunnels 2.0 page tree
    // TODO: pass cfclassic to converter clickfunnels2_pagetree(clickfunnels_classic, page_tree)

    // TODO get CSS and Fonts from ClickFunnels Classic page
    css = ''
    google_font_families = ''

    const response = {
      css: css,
      page_tree: page_tree, // JSON.stringify(page_tree),
      google_font_families: google_font_families,
      dev_only_classic_pagetree: clickfunnels_classic,
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
