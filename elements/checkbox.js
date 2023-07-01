const checkbox = (data, type = 'checkbox') => {
  const element = data.element
  const output = blueprint('Checkbox/V1', data.id, data.parentId, data.index, element)
  const contentEditableNodeId = app.makeId()
  const css = properties.css(element.id, type)
  let children = app.headlinePageTree(element.content.json, contentEditableNodeId)

  children = children.filter(function (element) {
    return element !== undefined
  })

  output.params = {
    type: 'custom_type',
    name: element.content.name,
    required: element.content.required === 'yes' ? true : false,
  }

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
    '.elCheckboxLabel .elCheckboxInput ~ .elCheckbox': {
      attrs: {
        style: {
          'font-family': css['font-family'],
          'letter-spacing': css['letter-spacing'] || 'normal',
          'line-height': css['line-height'] || 0,
          'font-size': parseInt(css['font-size']) || 26,
          color: css['color'],
          'text-transform': css['text-transform'] || 'none',
          'text-decoration': css['text-decoration'] || 'none',
          'text-align': css['text-align'] || 'center',
          opacity: parseInt(css['opacity']) || 1,
        },
      },
    },
  }

  output.children = [
    {
      type: 'ContentEditableNode',
      id: contentEditableNodeId,
      slotName: 'label',
      version: 0,
      parentId: data.id,
      fractionalIndex: 'a0',
      children: children,
    },
  ]

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  return output
}
