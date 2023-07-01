const video = data => {
  const element = data.element
  const output = blueprint('Video/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'video')
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)

  theParams[`video_url`] = element.content.url || 'https://www.youtube.com/watch?v=Z7o9pbPHu0k'
  theParams[`video-${element.content.videoType}-autoplay`] = element.content.autoplay || '0'
  theParams[`video-${element.content.videoType}-controls`] = element.content.controls || '0'
  theParams[`video-${element.content.videoType}-unmute-label`] = element.content.unmuteLabel || ''
  theParams[`video-${element.content.videoType}-width--unit`] = 'px'
  theParams[`video-${element.content.videoType}-height--unit`] = 'px'
  theParams[`video-${element.content.videoType}-width`] = element.content.width
  theParams[`video-${element.content.videoType}-height`] = element.content.height
  theParams[`video-sticky-size`] = element.content.sticky.size || ''
  theParams[`video-sticky-position`] = element.content.sticky.position || ''
  theParams[`video-sticky-style`] = element.content.sticky.style || ''

  output.attrs = {
    'data-skip-background-settings': 'false',
    'data-skip-shadow-settings': 'false',
    'data-skip-corners-settings': 'false',
    style: {
      'margin-top': parseInt(element.css['margin-top']) || 0,
      'text-align': element.css['text-align'] || 'center',
      'padding-top': parseInt(css['padding-top']) || 0,
      'padding-bottom': parseInt(css['padding-bottom']) || 0,
      'padding-left': parseInt(css['padding-left']) || 0,
      'padding-right': parseInt(css['padding-right']) || 0,
      'background-color': css['background-color'],
      position: css['position'] || 'relative',
      'z-index': parseInt(css['z-index']) || 0,
    },
    'data-video-type': element.content.videoType || 'youtube',
    'data-video-title': element.content.title || '',
    'data-session-starter-text': element.content.starterText || '',
    'data-is-video-sticky': JSON.parse(element.content.sticky.enabled) || false,
    [`data-${element.content.videoType}-block-pause`]: JSON.parse(element.content.blockPause) || false,
    'data-sticky-closeable': element.content.sticky.closeable.toString(),
  }

  output.params = theParams

  output.selectors = {
    '.elVideoplaceholder_inner': {
      params: {
        '--style-background-image-url': element.content.bgImage,
      },
      attrs: {
        className: 'bgCoverCenter',
      },
    },
  }

  if (element.content.webm_url) {
    output.params[`video-webm-url`] = element.content.webm_url
  }

  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

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
