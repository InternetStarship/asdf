const video = data => {
  let pageDocument = document

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'video')
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)
  theParams[`video_url`] = element.content.url || 'https://www.youtube.com/watch?v=Z7o9pbPHu0k'
  theParams[`video-${element.content.videoType}-autoplay`] = element.content.autoplay || '0'
  theParams[`video-${element.content.videoType}-controls`] = element.content.controls || '0'
  theParams[`video-${element.content.videoType}-unmute-label`] = element.content.unmuteLabel || ''
  theParams[`video-${element.content.videoType}-width--unit`] = 'px'
  theParams[`video-${element.content.videoType}-height--unit`] = 'px'
  theParams[`video-${element.content.videoType}-width`] = element.content.width || ''
  theParams[`video-${element.content.videoType}-height`] = element.content.height || ''
  theParams[`video-sticky-size`] = element.content.sticky.size || ''
  theParams[`video-sticky-position`] = element.content.sticky.position || ''
  theParams[`video-sticky-style`] = element.content.sticky.style || ''

  const output = {
    type: 'Video/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    attrs: {
      'data-skip-background-settings': 'false',
      'data-skip-shadow-settings': 'false',
      'data-skip-corners-settings': 'false',
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-video-type': element.content.videoType || 'youtube',
      'data-video-title': element.content.title || '',
      'data-session-starter-text': element.content.starterText || '',
      'data-is-video-sticky': element.content.sticky.enabled || '',
      'data-sticky-closeable': element.content.sticky.closeable.toString(),
    },
    params: theParams,
    selectors: {
      '.elVideoplaceholder_inner': {
        params: {
          '--style-background-image-url': element.content.bgImage,
        },
        attrs: {
          className: 'bgCoverCenter',
        },
      },
    },
  }
  output.attrs.style = Object.assign(output.attrs.style, borderRadius)
  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(
    output.attrs,
    animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
  )
  output.params = Object.assign(
    output.params,
    animations.params(pageDocument.querySelector(`[id="${element.id}"]`))
  )

  if (!element.content.url) {
    app.recommendations.push({
      type: 'Video',
      status: 'Important',
      id: element.id,
      explainer:
        'This video type is not YouTube, Wistia or Vimeo and cannot be transferred. Your video has been replaced by a placeholder video. <strong>Make sure to set the correct video url before going live.</strong>',
    })
  }

  if (output.attrs['data-video-type'] === 'custom') {
    output.attrs['data-video-type'] = 'youtube'
  }

  return output
}
