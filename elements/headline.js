const headline = (
  data,
  type = 'headline',
  prependIconType = 'headlinePrepend',
  fa_prepended_class = 'fa_prepended'
) => {
  const element = data.element

  let blueprintTitle = 'Headline/V1'

  if (element.title === 'sub-headline') {
    blueprintTitle = 'SubHeadline/V1'
  } else if (element.title === 'Paragraph') {
    blueprintTitle = 'Paragraph/V1'
  }

  const output = blueprint(blueprintTitle, data.id, data.parentId, data.index, element)
  const contentEditableNodeId = app.makeId()
  const html = headlineUtils.wrapSpan(element.content.html)
  const css = properties.css(element.id, type)

  console.log('\n\n\n')
  console.log('original html', element.content.html)
  console.log('new html', html)
  console.log('\n\n\n')

  let children = []
  let fontWeight = css['font-weight']
  let boldColor = ''

  if (/<\/?[a-z][\s\S]*>/i.test(html)) {
    const htmlToJSON = (html, contentEditableNodeId) => {
      const dom = app.htmlToDom(html)
      const output = headlineUtils.parser(dom.outerHTML, contentEditableNodeId)
      return output
    }

    children = htmlToJSON(html, contentEditableNodeId)

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

  console.log('children', children)

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
    const dom = app.htmlToDom(html.replaceAll(/&nbsp;/g, '').replaceAll(/\n/g, ''))
    headlineUtils.wrapTextNodes(dom)
    let output = dom.innerHTML
    output = output.replaceAll(/\n/g, '')
    return output
  },

  wrapTextNodes: node => {
    if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
      const wrapper = document.createElement('span')
      wrapper.textContent = node.nodeValue
      node.parentNode.replaceChild(wrapper, node)
    } else if (node.nodeType === 1) {
      for (let i = 0; i < node.childNodes.length; i++) {
        headlineUtils.wrapTextNodes(node.childNodes[i])
      }
    }
  },

  parser: (html, contentEditableNodeId, index = 0, css) => {
    const dom = new DOMParser().parseFromString(html, 'text/html').body
    let fractionalIndexCounter = 0

    const attrs = {
      a: {
        className: 'elTypographyLink',
        rel: 'noopener noreferrer',
      },
    }

    const allowedTags = ['a', 'b', 'strong', 'u', 'i', 'strike', 'div', 'br']

    const createNode = (node, parentId = contentEditableNodeId) => {
      let tagName = node.nodeName.toLowerCase()
      if (node.nodeType === 3) {
        // Text node
        const nodeId = app.makeId()
        return {
          type: 'text',
          innerText: node.nodeValue.trim(),
          id: nodeId,
          version: 0,
          parentId: parentId,
          fractionalIndex: `a${fractionalIndexCounter++}`,
        }
      } else if (node.nodeType === 1 && allowedTags.includes(tagName)) {
        // HTML Element
        const nodeId = app.makeId()
        if (tagName === 'div') {
          tagName = 'text'
        }
        let nodeData = {
          type: tagName,
          id: nodeId,
          version: 0,
          parentId: parentId,
          fractionalIndex: `a${fractionalIndexCounter++}`,
        }
        if (tagName === 'a') {
          nodeData.attrs = {
            ...attrs[tagName],
            href: node.getAttribute('href'),
            id: node.getAttribute('id') || '',
            target: node.getAttribute('target') === '_blank' ? 'enable' : 'disable',
            style: { color: node.style.color },
          }
        }
        if (node.childNodes && node.childNodes.length > 0) {
          nodeData.children = []
          Array.from(node.childNodes).forEach(childNode => {
            const childData = createNode(childNode, nodeId)
            if (childData) {
              nodeData.children.push(childData)
            }
          })
          if (nodeData.children.length === 0) delete nodeData.children // Delete empty children array
        }
        return nodeData
      }
      return null
    }

    let outputArray = []
    Array.from(dom.childNodes).forEach(node => {
      const nodeData = createNode(node)
      if (nodeData) {
        outputArray.push(nodeData)
      }
    })

    return outputArray.filter(node => !node.parentId || node.parentId === contentEditableNodeId)
  },
}
