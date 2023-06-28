const sections = (sections, parentId) => {
  return sections.map(section => {
    if (section && section.id !== 'modalPopup') {
      const id = app.makeId()

      app.idList.push({
        type: 'section',
        title: section.title,
        cf1_id: section.id,
        cf2_id: id,
      })

      const borderRadius = properties.borderRadius(section.css)
      const containerClasses = [
        'smallContainer',
        'midContainer',
        'midWideContainer',
        'wideContainer',
        'fullContainer',
      ]
      const stickyClasses = ['stickyTop', 'stickyBottom']
      const currentClasses = document.querySelector(`[id="${section.id}"]`).getAttribute('class')
      const containerClass = containerClasses.find(item => currentClasses.includes(item))
      const stickyClass = stickyClasses.find(item => currentClasses.includes(item))
      const backgroundClasses = document.querySelector(`[id="${section.id}"]`).classList
      let backgroundPosition = ''

      app.convertBackgroundPositionClassName(backgroundClasses, className => {
        backgroundPosition = className
      })

      const data = {
        type: 'SectionContainer/V1',
        attrs: {
          className: `${containerClass} ${stickyClass} ${backgroundPosition}`,
          style: {
            'margin-top': parseInt(section.css['margin-top']) || 0,
            'padding-top': parseInt(section.css['padding-top']) || 0,
            'padding-bottom': parseInt(section.css['padding-bottom']) || 0,
            'padding-left': parseInt(section.css['padding-left']) || 0,
            'padding-right': parseInt(section.css['padding-right']) || 0,
            position: section.css['position'] || 'relative',
            'z-index': parseInt(section.css['z-index']) || 0,
          },
          'data-section-colors': 'lightest',
          'data-skip-background-settings': 'false',
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          'data-skip-borders-settings': 'false',
        },
        params: params(section.css, 'section', section.id),
        id: id,
        version: 0,
        parentId: parentId,
        fractionalIndex: 'a0',
        children: rows(section.rows, id),
      }

      data.attrs = Object.assign(data.attrs, animations.attrs(document.querySelector(`[id="${section.id}"]`)))
      data.params = Object.assign(
        data.params,
        animations.params(document.querySelector(`[id="${section.id}"]`))
      )

      data.attrs.style = Object.assign(data.attrs.style, borderRadius)
      return data
    }
  })
}
