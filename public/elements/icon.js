const icon = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'icon')
  const output = {
    type: 'Icon/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    selectors: {
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
    },
  }
  if (element.content.href) {
    output.params = {
      href: element.content.href,
      target: element.content.target,
    }
    output.params = Object.assign(
      output.params,
      animations.params(document.querySelector(`[id="${element.id}"]`))
    )
  }
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
    output.attrs = Object.assign(
      output.attrs,
      animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )
  }

  return output
}
