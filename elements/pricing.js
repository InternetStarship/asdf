/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const pricing = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const parentId = data.parentId
  const index = data.index
  const children = []
  const children_header = []

  children_header.push(
    headline(
      {
        element: {
          content: {
            text: data.element.content.header.label.text,
            html: data.element.content.header.label.html,
          },
          id: element.id,
          css: properties.css(element.id, `pricing_label_headline`),
        },
        id: app.makeId(),
        index: 0,
      },
      `pricing_label_headline`
    )
  )
  children_header.push(
    headline(
      {
        element: {
          content: {
            text: data.element.content.header.figure.text,
            html: data.element.content.header.figure.html,
          },
          id: element.id,
          css: properties.css(element.id, `pricing_figure_headline`),
        },
        id: app.makeId(),
        index: 1,
      },
      `pricing_figure_headline`
    )
  )
  children_header.push(
    headline(
      {
        element: {
          content: {
            text: data.element.content.header.foreword.text,
            html: data.element.content.header.foreword.html,
          },
          id: element.id,
          css: properties.css(element.id, `pricing_foreword_headline`),
        },
        id: app.makeId(),
        index: 2,
      },
      `pricing_foreword_headline`
    )
  )

  const header = flex_container(children_header, parentId, index)
  header.attrs.style['flex-direction'] = 'column'

  const headerContainer = pageDocument.querySelector(`#${element.id} .panel-heading`)
  const headerStyles = getComputedStyle(headerContainer)

  header.attrs.style['background-color'] = headerStyles.getPropertyValue('background-color') || 'transparent'
  header.params['--style-padding-horizontal'] = '15px'
  header.attrs.style['padding-top'] = '25px'
  header.attrs.style['padding-bottom'] = '25px'

  for (let i = 0; i < element.content.items.length; i++) {
    const lineItem = headline(
      {
        element: {
          content: {
            text: data.element.content.items[i].text,
            html: data.element.content.items[i].html,
          },
          id: element.id,
          css: properties.css(element.id, `pricing_headline_${i + 1}`),
        },
        id: app.makeId(),
        index: i,
      },
      `pricing_headline_${i + 1}`
    )
    lineItem.selectors['.elHeadline'].params['--style-border-width'] = '0px'
    lineItem.params['--style-border-bottom'] = '0px'
    children.push(lineItem)
  }
  const listItems = flex_container(children, parentId, index)
  listItems.attrs.style['flex-direction'] = 'column'

  const output = flex_container([header, listItems], parentId, index)
  output.attrs.style['margin-top'] = pageDocument.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'
  output.attrs.style['gap'] = 0

  const mainContainer = pageDocument.querySelector(`#${element.id} .pricing-panel`)
  const containerStyles = getComputedStyle(mainContainer)
  const borderRadius = properties.borderRadius(containerStyles)

  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

  output.attrs.style['background-color'] =
    containerStyles.getPropertyValue('background-color') || 'transparent'
  output.params['--style-padding-horizontal'] = containerStyles.getPropertyValue('padding-left') || '0px'
  output.attrs.style['padding-top'] = containerStyles.getPropertyValue('padding-top') || '0px'
  output.attrs.style['padding-bottom'] = containerStyles.getPropertyValue('padding-bottom') || '0px'
  output.attrs.style['overflow'] = 'hidden'

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
    output.attrs = Object.assign(
      output.attrs,
      animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
    )
  }

  return output
}
