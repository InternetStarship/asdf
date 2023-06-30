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
            const el = document.querySelector(`#${domId} a:nth-child(${nodeIndex + 1})`)
            let color = '#000000'
            if (el) {
              const style = window.getComputedStyle(el)
              color = style.color
            } else if (listIndex !== null) {
              const el = document.querySelector(`#${node.id}`)
              if (el) {
                const style = window.getComputedStyle(el)
                color = style.color
              }
            } else if (type === 'faq_paragraph' || type === 'faq_headline') {
              const el = document.querySelector(`#${node.id}`)
              if (el) {
                const style = window.getComputedStyle(el)
                color = style.color
              }
            }

            obj.attrs.style = {
              color: color,
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
}
