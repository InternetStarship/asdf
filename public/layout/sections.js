const sections = (sections, parentId) => {
  let pageDocument = document

  return sections.map(section => {
    if (section.id !== 'modalPopup') {
      const id = app.makeId()

      const borderRadius = properties.borderRadius(section.css)
      const containerClasses = [
        'smallContainer',
        'midContainer',
        'midWideContainer',
        'wideContainer',
        'fullContainer',
      ]
      const stickyClasses = ['stickyTop', 'stickyBottom']
      const currentClasses = pageDocument.querySelector(`[id="${section.id}"]`).getAttribute('class')
      const containerClass = containerClasses.find(item => currentClasses.includes(item))
      const stickyClass = stickyClasses.find(item => currentClasses.includes(item))
      const backgroundClasses = pageDocument.querySelector(`[id="${section.id}"]`).classList
      let backgroundPosition = ''
      const bgSizeClasses = ['bgCover', 'bgCover100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']
      const bgSizeCF2Classes = ['bgCoverCenter', 'bgW100', 'bgNoRepeat', 'bgRepeat', 'bgRepeatX', 'bgRepeatY']

      bgSizeClasses.forEach((item, index) => {
        if (backgroundClasses.contains(item)) {
          backgroundPosition = bgSizeCF2Classes[index]
        }
      })

      const data = {
        type: 'SectionContainer/V1',
        attrs: {
          className: `${containerClass} ${stickyClass} ${backgroundPosition}`,
          style: {
            'margin-top': parseInt(section.css['margin-top']) || 0,
            'padding-top': parseInt(section.css['padding-top']) || 0,
            'padding-bottom': parseInt(section.css['padding-bottom']) || 0,
            position: section.css['position'] || 'relative',
            'z-index': parseInt(section.css['z-index']) || 0,
          },
          'data-section-colors': 'lightest',
          'data-skip-background-settings': 'false',
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
        },
        params: params(section.css, 'section', section.id),
        id: id,
        version: 0,
        parentId: parentId,
        fractionalIndex: 'a0',
        children: rows(section.rows, id),
      }

      data.attrs = Object.assign(
        data.attrs,
        animations.attrs(pageDocument.querySelector(`[id="${section.id}"]`))
      )
      data.params = Object.assign(
        data.params,
        animations.params(pageDocument.querySelector(`[id="${section.id}"]`))
      )

      data.attrs.style = Object.assign(data.attrs.style, borderRadius)
      return data
    }
  })
}
