const list = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'list')

  const children = []
  element.content.items.forEach((item, index) => {
    const itemID = app.makeId()
    children.push({
      type: 'li',
      id: itemID,
      version: 0,
      parentId: id,
      fractionalIndex: 'a' + index,
      children: [
        {
          type: 'IconNode',
          attrs: {
            className: 'fa fa-check fa_icon',
            contenteditable: 'false',
          },
          id: app.makeId(),
          version: 0,
          parentId: itemID,
          fractionalIndex: 'a0',
        },
        {
          type: 'text',
          innerText: ' ',
          id: app.makeId(),
          version: 0,
          parentId: itemID,
          fractionalIndex: 'a1',
        },
        {
          type: 'text',
          innerText: item,
          id: app.makeId(),
          version: 0,
          parentId: itemID,
          fractionalIndex: 'a3',
        },
      ],
    })
  })

  const output = {
    type: 'BulletList/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    params: {},
    attrs: {
      style: {
        'margin-top': document.querySelector(`#${element.id}`).style.marginTop || 0,
        'text-align': css['text-align'] || 'left',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
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
            'margin-top': parseInt(css['margin-top']),
            'text-align': css['text-align'] || 'left',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            'font-size': parseInt(css['font-size']) || 16,
            color: css['color'] || '#000000',
          },
        },

        params: {
          'font-size--unit': 'px',
        },
      },
    },
    children: children,
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
