const headline = (
  data,
  type = 'headline',
  prependIconType = 'headlinePrepend',
  fa_prepended_class = 'fa_prepended'
) => {
  const element = data.element

  let blueprintTitle = 'Headline/V1'

  // if (element.title === 'sub-headline') {
  //   blueprintTitle = 'SubHeadline/V1'
  // } else if (element.title === 'Paragraph') {
  //   blueprintTitle = 'Paragraph/V1'
  // }

  const output = blueprint(blueprintTitle, data.id, data.parentId, data.index, element)
  const contentEditableNodeId = app.makeId()
  const css = properties.css(element.id, type)
  let children = headlinePageTree(element.content.json, contentEditableNodeId)
  let fontWeight = css['font-weight']
  let boldColor = ''

  if (/<\/?[a-z][\s\S]*>/i.test(element.content.html)) {
    if (
      document.querySelector(`#${element.id} .elHeadline b`) &&
      document.querySelector(`style#bold_style_${element.id}`)
    ) {
      const boldColorStyle = document.querySelector(`style#bold_style_${element.id}`).textContent
      boldColor = boldColorStyle.split('color:')[1].replace(';', '').replace('}', '').trim()
    }
  } else {
    const plainTextId = app.makeId()
    children = [
      {
        type: 'text',
        innerText: element.content.text,
        id: plainTextId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: 'a0',
      },
    ]
  }

  const borderRadius = properties.borderRadius(element.css)

  if (fontWeight === 'normal') {
    fontWeight = '400'
  } else if (fontWeight === 'bold') {
    fontWeight = '700'
  } else if (fontWeight === 'bolder') {
    fontWeight = '900'
  } else if (fontWeight === 'lighter') {
    fontWeight = '200'
  }

  const cssPrepend = properties.css(element.id, prependIconType)
  const fa_prependDom = document.querySelector(`#${element.id} .${fa_prepended_class}`)
  let fa_prepended = {}

  if (fa_prependDom) {
    fa_prepended = {
      attrs: {
        'data-skip-icon-settings': 'false',
        className: fa_prependDom.getAttribute('class').replace(`${fa_prepended_class} `, ''),
        style: {
          'margin-left': parseInt(cssPrepend['margin-left']) || 0,
          'margin-right': parseInt(cssPrepend['margin-right']) || 0,
          'font-size': parseInt(cssPrepend['font-size']) || 0,
          color: cssPrepend['color'],
          width: 'auto',
        },
      },
      params: {
        'margin-left--unit': 'px',
        'margin-right--unit': 'px',
        'font-size--unit': 'px',
      },
    }
  }

  children = children.filter(function (element) {
    return element !== undefined
  })

  output.params = type !== 'image_list_headline' ? params(css, 'element', element.id) : {}

  output.attrs = {
    style: {
      'margin-top': parseInt(element.css['margin-top']) || 0,
      'padding-top': parseInt(css['padding-top']) || 0,
      'padding-bottom': parseInt(css['padding-bottom']) || 0,
      'padding-left': parseInt(css['padding-left']) || 0,
      'padding-right': parseInt(css['padding-right']) || 0,
      position: css['position'] || 'relative',
      'z-index': parseInt(css['z-index']) || 0,
    },
    'data-skip-background-settings': 'false',
  }

  output.selectors = {
    '.elHeadline': {
      attrs: {
        style: {
          'font-family': css['font-family'],
          'font-weight': fontWeight,
          'letter-spacing': css['letter-spacing'] || 0,
          'line-height': css['line-height'] || 0,
          'font-size': parseInt(css['font-size']) || 26,
          color: css['color'],
          'text-transform': css['text-transform'],
          'text-decoration': css['text-decoration'],
          'text-align': css['text-align'],
          opacity: parseInt(css['opacity']) || 1,
        },
      },
      '.elHeadline b,\\n.elHeadline strong': {
        attrs: {
          style: {
            color: boldColor || css['color'],
          },
        },
      },
    },
    '.elHeadline b,\\n.elHeadline strong': {
      attrs: {
        style: {
          color: boldColor || css['color'],
        },
      },
    },
    '.fa_prepended': fa_prepended,
  }

  output.children = [
    {
      type: 'ContentEditableNode',
      attrs: { 'data-align-selector': '.elHeadline' },
      id: contentEditableNodeId,
      version: 0,
      parentId: data.id,
      fractionalIndex: 'a0',
      children: children,
    },
  ]

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

  return output
}

function headlinePageTree(classicHeadlineArray, mainParentId) {
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

    if (headline.children) {
      output.children = headlinePageTree(headline.children, id)
    }

    outputArray.push(output)
  })

  return outputArray
}
