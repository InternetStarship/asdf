const featured_image = data => {
  const element = data.element
  const parentId = data.parentId
  const index = data.index
  const css_image = app.properties.css(element.id, 'featured_image_image')
  const css_headline = app.properties.css(element.id, 'featured_image_headline')
  const css_paragraph = app.properties.css(element.id, 'featured_image_paragraph')
  const borderRadius = app.properties.borderRadius(css_image)

  const innerFlexId = app.makeId()
  const innerSecondFlexId = app.makeId()

  const imageParams = app.params(css_image, 'element', element.id)
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
          visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
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
          visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
          text: data.element.content.headline_text,
          html: data.element.content.headline.replace(/<div/g, '<span').replace(/<\/div>/g, '</span>'),
          json: data.element.content.headline_json,
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
          visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
          text: data.element.content.paragraph_text,
          html: data.element.content.paragraph.replace(/<div/g, '<span').replace(/<\/div>/g, '</span>'),
          json: data.element.content.paragraph_json,
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

  const dom = document.querySelector(`#${element.id}`)

  const imageContainer = flex_container([imageJSON], parentId, index)
  imageContainer.attrs.style['flex-direction'] = 'column'
  imageContainer.attrs.style['flex-shrink'] = 2.3

  imageJSON.selectors['.elImage'].attrs.style = Object.assign(
    imageJSON.selectors['.elImage'].attrs.style,
    borderRadius
  )

  const radiusCSS = document.querySelector(`#${element.id} .ximg`)
  const radiusStyle = getComputedStyle(radiusCSS)
  const radiusValue = radiusStyle.borderRadius

  let radiusUnit = 'px'
  if (radiusCSS) {
    radiusUnit = radiusValue.match(/px|%/g)[0]
  }

  if (dom.classList.contains('elFeatureImage_60_40')) {
    imageContainer.attrs.style['width'] = 40
    radiusUnit = '%'
  } else if (dom.classList.contains('elFeatureImage_80_20')) {
    imageContainer.attrs.style['width'] = 20
    radiusUnit = '%'
  } else if (dom.classList.contains('elFeatureImage_50_50')) {
    imageContainer.attrs.style['width'] = 50
    radiusUnit = '%'
  } else if (dom.classList.contains('elFeatureImage_70_30')) {
    radiusUnit = '%'
    imageContainer.attrs.style['width'] = 30
  } else {
    imageContainer.attrs.style['width'] = 100
    imageContainer.params['width--unit'] = '%'
  }

  imageJSON.params = Object.assign(imageJSON.params, {
    'border-radius--unit': radiusUnit,
  })

  imageJSON.selectors['.elImage'].params = Object.assign(imageJSON.params, {
    'border-radius--unit': radiusUnit,
  })

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

  if (dom.classList.contains('elFeatureImage_60_40')) {
    textContainer.attrs.style['width'] = 60
    radiusUnit = '%'
  } else if (dom.classList.contains('elFeatureImage_80_20')) {
    textContainer.attrs.style['width'] = 80
    radiusUnit = '%'
  } else if (dom.classList.contains('elFeatureImage_50_50')) {
    textContainer.attrs.style['width'] = 50
    radiusUnit = '%'
  } else if (dom.classList.contains('elFeatureImage_70_30')) {
    radiusUnit = '%'
    textContainer.attrs.style['width'] = 70
  } else {
    textContainer.attrs.style['width'] = 100
    textContainer.params['width--unit'] = '%'
  }

  let flexContainer = [imageContainer, textContainer]
  if (dom.classList.contains('elScreenshot_left')) {
    flexContainer = [textContainer, imageContainer]
  }

  const output = flex_container(flexContainer, parentId, index)
  output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['align-items'] = 'flex-start'

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
