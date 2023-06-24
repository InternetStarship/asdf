const image = (data, type = 'image') => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, type) || element.css
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)
  theParams['default-aspect-ratio'] = '1280 / 853'
  theParams['--style-padding-horizontal'] = 0
  theParams['--style-padding-horizontal--unit'] = 'px'
  theParams['--style-padding-vertical'] = 0
  theParams['--style-padding-vertical--unit'] = 'px'

  const output = {
    type: 'Image/V1',
    params: {
      'padding-top--unit': 'px',
      'padding-bottom--unit': 'px',
      'padding-horizontal--unit': 'px',
      'padding-horizontal': parseInt(css['padding-left']) || 0,
    },
    attrs: {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-skip-background-settings': 'false',
    },
    selectors: {
      '.elImage': {
        attrs: {
          alt: element.content.alt,
          src: [
            {
              type: 'text',
              innerText: element.content.src,
            },
          ],
          'data-blurry-image-enabled': false,
          style: {
            width: parseInt(element.content.width),
            height: parseInt(element.content.height),
            'object-fit': 'fill',
            'object-position': 'center',
          },
          'data-lazy-loading': 'false',
          'data-image-quality': 100,
          'data-skip-corners-settings': 'false',
          'data-skip-shadow-settings': 'false',
        },
        params: theParams,
      },
    },
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
  }
  output.selectors['.elImage'].attrs.style = Object.assign(
    output.selectors['.elImage'].attrs.style,
    borderRadius
  )
  if (element.content.link) {
    output.selectors['.elImage'].attrs['data-element-link'] = element.content.link
    output.selectors['.elImage'].attrs.target = element.content.target
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
