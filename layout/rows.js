const rows = (rows, parentId) => {
  return rows.map((row, index) => {
    if (row) {
      const id = app.makeId()

      app.idList.push({
        type: 'row',
        title: row.title,
        cf1_id: row.id,
        cf2_id: id,
      })

      const borderRadius = properties.borderRadius(row.css)
      const backgroundClasses = document.querySelector(`[id="${row.id}"]`).classList
      let backgroundPosition = ''

      app.convertBackgroundPositionClassName(backgroundClasses, className => {
        backgroundPosition = className
      })

      const data = {
        type: 'RowContainer/V1',
        attrs: {
          className: `${backgroundPosition}`,
          style: {
            width: row.css['width'],
            'margin-left': 'auto',
            'margin-right': 'auto',
            'margin-top': parseInt(row.css['margin-top']) || 0,
            'padding-top': parseInt(row.css['padding-top']) || 0,
            'padding-bottom': parseInt(row.css['padding-bottom']) || 0,
            position: row.css['position'] || 'relative',
            'z-index': parseInt(row.css['z-index']) || 0,
          },
          'data-skip-background-settings': 'false',
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          'data-skip-borders-settings': 'false',
        },
        params: params(row.css, 'row', row.id),
        id: id,
        version: 0,
        parentId: parentId,
        fractionalIndex: `a${index}`,
        children: columns(row.columns, id),
      }

      data.attrs = Object.assign(data.attrs, animations.attrs(document.querySelector(`[id="${row.id}"]`)))
      data.params = Object.assign(data.params, animations.params(document.querySelector(`[id="${row.id}"]`)))

      data.attrs.style = Object.assign(data.attrs.style, borderRadius)
      return data
    }
  })
}
