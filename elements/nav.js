/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const navigation = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const parentId = data.parentId
  const index = data.index
  const children = []

  for (let i = 0; i < element.content.items.length; i++) {
    const headlineJSON = headline(
      {
        element: {
          content: {
            text: data.element.content.items[i].content_text,
            html: data.element.content.items[i].content_html,
          },
          id: element.id,
          css: properties.css(element.id, `navigation_headline_${i + 1}`),
        },
        id: app.makeId(),
        index: i,
      },
      `navigation_headline_${i + 1}`
    )
    headlineJSON.attrs.style['margin-top'] = 0

    children.push(headlineJSON)
  }

  const output = flex_container(children, parentId, index)
  output.attrs.style['margin-top'] = pageDocument.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'row'
  output.attrs.style['justify-content'] = 'center'
  output.attrs.style['gap'] = 2.3

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
    output.attrs = Object.assign(
      output.attrs,
      animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
    )
  }

  return output
}
