const text_block = data => {
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
            json: data.element.content.items[i].json,
          },
          id: element.id,
          css: properties.css(
            element.id,
            `text_block_headline_${i + 1}_${data.element.content.items[i].type}`
          ),
        },
        id: app.makeId(),
        index: i,
      },
      `text_block_headline_${i + 1}_${data.element.content.items[i].type}`
    )
    children.push(headlineJSON)
  }

  const output = flex_container(children, parentId, index)
  output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'
  output.attrs.style['gap'] = 0.2

  const mainContainer = document.querySelector(`#${element.id} .elTextblock`)
  const containerStyles = getComputedStyle(mainContainer)
  const borderRadius = properties.borderRadius(containerStyles)

  output.attrs.style = Object.assign(output.attrs.style, borderRadius)

  output.attrs.style['background-color'] =
    containerStyles.getPropertyValue('background-color') || 'transparent'
  output.params['--style-padding-horizontal'] = containerStyles.getPropertyValue('padding-left') || '0px'
  output.attrs.style['padding-top'] = containerStyles.getPropertyValue('padding-top') || '0px'
  output.attrs.style['padding-bottom'] = containerStyles.getPropertyValue('padding-bottom') || '0px'

  if (
    mainContainer.classList.contains('de2column') ||
    mainContainer.classList.contains('de3column') ||
    mainContainer.classList.contains('de4column')
  ) {
    let columnCount = 2
    if (mainContainer.classList.contains('de3column')) {
      columnCount = 3
    }
    if (mainContainer.classList.contains('de4column')) {
      columnCount = 4
    }
    app.copiedCSS += `/* CSS for Text Block id: ${output.id} */`
    app.copiedCSS += `.id-${output.id}[data-page-element="FlexContainer/V1"] { 
  column-count: ${columnCount} !important;
  display: block !important;
}`
  }

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))

  return output
}
