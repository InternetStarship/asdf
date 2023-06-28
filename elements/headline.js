const headline = (
  data,
  type = 'headline',
  prependIconType = 'headlinePrepend',
  fa_prepended_class = 'fa_prepended'
) => {
  const element = data.element
  const output = blueprint('Headline/V1', data.id, data.parentId, data.index, element)
  const contentEditableNodeId = app.makeId()
  const html = headlineUtils.wrapSpan(element.content.html)
  const css = properties.css(element.id, type)

  let children = []
  let fontWeight = css['font-weight']
  let boldColor = ''

  if (/<\/?[a-z][\s\S]*>/i.test(html)) {
    const dom = app.htmlToDom(html)
    dom.querySelectorAll('*').forEach((node, index) => {
      children.push(
        headlineUtils.parse(node.parentNode, node.outerHTML, contentEditableNodeId, index, element.css)
      )
    })

    if (
      document.querySelector(`#${element.id} .elHeadline b`) &&
      document.querySelector(`style#bold_style_${element.id}`)
    ) {
      const boldColorStyle = document.querySelector(`style#bold_style_${element.id}`).textContent
      boldColor = boldColorStyle.split('color:')[1].replace(';', '').replace('}', '').trim()
    }
  } else {
    const plainTextId = app.makeId()
    children.push({
      type: 'text',
      innerText: element.content.text,
      id: plainTextId,
      version: 0,
      parentId: contentEditableNodeId,
      fractionalIndex: 'a0',
    })
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

const headlineUtils = {
  wrapSpan: html => {
    const dom = app.htmlToDom(html.replace(/&nbsp;/g, ''))
    const nodes = dom.childNodes

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType == 3) {
        const span = document.createElement('span')
        span.textContent = nodes[i].textContent
        dom.replaceChild(span, nodes[i])
      }
    }

    return dom.innerHTML
  },

  parse: (parentNode, html, contentEditableNodeId, index, css) => {
    if (parentNode.nodeName !== 'DIV') return false

    html = html.replace(/<div/g, '<span').replace(/<\/div>/g, '</span>')

    const dom = app.htmlToDom(html)

    const bold = dom.querySelector('b')
    const strong = dom.querySelector('strong')
    const link = dom.querySelector('a')
    const italic = dom.querySelector('i')
    const strike = dom.querySelector('strike')
    const underline = dom.querySelector('u')
    const span = dom.querySelector('span')

    if (link && link.textContent !== '') {
      const linkId = app.makeId()
      const linkAId = app.makeId()
      const linkTextId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: linkId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'a',
            attrs: {
              href: link.getAttribute('href'),
              id: link.getAttribute('id') || '',
              target: link.getAttribute('target') === '_blank' ? 'enable' : 'disable',
              className: 'elTypographyLink',
              rel: 'noopener noreferrer',
              style: { color: link.style.color },
            },
            id: linkAId,
            version: 0,
            parentId: linkId,
            fractionalIndex: 'a0',
            children: [
              {
                type: 'text',
                innerText: link.textContent + ' ',
                id: linkTextId,
                version: 0,
                parentId: linkAId,
                fractionalIndex: 'a0',
              },
            ],
          },
        ],
      }
    }

    if (bold && bold.textContent !== '') {
      const boldId = app.makeId()
      const boldTextId = app.makeId()
      const boldBId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: boldId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'b',
            attrs: { className: '' },
            id: boldBId,
            version: 0,
            parentId: boldId,
            fractionalIndex: 'a0',
            children: [
              {
                type: 'text',
                innerText: bold.textContent + ' ',
                id: boldTextId,
                version: 0,
                parentId: boldBId,
                fractionalIndex: 'a0',
              },
            ],
          },
        ],
      }
    }

    if (strong && strong.textContent !== '') {
      const strongId = app.makeId()
      const strongTextId = app.makeId()
      const strongBId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: strongId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'b',
            attrs: { className: '' },
            id: strongBId,
            version: 0,
            parentId: strongId,
            fractionalIndex: 'a0',
            children: [
              {
                type: 'text',
                innerText: strong.textContent + ' ',
                id: strongTextId,
                version: 0,
                parentId: strongBId,
                fractionalIndex: 'a0',
              },
            ],
          },
        ],
      }
    }

    if (underline && underline.textContent !== '') {
      const underlineId = app.makeId()
      const underlineUId = app.makeId()
      const underlineTextId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: underlineId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'u',
            attrs: { className: '' },
            id: underlineUId,
            version: 0,
            parentId: underlineId,
            fractionalIndex: 'a0',
            children: [
              {
                type: 'text',
                innerText: underline.textContent + ' ',
                id: underlineTextId,
                version: 0,
                parentId: underlineUId,
                fractionalIndex: 'a0',
              },
            ],
          },
        ],
      }
    }

    if (italic && italic.textContent !== '') {
      const italicId = app.makeId()
      const italicUId = app.makeId()
      const italicTextId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: italicId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'i',
            attrs: { className: '' },
            id: italicUId,
            version: 0,
            parentId: italicId,
            fractionalIndex: 'a0',
            children: [
              {
                type: 'text',
                innerText: italic.textContent + ' ',
                id: italicTextId,
                version: 0,
                parentId: italicUId,
                fractionalIndex: 'a0',
              },
            ],
          },
        ],
      }
    }

    if (strike && strike.textContent !== '') {
      const strikeId = app.makeId()
      const strikeUId = app.makeId()
      const strikeTextId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: strikeId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'strike',
            attrs: { className: '' },
            id: strikeUId,
            version: 0,
            parentId: strikeId,
            fractionalIndex: 'a0',
            children: [
              {
                type: 'text',
                innerText: strike.textContent + ' ',
                id: strikeTextId,
                version: 0,
                parentId: strikeUId,
                fractionalIndex: 'a0',
              },
            ],
          },
        ],
      }
    }

    if (span && span.textContent !== '') {
      const spanId = app.makeId()
      const spanTextId = app.makeId()
      return {
        type: 'span',
        attrs: { css },
        id: spanId,
        version: 0,
        parentId: contentEditableNodeId,
        fractionalIndex: `a${index}`,
        children: [
          {
            type: 'text',
            innerText: span.textContent + ' ',
            id: spanTextId,
            version: 0,
            parentId: spanId,
            fractionalIndex: 'a0',
          },
        ],
      }
    }
  },
}
