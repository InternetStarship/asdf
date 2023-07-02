const video_popup = (data, type = 'video_popup') => {
  const element = data.element
  const output = blueprint('VideoPopup/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, type) || element.css
  const borderRadius = properties.borderRadius(css)

  output.params = {
    'padding-top--unit': 'px',
    'padding-bottom--unit': 'px',
    'padding-horizontal--unit': 'px',
    'padding-horizontal': parseInt(css['padding-left']) || 0,
    imageUrl: [
      {
        type: 'text',
        innerText: element.content.src,
      },
    ],
  }

  output.attrs = {
    style: {
      'margin-top': parseInt(element.css['margin-top']) || 0,
      'text-align': element.css['text-align'] || 'center',
      'padding-top': parseInt(css['padding-top']) || 0,
      'padding-bottom': parseInt(css['padding-bottom']) || 0,
      position: css['position'] || 'relative',
      'z-index': parseInt(css['z-index']) || 0,
    },
    'data-skip-background-settings': 'false',
  }

  output.selectors = {
    '.elVideoWrapper': {
      params: {
        video_url: element.content.video_url,
        '--style-background-color': 'rgba(0, 0, 0, 0.8)',
      },
      attrs: {
        'data-video-type': 'youtube',
        'data-skip-background-settings': 'true',
      },
    },
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
          filter: css['filter'] || 'none',
          'object-fit': 'fill',
          'object-position': 'center',
          'max-width': '100%',
          'vertical-align': 'bottom',
          'aspect-ratio': 'auto',
          '-webkit-box-sizing': 'border-box',
          '-moz-box-sizing': 'border-box',
          'box-sizing': 'border-box',
          'text-align': element.css['text-align'] || 'center',
          position: css['position'] || 'relative',
          'padding-top': parseInt(css['padding-top']) || 0,
          'padding-bottom': parseInt(css['padding-bottom']) || 0,
          'padding-left': parseInt(css['padding-left']) || 0,
          'padding-right': parseInt(css['padding-right']) || 0,
          'background-color': css['background-color'],
          'z-index': parseInt(css['z-index']) || 0,
          opacity: parseFloat(css['opacity']) || 1,
        },
      },
      params: params(properties.css(element.id, type), 'element', element.id),
    },
  }

  output.selectors['.elImage'].attrs.style = Object.assign(
    output.selectors['.elImage'].attrs.style,
    borderRadius
  )

  const radiusCSS = document.querySelector(`#${element.id} .ximg`)
  let radiusUnit = 'px'

  if (radiusCSS) {
    const radiusStyle = getComputedStyle(radiusCSS)
    const radiusValue = radiusStyle.borderRadius

    if (radiusCSS) {
      radiusUnit = radiusValue.match(/px|%/g)[0]
    }
  }

  output.params['border-radius--unit'] = radiusUnit
  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

  output.attrs.id = element.id

  return output
}
