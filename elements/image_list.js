/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const image_list = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css_headline = properties.css(element.id, 'image_list_headline')
  const children = []

  for (let i = 0; i < element.content.list.length; i++) {
    const headlineJSON = headline(
      {
        element: {
          content: {
            text: data.element.content.list[i],
            html: data.element.content.list[i],
          },
          id: element.id,
          css: css_headline,
        },
        id: app.makeId(),
        index: i,
      },
      'image_list_headline'
    )

    if (headlineJSON.selectors['.elHeadline'].params) {
      delete headlineJSON.selectors['.elHeadline'].params['--style-background-image-url']
      headlineJSON.selectors['.elHeadline'].params['--style-padding-horizontal'] = 20
      headlineJSON.attrs.style['padding-top'] = 0
    }

    const imageJSON = image({
      element: {
        content: {
          src: data.element.content.image,
          alt: 'Bullet point',
          width: 32,
          height: 32,
        },
        id: element.id,
        css: {
          width: '32px',
          height: '32px',
        },
      },
      id: app.makeId(),
      index: i,
    })

    const innerFlexContainer = flex_container([imageJSON, headlineJSON], id, i)

    if (i === 0) {
      innerFlexContainer.attrs.style['margin-top'] = 10
    }

    children.push(innerFlexContainer)
  }

  const output = flex_container(children, parentId, index)
  output.attrs.style['margin-top'] = pageDocument.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'
  output.attrs.style['gap'] = 0.5

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
    output.attrs = Object.assign(
      output.attrs,
      animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
    )
  }

  return output
}
