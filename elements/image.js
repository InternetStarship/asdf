const image = data => {
  const element = data.element
  const output = blueprint('Image/V2', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'image')
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)

  theParams['default-aspect-ratio'] = '1280 / 853'
  // theParams['--style-padding-horizontal'] = 0
  // theParams['--style-padding-horizontal--unit'] = 'px'
  // theParams['--style-padding-vertical'] = 0
  // theParams['--style-padding-vertical--unit'] = 'px'

  output.params = {
    'padding-top--unit': 'px',
    'padding-bottom--unit': 'px',
    'padding-left--unit': 'px',
    'padding-right--unit': 'px',
    'padding-horizontal--unit': 'px',
    'padding-horizontal': parseInt(css['padding-left']) || 0,
  }

  output.params = Object.assign(output.params, theParams)

  output.attrs = {
    style: {
      'margin-top': parseInt(element.css['margin-top']) || 0,
      'text-align': element.css['text-align'] || 'center',
      position: css['position'] || 'relative',
      'padding-top': parseInt(css['padding-top']) || 0,
      'padding-bottom': parseInt(css['padding-bottom']) || 0,
      'padding-left': parseInt(css['padding-left']) || 0,
      'padding-right': parseInt(css['padding-right']) || 0,
      'background-color': css['background-color'],
      'z-index': parseInt(css['z-index']) || 0,
      opacity: parseInt(css['opacity']) || 1,
    },
    'data-skip-corners-settings': 'false',
    'data-skip-borders-settings': 'false',
    'data-skip-shadow-settings': 'false',
    'data-skip-background-settings': 'false',
  }

  output.selectors = {
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
      },
    },
  }

  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

  if (element.content.link) {
    output.selectors['.elImage'].attrs['data-element-link'] = element.content.link
    output.selectors['.elImage'].attrs.target = element.content.target
  }

  return output
}
