const image_popup = data => {
  const element = data.element
  const id = data.id
  const output = image(data)
  const codeId = app.makeId()

  app.generatedJS += `
<!-- Code for Image Popup -->
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

  const image_popup_image = document.querySelector('#${element.id} .elImage')
  if (image_popup_image) {
    image_popup_image.addEventListener('click', () => {
      document.querySelector('#image_popup_${codeId}').style.display = 'block'
    })
  }
</script>
<style>
  #${element.id} .elImage {
    cursor: pointer;
  }
</style>
`

  app.recommendations.push({
    title: 'Image Popup',
    status: 'JavaScript',
    explainer:
      'Added JavaScript to make the image popup when clicked as this element is not supported in CF2 editor.',
  })

  return output
}
