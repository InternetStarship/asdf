const divider = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = app.properties.css(element.id, 'divider')
  const cssContainer = app.properties.css(element.id, 'dividerContainer')
  const dividerInner = document.querySelector(`#${element.id} .elDividerInner`)
  const theParams = app.params(css, 'element', element.id)
  theParams['--style-border-top-width'] = parseInt(css['border-top-width']) || 0
  theParams['width--unit'] = '%'
  const alignment = dividerInner.getAttribute('data-align')
  const output = {
    type: 'Divider/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    params: {
      'margin-top--unit': 'px',
      '--style-padding-horizontal--unit': 'px',
      '--style-padding-horizontal': parseInt(cssContainer['padding-left']) || 0,
      'padding-bottom--unit': 'px',
      'padding-top--unit': 'px',
      'width--unit': '%',
    },
    attrs: {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'padding-top': parseInt(cssContainer['padding-top']) || 0,
        'padding-bottom': parseInt(cssContainer['padding-bottom']) || 0,
        position: element.css['position'] || 'relative',
        'z-index': parseInt(element.css['z-index']) || 0,
      },
    },
    selectors: {
      '.elDivider': {
        params: theParams,
        attrs: {
          style: {
            margin: '0 auto',
            width: parseInt(dividerInner.getAttribute('data-width-border')) || 100,
          },
          'data-skip-shadow-settings': 'false',
        },
      },
    },
  }

  if (alignment === 'left') {
    output.selectors['.elDivider'].attrs.style.margin = '0 auto 0 0'
  } else if (alignment === 'right') {
    output.selectors['.elDivider'].attrs.style.margin = '0 0 0 auto'
  }
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(
    output.attrs,
    app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
  )
  output.params = Object.assign(
    output.params,
    app.animations.params(document.querySelector(`[id="${element.id}"]`))
  )

  output.attrs.id = element.id
  return output
}
