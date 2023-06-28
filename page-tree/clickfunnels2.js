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
    console.log('what is up?!?')
    backgroundParams['video-bg-style-type'] = 'fill'
    backgroundParams['video-bg-url'] = videoBg.getAttribute('data-youtube-background')
    backgroundParams['video-bg-thumbnail-background'] = true
    backgroundParams['video-bg-use-background-as-overlay'] = false
    backgroundParams['video-bg-type'] = 'youtube'

    console.log(videoBg.getAttribute('data-youtube-background'))

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

  let output = JSON.stringify(convertedJSON)
  output = output.replace(/null,/g, '').replace(/,null/g, '')

  document.querySelectorAll('.de').forEach(dom => {
    if (dom.getAttribute('data-de-type') === 'social') {
      app.recommendations.push({
        type: 'Social Share',
        status: 'Not Supported',
        explainer: 'The social share element is not supported.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'privacy_notice') {
      app.recommendations.push({
        type: 'Privacy Notice',
        status: 'Not Supported',
        explainer: 'The Privacy Notice element is not supported.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'videogallery1') {
      app.recommendations.push({
        type: 'Video Popup',
        status: 'Custom Code',
        explainer:
          'The video popup element is not supported inside of ClickFunnels 2.0 yet. This element will be converted to a custom code element.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'button') {
      if (
        dom.querySelector('a').href.includes('#') &&
        dom.querySelector('a').href.split('#')[1] === 'fb-optin-url'
      ) {
        app.recommendations.push({
          type: 'FB Optin Button',
          status: 'Not Supported',
          explainer:
            'The Facebook optin button is not supported inside of ClickFunnels 2.0. This element will be converted to a normal button.',
        })
      }
    }

    if (dom.getAttribute('data-de-type') === 'sms') {
      app.recommendations.push({
        type: 'SMS',
        status: 'Not Supported',
        explainer: 'The SMS element is not supported inside of ClickFunnels 2.0 and has not been copied.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'survey') {
      app.recommendations.push({
        type: 'Survey',
        status: 'Coming Soon',
        explainer: 'The survey element is work-in-progress and should be available soon.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'fbcomments') {
      app.recommendations.push({
        type: 'Facebook Comments',
        status: 'Not Supported',
        explainer:
          'The FB Comments element is not supported inside of ClickFunnels 2.0 and has not been copied.',
      })
    }
  })

  return convertedJSON
}
