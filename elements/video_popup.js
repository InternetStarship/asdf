const video_popup = (data, type = 'video_popup') => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, type) || element.css
  const borderRadius = properties.borderRadius(css)

  const output = {
    type: 'VideoPopup/V1',
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
          style: {
            width: parseInt(element.content.width),
            height: parseInt(element.content.height),
          },
          'data-blurry-image-enabled': false,
        },

        params: {
          'default-aspect-ratio': '1218 / 684',
          'data-lazy-loading': 'false',
          'data-image-quality': 100,
          'data-skip-corners-settings': 'false',
          'data-skip-shadow-settings': 'false',
        },
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

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))
  output.params = Object.assign(
    output.params,
    animations.params(document.querySelector(`[id="${element.id}"]`))
  )

  output.attrs.id = element.id

  return output
}
