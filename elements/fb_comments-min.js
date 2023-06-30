const fb_comments = data => {
  const element = data.element
  const output = blueprint('CustomHtmlJs/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'embed')

  // Note: this requires children to work right away. However, since there can be
  // any content we should render this in cf2 editor some how.....
  // Note: the code is generated for the FB comments in `clickfunnels-classic.js`
  // where: if (dom.getAttribute('data-de-type') === 'fbcomments')
  output.params = {
    originalCode: element.content.code,
  }

  output.attrs = {
    style: {
      position: css['position'] || 'relative',
      'z-index': parseInt(css['z-index']) || 0,
    },
    'data-skip-background-settings': 'false',
  }

  return output
}
