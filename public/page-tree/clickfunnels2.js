const clickfunnels2_pagetree = (clickfunnels_classic_page_tree, new_page_tree) => {
  // console.clear()
  console.time('conversion')

  let pageDocument = document

  const contentId = app.makeId()
  const popupId = app.makeId()
  const htmlComputedStyles = getComputedStyle(pageDocument.querySelector('html'))
  const videoBg = pageDocument.querySelector('.modalBackdropWrapper')
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
    backgroundParams['--style-video-bg-style-type'] = 'fill'
    backgroundParams['--style-video-bg-url'] = videoBg.getAttribute('data-youtube-background')
    backgroundParams['--style-video-bg-thumbnail-background'] = false
    backgroundParams['--style-video-bg-use-background-as-overlay'] = false
    backgroundParams['--style-video-bg-type'] = 'youtube'

    const endaction = videoBg.getAttribute('data-youtube-endaction')
    switch (endaction) {
      case 'popup':
        backgroundParams['--style-video-bg-endaction'] = 'open-popup'
        break
      case 'redirect':
        backgroundParams['--style-video-bg-endaction'] = 'redirect'
        backgroundParams['--style-video-bg-redirect-url'] = videoBg.getAttribute('data-youtube-redirecturl')
        break
    }
  }

  const backgroundAttrs = {
    'data-skip-background-settings': 'false',
    'data-skip-background-video-settings': videoBg.getAttribute('data-youtube-selectbox') ? 'false' : 'true',
    className: '',
    style: {},
  }
  const backgroundClasses = pageDocument.querySelector('html').classList
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
        data.vertical = 'bottom'
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
        data.horizontal = 'right'
      }
    }

    backgroundAttrs['style']['background-position'] = `${data.horizontal} ${data.vertical} !important`
  }

  const bgSizeClasses = ['bgCover', 'bgCover100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']
  const bgSizeCF2Classes = ['bgCoverCenter', 'bgW100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']

  bgSizeClasses.forEach((item, index) => {
    if (backgroundClasses.contains(item)) {
      backgroundAttrs.className = 'bgCoverV2Center ' + bgSizeCF2Classes[index]
    }
  })

  const convertedJSON = {
    version: 95,
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

  console.group('ClickFunnels Classic Page Conversion')
  console.timeEnd('conversion')
  console.info('Inspect the JSON for ClickFunnels 2.0:', JSON.parse(output))
  console.info('ID Conversion List:', app.idList)
  console.groupEnd()

  pageDocument.querySelectorAll('.de').forEach(dom => {
    if (dom.getAttribute('data-de-type') === 'social') {
      app.recommendations.push({
        type: 'Social Share',
        status: 'Not Supported',
        id: dom.id,
        explainer: 'The social share element is not supported.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'privacy_notice') {
      app.recommendations.push({
        type: 'Privacy Notice',
        status: 'Not Supported',
        id: dom.id,
        explainer: 'The Privacy Notice element is not supported.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'videogallery1') {
      app.recommendations.push({
        type: 'Video Popup',
        status: 'Custom Code',
        id: dom.id,
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
          id: dom.id,
          explainer:
            'The Facebook optin button is not supported inside of ClickFunnels 2.0. This element will be converted to a normal button.',
        })
      }
    }

    if (dom.getAttribute('data-de-type') === 'sms') {
      app.recommendations.push({
        type: 'SMS',
        status: 'Not Supported',
        id: dom.id,
        explainer: 'The SMS element is not supported inside of ClickFunnels 2.0 and has not been copied.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'survey') {
      app.recommendations.push({
        type: 'Survey',
        status: 'Coming Soon',
        id: dom.id,
        explainer: 'The survey element is work-in-progress and should be available soon.',
      })
    }

    if (dom.getAttribute('data-de-type') === 'fbcomments') {
      app.recommendations.push({
        type: 'Facebook Comments',
        status: 'Not Supported',
        id: dom.id,
        explainer:
          'The FB Comments element is not supported inside of ClickFunnels 2.0 and has not been copied.',
      })
    }
  })

  app.idList = []
  app.copiedCSS = ''
  app.copiedJS = ''

  return JSON.parse(output)
}
