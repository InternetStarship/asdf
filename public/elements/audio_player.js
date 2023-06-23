const audio_player = (data, type = 'audio_player') => {
  let pageDocument = document

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, type) || element.css
  const borderRadius = properties.borderRadius(css)

  const output = {
    type: 'Audio/V1',
    attrs: {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-audio-url': data.element.content.url || '',
      'data-audio-loop': data.element.content.lopp || 'no',
    },
    params: {},
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
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
  return output
}
