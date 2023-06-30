const list = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'list')
  const mainId = app.makeId()

  const children = []
  element.content.items.forEach((item, index) => {
    const itemID = app.makeId()
    const content = app.headlinePageTree(item.json, item.id)
    content.forEach((item, index) => {
      item.parentId = itemID
      item.fractionalIndex = 'a' + (index + 1).toString(36)
    })

    content[0] = {
      type: 'IconNode',
      attrs: {
        className: `${content[0].attrs.class} fa_icon`,
        contenteditable: 'false',
      },
      id: content[0].id,
      version: 0,
      parentId: itemID,
      fractionalIndex: content[0].fractionalIndex,
    }

    console.log(content, 'content')

    const data = {
      type: 'li',
      id: itemID,
      version: 0,
      parentId: mainId,
      fractionalIndex: 'a' + (index + 1).toString(36),
      children: content,
    }
    children.push(data)
  })

  const output = {
    type: 'BulletList/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${(index + 1).toString(36)}`,
    params: {},
    attrs: {
      style: {
        'margin-top': document.querySelector(`#${element.id}`).style.marginTop || 0,
        'text-align': css['text-align'] || 'left',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
        'font-size': parseInt(css['font-size']) || 16,
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    selectors: {
      '.elBulletList': {
        attrs: {
          'data-style-guide-content': 'm',
          style: {
            color: css['color'] || 'inherit',
            'text-align': css['text-align'] || 'left',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          'style-guide-override-content': true,
          'font-size--unit': 'px',
        },
      },
      '.elBulletList b,\n.elBulletList strong': {
        attrs: {
          style: {
            color: 'rgb(23, 45, 68)',
          },
        },
      },
      '.elBulletList .fa,\n.elBulletList .fas,\n.elBulletList .fa-fw': {
        attrs: {
          style: {
            color: 'rgb(70, 167, 98)',
          },
        },
      },
      '.elBulletList .elTypographyLink': {
        attrs: {
          style: {
            color: 'rgb(118, 239, 68)',
          },
        },
      },
    },
    children: [
      {
        type: 'ContentEditableNode',
        attrs: {
          'data-align-selector': '.elBulletList',
        },
        id: mainId,
        version: 0,
        parentId: id,
        fractionalIndex: 'a0',
        children: children,
      },
    ],
  }
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))
  output.params = Object.assign(
    output.params,
    animations.params(document.querySelector(`[id="${element.id}"]`))
  )
  return output
}
