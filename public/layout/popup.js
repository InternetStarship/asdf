const popup = (sections, parentId) => {
  let pageDocument = document

  const borderRadius = properties.borderRadius(sections[0].css)
  const containerClasses = [
    'smallContainer',
    'midContainer',
    'midWideContainer',
    'wideContainer',
    'fullContainer',
  ]
  const currentClasses = pageDocument.querySelector(`[id="${sections[0].id}"]`).getAttribute('class')
  const containerClass = containerClasses.find(item => currentClasses.includes(item))
  const backgroundClasses = pageDocument.querySelector(`[id="${sections[0].id}"]`).classList
  let backgroundPosition = ''
  const bgSizeClasses = ['bgCover', 'bgCover100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']
  const bgSizeCF2Classes = ['bgCoverCenter', 'bgW100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']

  bgSizeClasses.forEach((item, index) => {
    if (backgroundClasses.contains(item)) {
      backgroundPosition = bgSizeCF2Classes[index]
    }
  })

  pageDocument.querySelector('[data-editor="popup"]').click()
  const css = properties.css(null, 'popup')
  const cssBackdrop = properties.css(null, 'popup-backdrop')
  const popupWidth = pageDocument.querySelector('.containerModal').getBoundingClientRect()

  const popup = {
    type: 'ModalContainer/V1',
    id: parentId,
    version: 0,
    selectors: {
      '.containerModal': {
        attrs: {
          className: `${containerClass} ${backgroundPosition}`,
          style: {
            'margin-top': parseInt(css['margin-top']) || 0,
            'margin-bottom': parseInt(css['margin-bottom']) || 0,
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            width: parseInt(css['width']),
          },
          'data-section-colors': 'lightest',
          'data-show-popup-on-page-load': 'false',
          'data-skip-background-settings': 'false',
          'data-skip-corners-settings': 'false',
          'data-skip-shadow-settings': 'false',
        },
        params: params(css, 'section', sections[0].id),
      },
      '.modal-wrapper': {
        params: {
          '--style-background-color': cssBackdrop['background-color'],
          '--style-padding-horizontal': parseInt(cssBackdrop['padding-left']),
          '--style-padding-horizontal--unit': 'px',
        },
      },
      '.elModalInnerContainer': {
        params: {
          'width--unit': 'px',
        },
        attrs: {
          style: {
            width: popupWidth.width,
          },
        },
      },
    },
    attrs: {
      'data-selected-element': 'not-set',
    },
    children: [],
  }

  popup.selectors['.containerModal'].attrs.style = Object.assign(
    popup.selectors['.containerModal'].attrs.style,
    borderRadius
  )

  const classes = pageDocument.querySelector(`.containerModal`).getAttribute('class')

  if (classes.includes('bounce')) {
    popup.selectors['.containerModal'].attrs['data-show-popup-on-exit'] = 'true'
  } else {
    popup.selectors['.containerModal'].attrs['data-show-popup-on-exit'] = 'false'
  }

  popup.children = sections.map(section => {
    if (section.id === 'modalPopup') {
      const id = app.makeId()
      const data = {
        type: 'SectionContainer/V1',
        id: id,
        version: 0,
        parentId: parentId,
        fractionalIndex: 'a0',
        children: rows(section.rows, id),
      }

      return data
    }
  })
  pageDocument.querySelector('.closeLPModal').click()
  return popup
}
