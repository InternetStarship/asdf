const fb_comments = data => {
  let pageDocument = document

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, 'embed')
  const output = {
    type: 'CustomHtmlJs/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    params: {
      originalCode: element.content.code,
    },
    attrs: {
      style: {
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-skip-background-settings': 'false',
    },
  }
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

  return output
}
