const columns = (columns, parentId) => {
  return columns.map((column, index) => {
    if (column) {
      const columnCSS = properties.css(column.id, 'column')
      const id = app.makeId()

      app.idList.push({
        type: 'column',
        cf1_id: column.id,
        cf2_id: id,
      })

      const borderRadius = properties.borderRadius(columnCSS)
      const backgroundClasses = document.querySelector(`[id="${column.id}"]`).classList
      let backgroundPosition = ''

      app.convertBackgroundPositionClassName(backgroundClasses, className => {
        backgroundPosition = className
      })

      const columnContainer = document.querySelector(`[id="${column.id}"] .col-inner`)

      const data = {
        type: 'ColContainer/V1',
        params: {
          mdNum: parseInt(column.size),
          colDirection: 'left',
          'margin-top--unit': 'px',
        },
        attrs: {
          style: {
            'margin-top': parseInt(columnContainer.style.marginTop) || 0,
            'padding-left': columnContainer.style.paddingLeft || 0,
            'padding-right': columnContainer.style.paddingRight || 0,
          },
        },
        id: id,
        version: 0,
        parentId: parentId,
        fractionalIndex: `a${index}`,
        selectors: {
          '& > .col-inner': {
            params: params(columnCSS, 'column', column.id),
            attrs: {
              className: `${backgroundPosition}`,
              style: {
                'padding-top': parseInt(columnCSS['padding-top']) || 0,
                'padding-bottom': parseInt(columnCSS['padding-bottom']) || 0,
                position: columnCSS['position'] || 'relative',
                'z-index': parseInt(columnCSS['z-index']) || 0,
                'margin-left': parseInt(columnCSS['padding-left']) || 0,
                'margin-right': parseInt(columnCSS['padding-right']) || 0,
                'padding-left': parseInt(columnCSS['padding-left']) || 0,
                'padding-right': parseInt(columnCSS['padding-right']) || 0,
              },
              'data-skip-background-settings': 'false',
              'data-skip-shadow-settings': 'false',
              'data-skip-corners-settings': 'false',
            },
          },
          '.col-inner': {},
        },
        children: elements(column.elements, id),
      }

      data.selectors['& > .col-inner'].attrs.style = Object.assign(
        data.selectors['& > .col-inner'].attrs.style,
        borderRadius
      )

      data.attrs = Object.assign(data.attrs, animations.attrs(document.querySelector(`[id="${column.id}"]`)))
      data.params = Object.assign(
        data.params,
        animations.params(document.querySelector(`[id="${column.id}"]`))
      )

      return data
    }
  })
}
