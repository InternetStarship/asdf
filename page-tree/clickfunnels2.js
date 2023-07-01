const clickfunnels2_pagetree = (clickfunnels_classic_page_tree, new_page_tree) => {
  const contentId = app.makeId()
  const popupId = app.makeId()
  const htmlComputedStyles = getComputedStyle(document.querySelector('html'))
  const videoBg = document.querySelector('.modalBackdropWrapper')
  const backgroundParams = {}
  const backgroundColor = htmlComputedStyles.getPropertyValue('background-color')
  const backgroundImage = htmlComputedStyles.getPropertyValue('background-image')

  if (backgroundColor) backgroundParams['--style-background-color'] = backgroundColor
  if (backgroundImage) {
    backgroundParams['--style-background-image-url'] = backgroundImage
      .replace('url(', '')
      .replace(')', '')
      .replace(/"/g, '')
  }

  if (
    videoBg &&
    videoBg.getAttribute('data-youtube-selectbox') &&
    videoBg.getAttribute('data-youtube-selectbox') === 'youtube'
  ) {
    backgroundParams['video-bg-style-type'] = 'fill'
    backgroundParams['video-bg-url'] = videoBg.getAttribute('data-youtube-background')
    backgroundParams['video-bg-thumbnail-background'] = true
    backgroundParams['video-bg-use-background-as-overlay'] = false
    backgroundParams['video-bg-type'] = 'youtube'

    const endaction = videoBg.getAttribute('data-youtube-endaction')
    switch (endaction) {
      case 'popup':
        backgroundParams['video-bg-endaction'] = 'open-popup'
        break
      case 'redirect':
        backgroundParams['video-bg-endaction'] = 'redirect'
        backgroundParams['video-bg-redirect-url'] = videoBg.getAttribute('data-youtube-redirecturl')
        break
    }
  }

  const backgroundAttrs = {
    'data-skip-background-settings': 'false',
    'data-skip-background-video-settings': videoBg.getAttribute('data-youtube-selectbox') ? 'false' : 'true',
    className: '',
    style: {},
  }
  const backgroundClasses = document.querySelector('html').classList
  const backgroundPosition = htmlComputedStyles.getPropertyValue('background-position')

  if (backgroundPosition) {
    const checkCSS = backgroundPosition.split(' ')
    const data = {
      vertical: 0,
      horizontal: 0,
    }

    if (checkCSS[0].includes('%')) {
      if (parseInt(checkCSS[0]) === 50) {
        data.vertical = 'center'
      }

      if (parseInt(checkCSS[0]) === 100) {
        data.vertical = 'top'
      }

      if (parseInt(checkCSS[0]) === 0) {
        data.vertical = ''
      }
    }

    if (checkCSS[1].includes('%')) {
      if (parseInt(checkCSS[1]) === 50) {
        data.horizontal = 'center'
      }

      if (parseInt(checkCSS[1]) === 100) {
        data.horizontal = 'left'
      }

      if (parseInt(checkCSS[1]) === 0) {
        data.horizontal = ''
      }
    }

    backgroundAttrs['style']['background-position'] = `${data.horizontal} ${data.vertical} !important`

    if (backgroundClasses.contains('bgRepeatXBottom')) {
      backgroundAttrs['style']['background-position'] = `bottom !important`
    } else if (backgroundClasses.contains('bgRepeatXTop')) {
      backgroundAttrs['style']['background-position'] = `top !important`
    }
  }

  app.convertBackgroundPositionClassName(backgroundClasses, className => {
    backgroundAttrs.className = 'bgCoverV2Center ' + className
  })

  const convertedJSON = {
    version: null,
    content: {
      type: 'ContentNode',
      id: contentId,
      params: backgroundParams,
      attrs: backgroundAttrs,
      children: [],
    },
    settings: null,
    popup: { ...popup(clickfunnels_classic_page_tree, popupId) },
  }

  convertedJSON.content.children = sections(clickfunnels_classic_page_tree, contentId)
  convertedJSON.settings = settings()

  app.buildRecommendations()

  return convertedJSON
}
