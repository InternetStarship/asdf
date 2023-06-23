function init() {
  const contentId = 'testing...'
  const page_tree = {
    version: 103,
    content: {
      type: 'ContentNode',
      id: contentId,
      params: {},
      attrs: {},
      children: [],
    },
    settings: {},
    popup: {},
  }
  let css = ''
  let google_font_families = ''

  const dom = document.querySelector('.containerWrapper')

  page_tree.content.children = generate.sections(dom)

  css = ''
  google_font_families = ''

  const response = {
    css: css,
    page_tree: page_tree, // JSON.stringify(page_tree),
    google_font_families: google_font_families,
  }

  console.info('Classic is sending back the response.', response)
  window.parent.postMessage(response, '*')
}
