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

    const google_font_families = ''

    clickfunnels_v2.popup.children = clickfunnels_v2.popup.children.filter(function (element) {
      return element !== undefined
    })

    clickfunnels_v2.content.children = clickfunnels_v2.content.children.filter(function (element) {
      return element !== undefined
    })

    const response = {
      data: {
        css: app.copiedCSS,
        page_tree: JSON.stringify(clickfunnels_v2),
        google_font_families: google_font_families,
      },
      recommendations: app.recommendations,
      classic_pagetree: clickfunnels_classic,
      v2_pagetree: clickfunnels_v2,
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

  convertBackgroundPositionClassName: (backgroundClasses, callback) => {
    const classesMap = {
      bgCover: 'bgCoverV2',
      bgCover100: 'bgW100',
      bgNoRepeat: 'bgNoRepeat',
      bgRepeat: 'bgRepeat',
      bgRepeatXTop: 'bgRepeatX',
      bgRepeatXBottom: 'bgRepeatX',
    }

    // convert DOMTokenList to an array
    const bgClassesArray = Array.from(backgroundClasses)

    for (let classic in classesMap) {
      if (bgClassesArray.includes(classic)) {
        callback(classesMap[classic])
        return
      }
    }
  },

  checkImagesLoaded: (parentSelector, callback) => {
    const parent = document.querySelector(parentSelector)
    const images = parent.getElementsByTagName('img')
    let imagesToLoad = images.length

    for (let i = 0; i < images.length; i++) {
      if (images[i].complete) {
        imagesToLoad--
      } else {
        images[i].addEventListener('load', function () {
          imagesToLoad--
          if (imagesToLoad === 0) {
            callback()
          }
        })
      }
    }

    if (imagesToLoad === 0) {
      callback()
    }
  },
}
