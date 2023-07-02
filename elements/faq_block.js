const faq_block = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css_headline = properties.css(element.id, 'faq_block_headline')
  const css_paragraph = properties.css(element.id, 'faq_block_paragraph')

  const headlineId = app.makeId()
  const headlineJSON = headline(
    {
      element: {
        content: {
          visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
          text: data.element.content.headline_text,
          html: data.element.content.headline,
          json: data.element.content.headline_json,
        },
        id: element.id,
        css: css_headline,
        parentId: id,
      },
      id: headlineId,
      index: index,
    },
    'faq_block_headline',
    'faqPrepend',
    'faqIcon'
  )

  const paragraphDataJSON = headline(
    {
      element: {
        content: {
          visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
          text: data.element.content.paragraph_text,
          html: data.element.content.paragraph,
          json: data.element.content.paragraph_json,
        },
        id: element.id,
        css: css_paragraph,
        parentId: id,
      },
    },
    'faq_block_paragraph'
  )

  const output = flex_container([headlineJSON, paragraphDataJSON], parentId, index)
  output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
    output.attrs = Object.assign(
      output.attrs,
      animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )
  }

  output.attrs.id = element.id

  return output
}
