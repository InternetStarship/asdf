const properties = {
  css: (elementId, type = null, isParams = false) => {
    let dom

    if (type === 'column') {
      dom = document.querySelector(`.containerWrapper #${elementId}`)
    } else if (type === 'image') {
      dom = document.querySelector(`#${elementId} img`)
    } else if (type === 'icon') {
      dom = document.querySelector(`#${elementId} .eliconelement`)
    } else if (type === 'headline') {
      dom = document.querySelector(`#${elementId} .elHeadline`)
    } else if (type === 'headlinePrepend') {
      dom = document.querySelector(`#${elementId} .fa_prepended`)
    } else if (type === 'faqPrepend') {
      dom = document.querySelector(`#${elementId} .faqIcon`)
    } else if (type === 'divider') {
      dom = document.querySelector(`#${elementId} .elDividerInner`)
    } else if (type === 'dividerContainer') {
      dom = document.querySelector(`#${elementId} .elDivider`)
    } else if (type === 'input') {
      dom = document.querySelector(`#${elementId} .elInput`)
    } else if (type === 'button') {
      dom = document.querySelector(`#${elementId} .elButton`)
    } else if (type === 'buttonMain') {
      dom = document.querySelector(`#${elementId} .elButtonMain`)
    } else if (type === 'buttonSub') {
      dom = document.querySelector(`#${elementId} .elButtonSub`)
    } else if (type === 'buttonPrepend') {
      dom = document.querySelector(`#${elementId} .fa_prepended`)
    } else if (type === 'buttonAppend') {
      dom = document.querySelector(`#${elementId} .fa_appended`)
    } else if (type === 'popup') {
      dom = document.querySelector(`.containerModal`)
    } else if (type === 'popup-backdrop') {
      dom = document.querySelector(`.modalBackdropWrapper`)
    } else if (type === 'featured_image_image') {
      dom = document.querySelector(`#${elementId} .elScreenshot_image img`)
    } else if (type === 'featured_image_headline') {
      dom = document.querySelector(`#${elementId} .elScreenshot_text_headline`)
    } else if (type === 'featured_image_paragraph') {
      dom = document.querySelector(`#${elementId} .elScreenshot_text_body`)
    } else if (type === 'faq_block_headline') {
      dom = document.querySelector(`#${elementId} .faqTitle`)
    } else if (type === 'faq_block_paragraph') {
      dom = document.querySelector(`#${elementId} .faqAnswer`)
    } else if (type === 'image_list_headline') {
      dom = document.querySelector(`#${elementId} li`)
    } else if (type && type.includes('text_block_headline_')) {
      const eqIndex = type.split('_')[3]
      const eqType = type.split('_')[4]
      dom = document.querySelector(`#${elementId} .elTextblock ${eqType}:nth-child(${eqIndex})`)
      if (dom.querySelector('span')) {
        dom = dom.querySelector('span')
        dom.style.paddingBottom = '10px'
      }
    } else if (type === 'pricing_label_headline') {
      dom = document.querySelector(`#${elementId} .pricely-label`)
    } else if (type === 'pricing_figure_headline') {
      dom = document.querySelector(`#${elementId} .pricely-amount`)
      dom.style.padding = '20px 0'
    } else if (type === 'pricing_foreword_headline') {
      dom = document.querySelector(`#${elementId} .pricely-foreword`)
    } else if (type && type.includes('pricing_headline_')) {
      const eqIndex = type.split('_')[2]
      dom = document.querySelector(`#${elementId} .list-group .list-group-item:nth-child(${eqIndex})`)
    } else if (type === 'shipping_headline') {
      dom = document.querySelector(`#${elementId} .labelUnderInput`)
    } else if (type === 'shipping_input') {
      dom = document.querySelector(`#${elementId} .elInput`)
    } else if (type === 'billing_headline') {
      dom = document.querySelector(`#${elementId} .labelUnderInput`)
    } else if (type === 'billing_input') {
      dom = document.querySelector(`#${elementId} .elInput`)
    } else if (type === 'list') {
      dom = document.querySelector(`#${elementId} .elBulletList li`)
    } else {
      dom = document.querySelector(`#${elementId}`)
    }

    if (dom) {
      const data = {
        'margin-top--unit': 'px',
      }
      const computed = getComputedStyle(dom)

      const used_styles = [
        'background-color',
        'background-image',
        'background-position',
        'background-repeat',
        'background-size',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'font-family',
        'font-size',
        'font-weight',
        'text-transform',
        'letter-spacing',
        'line-height',
        'text-align',
        'border-bottom-width',
        'border-top-width',
        'border-left-width',
        'border-right-width',
        'border-bottom-color',
        'border-top-color',
        'border-left-color',
        'border-right-color',
        'border-bottom-style',
        'border-top-style',
        'border-left-style',
        'border-right-style',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-left-radius',
        'border-bottom-right-radius',
        'outline',
        'cursor',
        'width',
        'color',
        'position',
        'box-shadow',
        'text-shadow',
        'z-index',
        'display',
        'opacity',
        'filter',
      ]

      for (let index = 0; index < computed.length; index++) {
        if (used_styles.includes(computed[index])) {
          if (computed[index] === 'position' && computed.getPropertyValue(computed[index]) === 'static') {
            data[computed[index]] = 'relative'
          } else {
            data[computed[index]] = computed.getPropertyValue(computed[index])
          }
        }
      }

      if (parseInt(data['padding-bottom']) === 0 && parseInt(data['margin-bottom']) !== 0) {
        data['padding-bottom'] = data['margin-bottom']
      } else if (parseInt(data['padding-bottom']) !== 0 && parseInt(data['margin-bottom']) !== 0) {
        data['padding-bottom'] = parseInt(data['padding-bottom']) + parseInt(data['margin-bottom']) + 'px'
      }

      return data
    } else {
      return {}
    }
  },

  borderWidth: css => {
    const top = parseInt(css['border-top-width']) || 0
    const bottom = parseInt(css['border-bottom-width']) || 0
    const left = parseInt(css['border-left-width']) || 0
    const right = parseInt(css['border-right-width']) || 0
    const borderWidth = [top, bottom, left, right]

    return {
      'border-width': borderWidth[0] || borderWidth[1] || borderWidth[2] || borderWidth[3],
      'border-top-width': top,
      'border-bottom-width': bottom,
      'border-left-width': left,
      'border-right-width': right,
    }
  },

  borderStyle: css => {
    const top = css['border-top-style']
    const bottom = css['border-bottom-style']
    const left = css['border-left-style']
    const right = css['border-right-style']
    const borderStyle = [top, bottom, left, right]

    return {
      'border-style': borderStyle[0] || borderStyle[1] || borderStyle[2] || borderStyle[3],
    }
  },

  borderColor: css => {
    const top = css['border-top-color']
    const bottom = css['border-bottom-color']
    const left = css['border-left-color']
    const right = css['border-right-color']
    const borderColor = [top, bottom, left, right]

    console.log({
      'border-color': borderColor[0] || borderColor[1] || borderColor[2] || borderColor[3],
    })
    return {
      'border-color': borderColor[0] || borderColor[1] || borderColor[2] || borderColor[3],
    }
  },

  borderRadius: (css, equalCheck) => {
    if (css === undefined || css === null) return false

    const allEqual = arr => arr.every(val => val === arr[0])
    const topLeft = parseInt(css['border-top-left-radius']) || 0
    const topRight = parseInt(css['border-top-right-radius']) || 0
    const bottomLeft = parseInt(css['border-bottom-left-radius']) || 0
    const bottomRight = parseInt(css['border-bottom-right-radius']) || 0
    const borderRadius = [topLeft, topRight, bottomRight, bottomLeft]
    const allCorners = allEqual(borderRadius)

    if (equalCheck) {
      if (allCorners) {
        return true
      } else {
        return false
      }
    } else {
      if (allCorners) {
        return {
          'border-radius': borderRadius[0],
        }
      } else {
        return {
          'border-top-left-radius': borderRadius[0],
          'border-top-right-radius': borderRadius[1],
          'border-bottom-left-radius': borderRadius[2],
          'border-bottom-right-radius': borderRadius[3],
        }
      }
    }
  },
}
