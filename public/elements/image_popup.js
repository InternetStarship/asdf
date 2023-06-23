const image_popup = (data, type = 'image_popup') => {
  let pageDocument = document

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css = properties.css(element.id, type) || element.css
  const borderRadius = properties.borderRadius(css)
  const theParams = params(css, 'element', element.id)
  theParams['default-aspect-ratio'] = '1280 / 853'
  theParams['--style-padding-horizontal'] = 0
  theParams['--style-padding-horizontal--unit'] = 'px'
  theParams['--style-padding-vertical'] = 0
  theParams['--style-padding-vertical--unit'] = 'px'

  const output = {
    type: 'Image/V1',
    params: {
      'padding-top--unit': 'px',
      'padding-bottom--unit': 'px',
      'padding-horizontal--unit': 'px',
      'padding-horizontal': parseInt(css['padding-left']) || 0,
    },
    attrs: {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
        cursor: 'pointer',
      },
      'data-skip-background-settings': 'false',
    },
    selectors: {
      '.elImage': {
        attrs: {
          alt: element.content.alt,
          src: [
            {
              type: 'text',
              innerText: element.content.src,
            },
          ],
          'data-blurry-image-enabled': false,
          style: {
            width: parseInt(element.content.width),
            height: parseInt(element.content.height),
            'object-fit': 'fill',
            'object-position': 'center',
            cursor: 'pointer',
          },
          'data-lazy-loading': 'false',
          'data-image-quality': 100,
          'data-skip-corners-settings': 'false',
          'data-skip-shadow-settings': 'false',
        },
        params: theParams,
      },
    },
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
  }
  output.selectors['.elImage'].attrs.style = Object.assign(
    output.selectors['.elImage'].attrs.style,
    borderRadius
  )

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }
  output.attrs = Object.assign(
    output.attrs,
    animations.attrs(pageDocument.querySelector(`[id="${element.id}"]`))
  )
  output.params = Object.assign(
    output.params,
    animations.params(pageDocument.querySelector(`[id="${element.id}"]`))
  )

  const codeId = app.makeId()
  app.copiedJS +=
    /* html */
    `
  <script>
    const image_popup_html = \`<div data-page-element="Modal/V1" class="elModal id-Modal/V1" id="image_popup_${codeId}">
      <div class="elModalInnerContainer" style="background: rgba(0,0,0,0.8)">
        <div class="elModalClose"></div>
        <div class="elModalInner" style="display: flex;justify-content: center;align-items:center;height: 100vh" >
          <div class="elPopupVideoContainer" style="box-shadow:0 0 8px rgb(0 0 0 / 60%);">
            <img alt="${element.content.alt}" src="${element.content.popup_image}" style="max-height: 85vh" />
          </div>
        </div>
      </div>
    </div>\`

    const image_popup = document.createElement('div')
    image_popup.innerHTML = image_popup_html
    document.body.appendChild(image_popup)

    document.querySelector('#image_popup_${codeId} .elModalInnerContainer').addEventListener('click', () => {
      document.querySelector('#image_popup_${codeId}').style.display = 'none'
    })

    document.querySelector('#image_popup_${codeId} .elPopupVideoContainer').addEventListener('click', () => {
      document.querySelector('#image_popup_${codeId}').style.display = 'none'
    })

    const image_popup_image = document.querySelector('.id-${id} .elImage')
    if (image_popup_image) {
      image_popup_image.addEventListener('click', () => {
        document.querySelector('#image_popup_${codeId}').style.display = 'block'
      })
    }
  </script>
  `
  return output
}
