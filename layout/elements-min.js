const elements = (elements, parentId) => {
  return elements.map((element, index) => {
    const id = app.makeId()
    if (element) {
      app.idList.push({
        type: 'element',
        title: element.title,
        cf1_id: element.id,
        cf2_id: id,
      })

      const data = {
        element,
        id,
        parentId,
        index,
      }

      switch (element?.type) {
        case 'image':
          return image(data)
        case 'video':
          return video(data)
        case 'button':
          return button(data)
        case 'icon':
          return icon(data)
        case 'list':
          return list(data)
        case 'input':
          return input(data)
        case 'select':
          return select(data)
        case 'divider':
          return divider(data)
        case 'embed':
          return embed(data)
        case 'fb_comments':
          return fb_comments(data)
        case 'countdown':
          return countdown(data)
        case 'headline':
          return headline(data)
        case 'progress':
          return progress(data)
        case 'featured_image':
          return featured_image(data)
        case 'faq_block':
          return faq_block(data)
        case 'image_list':
          return image_list(data)
        case 'text_block':
          return text_block(data)
        case 'navigation':
          return navigation(data)
        case 'pricing':
          return pricing(data)
        case 'shipping_block':
          return shipping_block(data)
        case 'billing_block':
          return billing_block(data)
        case 'video_popup':
          return video_popup(data)
        case 'audio_player':
          return audio_player(data)
        case 'image_popup':
          return image_popup(data)
      }
    }
  })
}
