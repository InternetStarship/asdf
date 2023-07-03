const pricing = data => {
  const element = data.element
  const parentId = data.parentId
  const index = data.index
  const flexParentId = app.makeId()
  const children = []
  const children_header = []

  children_header.push(
    headline(
      {
        element: {
          content: {
            text: data.element.content.header.label.text,
            html: data.element.content.header.label.html,
            json: data.element.content.header.label.json,
          },
          id: element.id,
          css: app.properties.css(element.id, `pricing_label_headline`),
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
            json: data.element.content.header.figure.json,
          },
          id: element.id,
          css: app.properties.css(element.id, `pricing_figure_headline`),
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
            json: data.element.content.header.foreword.json,
          },
          id: element.id,
          css: app.properties.css(element.id, `pricing_foreword_headline`),
        },
        id: app.makeId(),
        index: 2,
      },
      `pricing_foreword_headline`
    )
  )

  const header = flex_container(children_header, flexParentId, index)
  header.attrs.style['flex-direction'] = 'column'

  const headerContainer = document.querySelector(`#${element.id} .panel-heading`)
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
            json: data.element.content.items[i].json,
          },
          id: element.id,
          css: app.properties.css(element.id, `pricing_headline_${i + 1}`),
        },
        id: app.makeId(),
        index: i,
      },
      `pricing_headline_${i + 1}`
    )
    children.push(lineItem)
  }

  const listItems = flex_container(children, flexParentId, index)
  listItems.attrs.style['flex-direction'] = 'column'

  const output = flex_container([header, listItems], parentId, index)

  output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'
  output.attrs.style['gap'] = 0

  const mainContainer = document.querySelector(`#${element.id} .pricing-panel`)
  const containerStyles = getComputedStyle(mainContainer)
  const borderRadius = app.properties.borderRadius(containerStyles)

  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

  output.attrs.style['background-color'] =
    containerStyles.getPropertyValue('background-color') || 'transparent'
  output.params['--style-padding-horizontal'] = containerStyles.getPropertyValue('padding-left') || '0px'
  output.attrs.style['padding-top'] = containerStyles.getPropertyValue('padding-top') || '0px'
  output.attrs.style['padding-bottom'] = containerStyles.getPropertyValue('padding-bottom') || '0px'
  output.attrs.style['overflow'] = 'hidden'

  output.params = Object.assign(
    output.params,
    app.params(app.properties.css(element.id, `pricing`), 'element', element.id)
  )

  output.params['width--unit'] = '%'

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs = Object.assign(
    output.attrs,
    app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
  )

  output.attrs.id = element.id

  return output
}
