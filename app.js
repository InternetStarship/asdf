const app = {
  generatedCSS: '',
  generatedJS: '',
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
        css: app.generatedCSS,
        page_tree: JSON.stringify(clickfunnels_v2),
        google_font_families: google_font_families,
      },
      recommendations: app.recommendations,
      classic_pagetree: clickfunnels_classic,
      v2_pagetree: clickfunnels_v2,
    }

    window.parent.postMessage(JSON.parse(JSON.stringify(response)), '*')
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
      bgRepeatX: 'bgRepeatX',
      bgRepeatXTop: 'bgRepeatX',
      bgRepeatXBottom: 'bgRepeatX',
      bgRepeatY: 'bgRepeatY',
    }

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

  headlinePageTree: (classicHeadlineArray, mainParentId) => {
    let outputArray = []

    if (!classicHeadlineArray) {
      return outputArray
    }

    classicHeadlineArray.forEach((headline, index) => {
      const id = app.makeId()
      const fractionalIndex = 'a' + (index + 1).toString(36)

      let output = {
        ...headline,
        id: id,
        version: 0,
        parentId: mainParentId,
        fractionalIndex: fractionalIndex,
      }

      if (headline.type === 'a') {
        if (!output.attrs) {
          output.attrs = {}
        }
        output.attrs['className'] = 'elTypographyLink'

        if (output.attrs.class) {
          delete output.attrs.class
        }
      }

      if (headline.type === 'span' && headline.attrs.style) {
        headline.attrs.style = {
          color: 'inherit',
        }
      }

      if (headline.children) {
        output.children = app.headlinePageTree(headline.children, id)
      }

      outputArray.push(output)
    })

    return outputArray
  },

  parseHtml: (htmlString, domId, listIndex = null, type = null) => {
    const parser = new DOMParser()
    const html = parser.parseFromString(htmlString, 'text/html')

    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue)) {
        return null
      }

      let objs = []

      switch (node.nodeType) {
        case Node.TEXT_NODE:
          let parts = node.nodeValue.split('\n')
          parts.forEach((part, index) => {
            if (part !== '') {
              objs.push({
                type: 'text',
                innerText: part,
              })
              objs.push({
                type: 'text',
                innerText: ' ',
              })
            }

            if (index < parts.length - 1) {
              objs.push({
                type: 'div',
                innerText: ' ',
              })
            }
          })
          break

        case Node.ELEMENT_NODE:
          let obj = {
            type: node.tagName.toLowerCase(),
          }

          if (node.hasAttributes()) {
            obj.attrs = Array.from(node.attributes).reduce((attrs, attr) => {
              attrs[attr.name] = attr.value
              return attrs
            }, {})
          }

          if (obj.type === 'a') {
            const nodeIndex = Array.from(node.parentNode.childNodes).indexOf(node)
            let el = document.querySelector(`#${domId} a:nth-child(${nodeIndex + 1})`)
            const linkColorDom = document.querySelector('#link_color_style')
            let color = '#000'

            if (linkColorDom) {
              color = linkColorDom.innerText.replace('a { color: ', '').replace(';}', '').trim()
            }

            if (
              type === 'pricely-label' ||
              type === 'pricely-amount' ||
              type === 'pricely-foreword' ||
              type === 'pricely-item'
            ) {
              el = document.querySelector(`#${node.id}`)
              if (el) {
                color = el.style.color
              }
            } else if (el) {
              color = el.style.color
            } else if (listIndex !== null) {
              el = document.querySelector(`#${node.id}`)
              if (el) {
                color = el.style.color
              }
            } else if (type === 'faq_paragraph' || type === 'faq_headline') {
              el = document.querySelector(`#${node.id}`)
              if (el) {
                color = el.style.color
              }
            }

            if (app.isColor(color)) {
              obj.attrs.style = {
                color: color,
              }
            }
          }

          if (node.hasChildNodes()) {
            obj.children = Array.from(node.childNodes)
              .flatMap(traverse)
              .filter(child => child !== null)
          }

          if (
            obj.type === 'div' &&
            obj.children &&
            obj.children.length === 1 &&
            obj.children[0].type === 'br'
          ) {
            objs.push({ type: 'div', children: [{ type: 'br' }] })
          } else if (obj.type === 'div' && obj.children && obj.children.length > 0) {
            objs = objs.concat(obj.children)
          } else {
            objs.push(obj)
          }

          break
      }

      return objs
    }

    return Array.from(html.body.childNodes)
      .flatMap(traverse)
      .filter(child => child !== null)
  },

  isColor: color => {
    var s = new Option().style
    s.color = color
    return s.color == color
  },

  buildRecommendations: () => {
    document.querySelectorAll('.de').forEach(dom => {
      if (dom.getAttribute('data-de-type') === 'privacy_notice') {
        app.recommendations.push({
          type: 'Privacy Notice',
          status: 'Not Supported',
          explainer: 'The Privacy Notice element is not supported.',
        })
      }

      if (dom.getAttribute('data-de-type') === 'videogallery1') {
        app.recommendations.push({
          type: 'Video Popup',
          status: 'Custom Code',
          explainer:
            'The video popup element is not supported inside of ClickFunnels 2.0 yet. This element will be converted to a custom code element.',
        })
      }

      if (dom.getAttribute('data-de-type') === 'button') {
        if (
          dom.querySelector('a').href.includes('#') &&
          dom.querySelector('a').href.split('#')[1] === 'fb-optin-url'
        ) {
          app.recommendations.push({
            type: 'FB Optin Button',
            status: 'Not Supported',
            explainer:
              'The Facebook optin button is not supported inside of ClickFunnels 2.0. This element will be converted to a normal button.',
          })
        }
      }

      if (dom.getAttribute('data-de-type') === 'sms') {
        app.recommendations.push({
          type: 'SMS',
          status: 'Not Supported',
          explainer: 'The SMS element is not supported inside of ClickFunnels 2.0 and has not been copied.',
        })
      }

      if (dom.getAttribute('data-de-type') === 'survey') {
        app.recommendations.push({
          type: 'Survey',
          status: 'Coming Soon',
          explainer: 'The survey element is work-in-progress and should be available soon.',
        })
      }
    })
  },

  cssForInput: (id, type) => {
    const input = document.querySelector(`#${id} .elInput`)
    const boxShadow = ['es-gradient', 'es-lightgreyInput', 'elInputStyle1', 'ceoinput']

    let boxShadowCSS = ''

    boxShadow.map(box => {
      if (input.classList.contains(box)) {
        switch (box) {
          case 'es-gradient':
            boxShadowCSS = 'box-shadow: inset 0px 0px 2px 2px rgba(0,0,0,0.055) !important;'
            break
          case 'es-lightgreyInput':
            boxShadowCSS =
              'box-shadow: inset 0px 2px 4px rgba(128,128,128,0.15), 0px 3px 2px rgba(140,157,169,0.14) !important;'
            break
          case 'elInputStyle1':
            boxShadowCSS = 'box-shadow: 0 0 0 3px rgb(4 3 3 / 5%) !important;'
            break
          case 'ceoinput':
            boxShadowCSS =
              'box-shadow: inset 0 1px 2px rgba(130,137,150,0.23), 0 1px 0 rgba(255,255,255,0.95) !important;'
            break
        }
      }
    })

    let className = '.elInput'
    if (type === 'TextArea') className = '.elTextarea'
    if (type === 'Select') className = '.elSelect'

    if (boxShadowCSS !== '') {
      app.generatedCSS += `\n\n/* CSS for ${type} */\n`
      app.generatedCSS += `
#${id} ${className} {
  ${boxShadowCSS}
}`

      app.recommendations.push({
        title: 'Input Box Shadow',
        status: 'CSS',
        explainer: 'Custom CSS has been added to the input box to match the original box shadow.',
      })
    }
  },
}
