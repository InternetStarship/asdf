const image_list = data => {
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
            text: data.element.content.list[i].text,
            html: data.element.content.list[i].html,
            json: data.element.content.list[i].json,
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

    headlineJSON.attrs.style['padding-left'] = 20

    let imageJSON = null
    let flexData = [headlineJSON]

    const domContainerList = document.querySelector(`#${element.id} ul`)
    const domContainerListFirstItem = document.querySelector(`#${element.id} ul li`)
    let elImage = data.element.content.image

    if (domContainerList.classList.contains('listImage16')) {
      elImage = null
    }

    if (elImage) {
      imageJSON = image({
        element: {
          content: {
            visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
            src: elImage,
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
      imageJSON.attrs.style['margin-top'] = 10
      flexData = [imageJSON, headlineJSON]
    }

    const innerFlexContainer = flex_container(flexData, id, i)

    if (domContainerListFirstItem) {
      const itemStyles = getComputedStyle(domContainerListFirstItem)
      innerFlexContainer.attrs.style['border-bottom-width'] = itemStyles['border-bottom-width']
      innerFlexContainer.attrs.style['border-color'] = itemStyles['border-color']
      innerFlexContainer.attrs.style['border-style'] = itemStyles['border-style']
    }

    children.push(innerFlexContainer)
  }

  const output = flex_container(children, parentId, index)
  output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'
  output.attrs.style['gap'] = 0.5
  output.attrs.style['margin-left'] = document.querySelector(`#${element.id}`).style.marginLeft || 0

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))

  return output
}
