const embed = data => {
  const element = data.element
  const output = app.blueprint('CustomHtmlJs/V1', data.id, data.parentId, data.index, element)
  const css = app.properties.css(element.id, 'embed')

  // Note: this requires children to work right away. However, since there can be
  // any content we should render this in cf2 editor some how.....
  output.params = {
    originalCode: element.content.code,
  }

  output.attrs = {
    style: {
      position: css['position'] || 'relative',
      'z-index': parseInt(css['z-index']) || 0,
    },
  }

  output.attrs.id = element.id

  return output
}
