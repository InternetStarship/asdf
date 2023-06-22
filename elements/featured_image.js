/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const featured_image = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css_image = properties.css(element.id, 'featured_image_image')
  const css_headline = properties.css(element.id, 'featured_image_headline')
  const css_paragraph = properties.css(element.id, 'featured_image_paragraph')

  const innerFlexId = app.makeId()
  const innerSecondFlexId = app.makeId()

  const imageParams = params(css_image, 'element', element.id)
  imageParams['default-aspect-ratio'] = '1280 / 853'
  imageParams['default-aspect-ratio--unit'] = 'px'
  imageParams['--style-padding-horizontal'] = 0
  imageParams['--style-padding-horizontal--unit'] = 'px'
  imageParams['--style-padding-vertical'] = 0
  imageParams['--style-padding-vertical--unit'] = 'px'

  const imageJSON = image(
    {
      element: {
        content: {
          visible: app.checkVisibility(pageDocument.querySelector(`#${element.id}`)),
          src: data.element.content.image,
          alt: data.element.content.alt,
          width: data.element.content.image_width,
          height: data.element.content.image_height,
        },
        id: element.id,
        css: css_image,
        parentId: innerFlexId,
      },
      id: app.makeId(),
      index: index,
    },
    'featured_image_image'
  )

  const headlineJSON = headline(
    {
      element: {
        content: {
          visible: app.checkVisibility(pageDocument.querySelector(`#${element.id}`)),
          text: data.element.content.headline_text,
          html: data.element.content.headline.replace(/<div/g, '<span').replace(/<\/div>/g, '</span>'),
        },
        id: element.id,
        css: css_headline,
        parentId: innerSecondFlexId,
      },
      id: app.makeId(),
      index: index,
    },
    'featured_image_headline'
  )

  const paragraphDataJSON = headline(
    {
      element: {
        content: {
          visible: app.checkVisibility(pageDocument.querySelector(`#${element.id}`)),
          text: data.element.content.paragraph_text,
          html: data.element.content.paragraph.replace(/<div/g, '<span').replace(/<\/div>/g, '</span>'),
        },
        id: element.id,
        css: css_paragraph,
        parentId: innerSecondFlexId,
      },
      id: app.makeId(),
      index: index,
    },
    'featured_image_paragraph'
  )

  const imageContainer = flex_container([imageJSON], parentId, index)
  imageContainer.attrs.style['flex-direction'] = 'column'
  imageContainer.attrs.style['flex-shrink'] = 2.3

  let textContainer = ''
  if (data.element.content.headline_text && data.element.content.paragraph_text) {
    textContainer = flex_container([headlineJSON, paragraphDataJSON], parentId, index)
  } else if (!data.element.content.headline_text && data.element.content.paragraph_text) {
    textContainer = flex_container([paragraphDataJSON], parentId, index)
  } else if (data.element.content.headline_text && !data.element.content.paragraph_text) {
    textContainer = flex_container([headlineJSON], parentId, index)
  }

  if (textContainer !== '') {
    textContainer.attrs.style['flex-direction'] = 'column'
    textContainer.params['--style-padding-horizontal'] = 10
  }

  const output = flex_container([imageContainer, textContainer], parentId, index)
  output.attrs.style['margin-top'] = pageDocument.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['align-items'] = 'flex-start'

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
    output.attrs = Object.assign(
      output.attrs,
      animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
    )
  }

  return output
}
