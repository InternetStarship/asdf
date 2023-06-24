const button = data => {
  const element = data.element
  const id = data.id
  const mainId = app.makeId()
  const subId = app.makeId()
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'button')
  const cssMain = properties.css(element.id, 'buttonMain')
  const cssSub = properties.css(element.id, 'buttonSub')
  const cssPrepend = properties.css(element.id, 'buttonPrepend')
  const cssAppend = properties.css(element.id, 'buttonAppend')
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)
  theParams['width--unit'] = '%'
  theParams['--style-padding-horizontal'] = parseInt(css['padding-left'])
  theParams['--style-padding-horizontal--unit'] = 'px'
  theParams['--style-padding-vertical'] = parseInt(css['padding-top'])
  theParams['--style-padding-vertical--unit'] = 'px'

  const fa_prependDom = document.querySelector(`#${element.id} .fa_prepended`)
  let fa_prepended = {}

  const fa_appendDom = document.querySelector(`#${element.id} .fa_appended`)
  let fa_appended = {}

  if (fa_prependDom) {
    fa_prepended = {
      attrs: {
        'data-skip-icon-settings': 'false',
        className: fa_prependDom.getAttribute('class').replace('fa_prepended ', ''),
        style: {
          'margin-left': parseInt(cssPrepend['margin-left']) || 0,
          'margin-right': parseInt(cssPrepend['margin-right']) || 0,
          'font-size': parseInt(cssPrepend['font-size']) || 0,
          color: cssPrepend['color'],
        },
      },
      params: {
        'margin-left--unit': 'px',
        'margin-right--unit': 'px',
        'font-size--unit': 'px',
      },
    }
  }
  if (fa_appendDom) {
    fa_appended = {
      attrs: {
        'data-skip-icon-settings': 'false',
        className: fa_appendDom.getAttribute('class').replace('fa_appended ', ''),
        style: {
          'margin-left': parseInt(cssAppend['margin-left']) || 0,
          'margin-right': parseInt(cssAppend['margin-right']) || 0,
          'font-size': parseInt(cssAppend['font-size']) || 0,
          color: cssAppend['color'],
        },
      },
      params: {
        'margin-left--unit': 'px',
        'margin-right--unit': 'px',
        'font-size--unit': 'px',
      },
    }
  }

  const output = {
    type: 'Button/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    params: {
      buttonState: 'default',
      href: element.content.href,
      target: element.content.target || '_self',
      'margin-top--unit': 'px',
    },
    selectors: {
      '.elButton': {
        attrs: {
          style: {
            width: element.content.width,
            'font-family': cssMain['font-family'],
          },
          'data-skip-corners-settings': 'false',
          'data-skip-borders-settings': 'false',
          'data-skip-shadow-settings': 'false',
        },
        params: theParams,
      },
      '.elButton .elButtonText': {
        attrs: {
          'font-size--unit': 'px',
          style: {
            'font-family': cssMain['font-family'],
            'font-weight': cssMain['font-weight'],
            'letter-spacing': parseInt(cssMain['letter-spacing']) || 0,
            'line-height': parseInt(cssMain['line-height']) || 0,
            'font-size': parseInt(cssMain['font-size']) || 26,
            color: cssMain['color'],
            'text-transform': cssMain['text-transform'],
            'text-decoration': cssMain['text-decoration'],
            'text-align': cssMain['text-align'],
            opacity: cssMain['opacity'] || 1,
          },
          'data-skip-text-shadow-settings': 'false',
        },
        params: params(cssMain, 'element', element.id),
      },
      '.elButton .elButtonSub': {
        attrs: {
          style: {
            'font-family': cssSub['font-family'],
            'font-weight': cssMain['font-weight'],
            'letter-spacing': parseInt(cssSub['letter-spacing']) || 0,
            'line-height': parseInt(cssSub['line-height']) || 0,
            'font-size': parseInt(cssSub['font-size']) || 26,
            color: cssSub['color'],
            'text-transform': cssSub['text-transform'],
            'text-decoration': cssSub['text-decoration'],
            'text-align': cssSub['text-align'],
            opacity: cssSub['opacity'] || 0.7,
          },
          'data-skip-text-shadow-settings': 'false',
        },
        params: params(cssSub, 'element', element.id),
      },
      '.elButton:hover,\\n.elButton.elButtonHovered': {
        params: {
          '--style-background-color': css['background-color'],
        },
      },
      '.elButton:hover .elButtonText,\\n.elButton.elButtonHovered .elButtonText': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
      '.elButton:hover .elButtonSub,\\n.elButton.elButtonHovered .elButtonSub': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
      '.elButton:active,\\n.elButton.elButtonActive': {
        params: {
          '--style-background-color': css['background-color'],
        },
      },
      '.elButton:active .elButtonText,\\n.elButton.elButtonActive .elButtonText': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
      '.elButton:active .elButtonSub,\\n.elButton.elButtonActive .elButtonSub': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
    },
    attrs: {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        position: element.css['position'] || 'relative',
        'z-index': parseInt(element.css['z-index']) || 0,
      },
    },
    children: [
      {
        type: 'slot',
        slotName: 'button-main',
        id: mainId,
        version: 0,
        parentId: id,
        fractionalIndex: 'a0',
        children: [
          {
            type: 'text',
            innerText: element.content.main,
            id: app.makeId(),
            version: 0,
            parentId: mainId,
            fractionalIndex: 'a0',
          },
        ],
      },
    ],
  }

  if (fa_prepended?.params) {
    output.selectors['.fa_prepended'] = fa_prepended
  }

  if (fa_appended?.params) {
    output.selectors['.fa_apended'] = fa_appended
  }

  if (element.content.sub) {
    output.children.push({
      type: 'text',
      slotName: 'button-sub',
      id: subId,
      version: 0,
      parentId: id,
      fractionalIndex: 'a0',
      innerText: element.content.sub,
    })
  }
  output.selectors['.elButton'].attrs.style = Object.assign(
    output.selectors['.elButton'].attrs.style,
    borderRadius
  )
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))
  output.params = Object.assign(
    output.params,
    animations.params(document.querySelector(`[id="${element.id}"]`))
  )

  console.log('button output', output)

  return output
}
