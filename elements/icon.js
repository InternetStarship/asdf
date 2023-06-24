const icon = data => {
  const element = data.element
  const output = blueprint('Icon/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'icon')

  output.selectors = {
    '.fa_icon': {
      attrs: {
        className: element.content.fontAwesome,
        style: {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'font-size': parseInt(css['font-size']) || 0,
        },
      },
      params: {
        'font-size--unit': 'px',
      },
    },
    '.iconElement': {
      attrs: {
        style: {
          'margin-top': parseInt(element.css['margin-top']) || 0,
          'text-align': css['text-align'] || 'center',
          'padding-top': parseInt(css['padding-top']) || 0,
          'padding-bottom': parseInt(css['padding-bottom']) || 0,
          position: css['position'] || 'relative',
          'z-index': parseInt(css['z-index']) || 0,
          opacity: parseInt(css['opacity']) || 1,
        },
      },
      params: params(css, 'element', element.id),
    },
    '.iconElement .fa, .iconElement .fas, .iconElement .fa-fw': {
      attrs: {
        style: {
          color: css['color'],
        },
      },
    },
  }

  return output
}
