// const shipping_block = data => {
//   const element = data.element
//   const id = data.id
//   const parentId = data.parentId
//   const index = data.index
//   const css_headline = properties.css(element.id, 'shipping_headline')
//   const css_input = properties.css(element.id, 'shipping_input')
//   const children = []

//   for (let i = 0; i < element.content.items.length; i++) {
//     const headlineJSON = headline(
//       {
//         element: {
//           content: {
//             text: data.element.content.items[i].label,
//             html: data.element.content.items[i].label,
//           },
//           id: element.id,
//           css: css_headline,
//         },
//         id: app.makeId(),
//         index: i,
//       },
//       'shipping_headline'
//     )
//     delete headlineJSON.selectors['.elHeadline'].params['--style-background-image-url']
//     headlineJSON.selectors['.elHeadline'].params['--style-padding-horizontal'] = 0
//     headlineJSON.attrs.style['padding-top'] = 0

//     let inputJSON = {}
//     if (data.element.content.items[i].label === 'Country') {
//       const inputBox = document
//         .querySelector(`#${element.id} select[name="shipping_country"]`)
//         .getBoundingClientRect()
//       inputJSON = select({
//         element: {
//           content: {
//             width: inputBox.width,
//             height: inputBox.height,
//             placeholder: 'Select Country',
//             name: document
//               .querySelector(`#${element.id} select[name="shipping_country"]`)
//               .getAttribute('name'),
//             type: document
//               .querySelector(`#${element.id} select[name="shipping_country"]`)
//               .getAttribute('type'),
//             required: document
//               .querySelector(`#${element.id} select[name="shipping_country"]`)
//               .getAttribute('class')
//               .includes('required1')
//               ? 'required1'
//               : 'required0',
//           },
//           id: element.id,
//           css: css_input,
//         },
//         id: app.makeId(),
//         index: i,
//       })
//       inputJSON.selectors['.elSelect'].attrs.style['margin-bottom'] = '0px'
//     } else {
//       const inputBox = document
//         .querySelector(`#${element.id} input[name="shipping_address"]`)
//         .getBoundingClientRect()
//       inputJSON = input({
//         element: {
//           content: {
//             width: inputBox.width,
//             height: inputBox.height,
//             placeholder: data.element.content.items[i].input.getAttribute('placeholder'),
//             name: data.element.content.items[i].input.getAttribute('name'),
//             type: data.element.content.items[i].input.getAttribute('type'),
//             required: data.element.content.items[i].input.getAttribute('class').includes('required1')
//               ? 'required1'
//               : 'required0',
//           },
//           id: element.id,
//           css: css_input,
//         },
//         id: app.makeId(),
//         index: i,
//       })

//       inputJSON.selectors['.elInput'].attrs.style['margin-bottom'] = '0px'
//       inputJSON.selectors['.inputHolder, .borderHolder'].attrs.style['margin-top'] = '0px'
//       inputJSON.selectors['.inputHolder, .borderHolder'].params['--style-padding-horizontal'] = '0px'
//     }

//     const innerFlexContainer = flex_container([headlineJSON, inputJSON], id, i)
//     innerFlexContainer.attrs.style['flex-direction'] = 'column'
//     innerFlexContainer.attrs.style['gap'] = 0

//     if (i !== 0) {
//       innerFlexContainer.attrs.style['margin-top'] = 22
//     }

//     children.push(innerFlexContainer)
//   }

//   const output = flex_container(children, parentId, index)
//   output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
//   output.attrs.style['flex-direction'] = 'column'
//   output.attrs.style['gap'] = 0.5

//   if (element.content.visible) {
//     output.attrs['data-show-only'] = element.content.visible
//     output.attrs = Object.assign(
//       output.attrs,
//       animations.attrs(document.querySelector(`[id="${element.id}"]`))
//     )
//   }

//   return output
// }

const shipping_block = data => {
  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const css_headline = properties.css(element.id, 'shipping_headline')
  const css_input = properties.css(element.id, 'shipping_input')
  const children = []

  for (let i = 0; i < element.content.items.length; i++) {
    const headlineJSON = headline(
      {
        element: {
          content: {
            text: data.element.content.items[i].label,
            html: data.element.content.items[i].label,
          },
          id: element.id,
          css: css_headline,
        },
        id: app.makeId(),
        index: i,
      },
      'shipping_headline'
    )

    let inputJSON = {}

    if (data.element.content.items[i].label === 'Country') {
      const inputDom = document.querySelector(`#${element.id} select[name="shipping_country"]`)

      if (inputDom) {
        const inputBox = inputDom.getBoundingClientRect()
        const items = []
        const options = inputDom.querySelectorAll('option')
        options.forEach(option => {
          items.push({
            value: option.value,
            text: option.textContent,
          })
        })
        inputJSON = select({
          element: {
            content: {
              width: inputBox.width,
              height: inputBox.height,
              placeholder: 'Select Country',
              name: document
                .querySelector(`#${element.id} select[name="shipping_country"]`)
                .getAttribute('name'),
              type: document
                .querySelector(`#${element.id} select[name="shipping_country"]`)
                .getAttribute('type'),
              required: document
                .querySelector(`#${element.id} select[name="shipping_country"]`)
                .getAttribute('class')
                .includes('required1')
                ? 'required1'
                : 'required0',
              items: items,
            },
            id: element.id,
            css: css_input,
          },
          id: app.makeId(),
          index: i,
        })
      }
      inputJSON.attrs.style['margin-top'] = 0
      inputJSON.attrs.style['padding-bottom'] = 0
      inputJSON.attrs.style['padding-top'] = 0
    } else {
      const inputDom = document.querySelector(`#${element.id} input[name="shipping_address"]`)

      if (inputDom) {
        const inputBox = inputDom.getBoundingClientRect()
        inputJSON = input({
          element: {
            content: {
              width: inputBox.width,
              height: inputBox.height,
              placeholder: data.element.content.items[i].input.getAttribute('placeholder'),
              name: data.element.content.items[i].input.getAttribute('name'),
              type: data.element.content.items[i].input.getAttribute('type'),
              required: data.element.content.items[i].input.getAttribute('class').includes('required1')
                ? 'required1'
                : 'required0',
            },
            id: element.id,
            css: css_input,
          },
          id: app.makeId(),
          index: i,
        })
      }
      inputJSON.attrs.style['margin-top'] = 0
    }

    const innerFlexContainer = flex_container([headlineJSON, inputJSON], id, i)
    innerFlexContainer.attrs.style['flex-direction'] = 'column'
    innerFlexContainer.attrs.style['gap'] = 0

    if (i !== 0) {
      innerFlexContainer.attrs.style['margin-top'] = 10
    }

    children.push(innerFlexContainer)
  }

  const output = flex_container(children, parentId, index)
  output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
  output.attrs.style['flex-direction'] = 'column'
  output.attrs.style['gap'] = 0.5

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))

  output.attrs.id = element.id

  return output
}
