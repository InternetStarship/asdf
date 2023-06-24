const clickfunnels_classic_page_tree = {
  sections: dom => {
    const output = []
    const sections = dom.querySelectorAll('.container')

    sections.forEach(section => {
      output.push({
        type: 'section',
        title: section.dataset.title,
        id: section.id,
        css: properties.css(section.id),
        rows: clickfunnels_classic_page_tree.rows(section),
      })
    })

    return output
  },

  rows: dom => {
    const output = []
    const rows = dom.querySelectorAll('.row')

    rows.forEach(row => {
      output.push({
        type: 'row',
        title: row.dataset.title,
        id: row.id,
        css: properties.css(row.id),
        columns: clickfunnels_classic_page_tree.columns(row),
      })
    })

    return output
  },

  columns: dom => {
    const output = []
    const columns = dom.querySelectorAll('.innerContent')

    columns.forEach(column => {
      output.push({
        type: 'column',
        title: column.dataset.title,
        id: column.id,
        css: properties.css(column.id),
        size: app.columnSize(column),
        elements: clickfunnels_classic_page_tree.elements(column),
      })
    })

    return output
  },

  elements: dom => {
    const output = []
    const elements = dom.querySelectorAll('.de')

    elements.forEach(element => {
      output.push(clickfunnels_classic_page_tree.element(element))
    })

    return output
  },

  element: dom => {
    const data = {
      title: dom.dataset.title,
      type: '',
      content: {},
      id: dom.id,
      css: properties.css(dom.id),
    }

    if (dom.getAttribute('data-de-type') === 'sms') {
      return null
    }

    if (dom.querySelector('.elHeadline')) {
      data.type = 'headline'
      const element = dom.querySelector('.elHeadline')
      data.content = {
        visible: app.checkVisibility(dom),
        text: element.textContent,
        html: element.innerHTML,
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'quote') {
      data.type = 'headline'
      const element = dom.querySelector('.elHeadline')
      data.content = {
        visible: app.checkVisibility(dom),
        text: element.textContent,
        html: element.innerHTML,
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'pricing') {
      data.type = 'pricing'
      const items = []

      dom.querySelectorAll('.list-group-item').forEach(item => {
        items.push({
          text: item.textContent,
          html: item.innerHTML,
        })
      })

      data.content = {
        visible: app.checkVisibility(dom),
        items: items,
        header: {
          label: {
            text: dom.querySelector('.pricely-label').textContent,
            html: dom.querySelector('.pricely-label').innerHTML,
          },
          figure: {
            text: dom.querySelector('.pricely-amount').textContent,
            html: dom.querySelector('.pricely-amount').innerHTML,
          },
          foreword: {
            text: dom.querySelector('.pricely-foreword').textContent,
            html: dom.querySelector('.pricely-foreword').innerHTML,
          },
        },
      }
      return data
    }

    if (dom.querySelector('.elButton')) {
      data.type = 'button'
      const element = dom.querySelector('.elButton')
      const elementSub = dom.querySelector('.elButton .elButtonSub')
      const elementMain = dom.querySelector('.elButton .elButtonMain')
      const button = element.getBoundingClientRect()
      const domRect = dom.getBoundingClientRect()
      const child = parseInt(button.width)
      const parent = parseInt(domRect.width)
      let width
      if (child === parent) {
        width = 100
      } else {
        width = 'auto'
      }
      data.content = {
        visible: app.checkVisibility(dom),
        main: elementMain.textContent,
        sub: elementSub.textContent,
        href: element.getAttribute('href'),
        target: element.target,
        width: width,
        height: button.height,
        font: elementMain.style.fontFamily,
      }
      return data
    }

    if (dom.querySelector('.elIMG')) {
      data.type = 'image'
      const element = dom.querySelector('.elIMG')
      const image = element.getBoundingClientRect()
      data.content = {
        visible: app.checkVisibility(dom),
        src: element.src,
        alt: element.alt,
        link: element.getAttribute('data-imagelink'),
        target: element.target,
        width: image.width,
        height: image.height,
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'address') {
      data.type = 'shipping_block'
      const items = [
        {
          label: 'Full Address*',
          input: dom.querySelector('input[name="shipping_address"]'),
        },
        {
          label: 'City Name*',
          input: dom.querySelector('input[name="shipping_city"]'),
        },
        {
          label: 'State / Province*',
          input: dom.querySelector('input[name="shipping_state"]'),
        },
        {
          label: 'Zip Code*',
          input: dom.querySelector('input[name="shipping_zip"]'),
        },
        {
          label: 'Country',
          input: dom.querySelector('input[name="shipping_country"]'),
        },
      ]

      data.content = {
        visible: app.checkVisibility(dom),
        items: items,
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'billing-address') {
      data.type = 'billing_block'
      const items = [
        {
          label: 'Full Address*',
          input: dom.querySelector('input[name="address"]'),
        },
        {
          label: 'City Name*',
          input: dom.querySelector('input[name="city"]'),
        },
        {
          label: 'State / Province*',
          input: dom.querySelector('input[name="state"]'),
        },
        {
          label: 'Zip Code*',
          input: dom.querySelector('input[name="zip"]'),
        },
        {
          label: 'Country',
          input: dom.querySelector('input[name="country"]'),
        },
      ]

      data.content = {
        visible: app.checkVisibility(dom),
        items: items,
      }
      return data
    }

    if (dom.querySelector('.elInput')) {
      data.type = 'input'
      const element = dom.querySelector('.elInput')
      const input = element.getBoundingClientRect()
      data.content = {
        visible: app.checkVisibility(dom),
        width: input.width,
        height: input.height,
        placeholder: element.getAttribute('placeholder'),
        name: element.getAttribute('name'),
        type: element.getAttribute('type'),
        required: element.getAttribute('class').includes('required1') ? 'required1' : 'required0',
      }
      return data
    }

    if (dom.querySelector('.elVideo')) {
      data.type = 'video'
      const element = dom.querySelector('.elVideo')
      let bgImage
      if (dom.getAttribute('data-video-type') === 'youtube') {
        const url = dom.getAttribute('data-youtube-url')
        const id = url.split('v=')[1]
        const ampersandPosition = id.indexOf('&')
        if (ampersandPosition !== -1) {
          bgImage = `https://img.youtube.com/vi/${id.substring(0, ampersandPosition)}/maxresdefault.jpg`
        } else {
          bgImage = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        }
      }
      const video = element.getBoundingClientRect()
      const classes = dom.getAttribute('class')
      let stickyEnabled = false
      let stickyCloseable = false
      let stickySize = 'medium'
      let stickyPosition = 'top-left'
      let stickyStyle = ''

      if (classes.includes('clickfunnels-sticky-video')) {
        stickyEnabled = true
      }

      if (classes.includes('cf-sticky-video-closeYes')) {
        stickyCloseable = true
      }

      if (classes.includes('cf-sticky-video200')) {
        stickySize = 'small'
      } else if (classes.includes('cf-sticky-video300')) {
        stickySize = 'medium'
      } else if (classes.includes('cf-sticky-video400')) {
        stickySize = 'large'
      } else if (classes.includes('cf-sticky-video500')) {
        stickySize = 'xLarge'
      }

      if (classes.includes('cf-sticky-videoTopLeft')) {
        stickyPosition = 'top-left'
      } else if (classes.includes('cf-sticky-videoTopRight')) {
        stickyPosition = 'top-right'
      } else if (classes.includes('cf-sticky-videoBottomLeft')) {
        stickyPosition = 'bottom-left'
      } else if (classes.includes('cf-sticky-videoBottomRight')) {
        stickyPosition = 'bottom-right'
      }

      if (classes.includes('cf-sticky-video-theme1')) {
        stickyStyle = 'black-with-shadow'
      } else if (classes.includes('cf-sticky-video-theme2')) {
        stickyStyle = 'white-with-shadow'
      } else if (classes.includes('cf-sticky-video-theme3')) {
        stickyStyle = 'light-transparent-border'
      } else if (classes.includes('cf-sticky-video-theme4')) {
        stickyStyle = 'dark-transparent-border'
      }

      data.content = {
        visible: app.checkVisibility(dom),
        starterText: dom.getAttribute('data-session-starter-text'),
        title: dom.getAttribute('data-video-title'),
        autoplay: dom.getAttribute('data-youtube-autoplay'),
        controls: dom.getAttribute('data-youtube-controls'),
        unmuteLabel: dom.getAttribute('data-youtube-unmute-label'),
        bgImage: bgImage,
        width: video.width,
        height: video.height,
        sticky: {
          enabled: stickyEnabled,
          closeable: stickyCloseable,
          size: stickySize,
          position: stickyPosition,
          style: stickyStyle,
        },
      }

      const videoType = dom.getAttribute('data-video-type')
      data.content.videoType = videoType || 'youtube'
      if (videoType === 'youtube') {
        data.content.url = dom.getAttribute('data-youtube-url')
      } else if (videoType === 'vimeo') {
        data.content.url = dom.getAttribute('data-vimeo-url')
      } else if (videoType === 'wistia') {
        data.content.url = dom.getAttribute('data-wistia-url')
      }

      return data
    }

    if (dom.getAttribute('data-de-type') === 'featureimage') {
      data.type = 'featured_image'
      let element = dom
      // if (!element) {
      //   element = dom
      // }

      const image = element.querySelector('.elScreenshot_image img').getBoundingClientRect()

      let headlineHTML = element.querySelector('.elScreenshot_text_headline').innerHTML
      if (element.querySelector('.elScreenshot_text_headline div')) {
        headlineHTML = element.querySelector('.elScreenshot_text_headline').innerHTML
      }

      let paragraphHTML = element.querySelector('.elScreenshot_text_body').innerHTML
      if (element.querySelector('.elScreenshot_text_body div')) {
        paragraphHTML = element.querySelector('.elScreenshot_text_body').innerHTML
      }
      data.content = {
        visible: app.checkVisibility(dom),
        image: element.querySelector('.elScreenshot_image img').src,
        image_alt: element.querySelector('.elScreenshot_image img').alt,
        image_width: image.width,
        image_height: image.height,
        headline: headlineHTML,
        headline_text: element.querySelector('.elScreenshot_text_headline').textContent,
        paragraph: paragraphHTML,
        paragraph_text: element.querySelector('.elScreenshot_text_body').textContent,
      }
      return data
    }

    if (dom.querySelector('.elDivider')) {
      data.type = 'divider'
      data.content = {
        visible: app.checkVisibility(dom),
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'audio') {
      data.type = 'audio_player'
      data.content = {
        visible: app.checkVisibility(dom),
        url: dom.getAttribute('data-audio-url'),
        loop: dom.getAttribute('data-audio-loop'),
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'videogallery1') {
      data.type = 'video_popup'
      const element = dom.querySelector('.elIMG1')
      const image = element.getBoundingClientRect()
      data.content = {
        visible: app.checkVisibility(dom),
        video_url: dom.querySelector('.swipebox').getAttribute('href'),
        src: element.getAttribute('src'),
        alt: element.getAttribute('alt') || '',
        width: image.width,
        height: image.height,
      }
      return data
    }

    if (dom.querySelector('.faqBlock')) {
      data.type = 'faq_block'
      data.content = {
        visible: app.checkVisibility(dom),
        headline: dom.querySelector('.faqTitleText').innerHTML,
        headline_text: dom.querySelector('.faqTitleText').textContent,
        paragraph: dom.querySelector('.faqAnswer').innerHTML,
        paragraph_text: dom.querySelector('.faqAnswer').textContent,
      }
      return data
    }

    if (dom.querySelector('.elTextblock')) {
      data.type = 'text_block'
      const items = []

      dom.querySelectorAll('.elTextblock *').forEach(item => {
        let type = 'p'

        if (item.tagName === 'P') {
          type = 'p'
        } else if (item.tagName === 'H1') {
          type = 'h1'
        } else if (item.tagName === 'H2') {
          type = 'h2'
        } else if (item.tagName === 'H3') {
          type = 'h3'
        } else if (item.tagName === 'H4') {
          type = 'h4'
        } else if (item.tagName === 'H5') {
          type = 'h5'
        } else if (item.tagName === 'H6') {
          type = 'h6'
        }

        if (
          item.tagName === 'P' ||
          item.tagName === 'H1' ||
          item.tagName === 'H2' ||
          item.tagName === 'H3' ||
          item.tagName === 'H4' ||
          item.tagName === 'H5' ||
          item.tagName === 'H6'
        ) {
          items.push({
            type: type,
            content_html: item.innerHTML,
            content_text: item.textContent,
          })
        }
      })

      data.content = {
        visible: app.checkVisibility(dom),
        items: items,
      }
      return data
    }

    if (dom.querySelector('.nodoNav')) {
      data.type = 'navigation'
      const items = []

      dom.querySelectorAll('.nodoNav .nodoNavItem').forEach(item => {
        items.push({
          content_html: item.innerHTML,
          content_text: item.textContent,
        })
      })

      data.content = {
        visible: app.checkVisibility(dom),
        items: items,
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'listimg') {
      data.type = 'image_list'

      const listItems = []
      dom.querySelectorAll('.elBulletList li').forEach(item => {
        listItems.push(item.innerHTML)
      })
      const image = document.querySelectorAll(`#${dom.id} .elBulletList li`)[0]
      const imageComputedStyles = getComputedStyle(image)
      const imageBG = imageComputedStyles.getPropertyValue('background-image')

      data.content = {
        visible: app.checkVisibility(dom),
        list: listItems,
        image: imageBG.replace('url("', '').replace('")', ''),
      }
      return data
    }

    if (dom.querySelector('.elBulletList')) {
      data.type = 'list'
      const list = dom.querySelectorAll('ul.elBulletList li')
      const items = []
      list.forEach(item => {
        const content = item.innerText
        items.push(content.replace('\n', '').trim())
      })
      data.content = {
        visible: app.checkVisibility(dom),
        items: items,
        icon: icon,
      }
      return data
    }

    if (dom.querySelector('.eliconelement')) {
      data.type = 'icon'
      const element = dom.querySelector('.eliconelement')
      data.content = {
        visible: app.checkVisibility(dom),
        fontAwesome: dom.querySelector('.eliconelement i').getAttribute('class').trim(),
        href: element.getAttribute('href'),
        target: element.target,
      }
      return data
    }

    if (dom.querySelector('.elCustomJS_code')) {
      data.type = 'embed'
      const element = dom.querySelector('.elCustomJS_code')
      data.content = {
        visible: app.checkVisibility(dom),
        code: element.getAttribute('data-custom-js'),
      }
      return data
    }

    if (dom.querySelector('.progress')) {
      data.type = 'progress'
      const element = dom.querySelector('.progress')
      data.content = {
        visible: app.checkVisibility(dom),
      }
      return data
    }

    if (dom.getAttribute('data-de-type') === 'imagegallery2') {
      data.type = 'image_popup'
      const element = dom.querySelector('.elIMG1')
      const image = element.getBoundingClientRect()
      let src = element.getAttribute('src')

      if (src === 'https://via.placeholder.com/350x150/e1e5e6/6d7b8b?text=Thumbnail') {
        src = '/editor/editor-demo-image-placeholder.svg'
      }

      data.content = {
        visible: app.checkVisibility(dom),
        src: src || '',
        alt: element.getAttribute('alt') || '',
        width: image.width,
        height: image.height,
        popup_image: dom.querySelector('.swipebox').getAttribute('href') || '',
      }
      return data
    }

    if (dom.querySelector('.social-likes')) {
      data.type = 'social_share'
      const element = dom.querySelector('.social-likes')
      data.content = {
        visible: app.checkVisibility(dom),
      }
      return data
    }

    if (dom.querySelector('.wideCountdown')) {
      data.type = 'countdown'
      const element = dom.querySelector('.wideCountdown')
      data.content = {
        visible: app.checkVisibility(dom),
        showWeeks: dom.getAttribute('data-show-weeks'),
        showMonths: dom.getAttribute('data-show-months'),
        showYears: dom.getAttribute('data-show-years'),
        showDays: dom.getAttribute('data-show-days'),
        showSeconds: dom.getAttribute('data-show-seconds'),
        date: element.getAttribute('data-date'),
        time: element.getAttribute('data-time'),
        timezone: element.getAttribute('data-tz'),
        lang: element.getAttribute('data-lang'),
        url: element.getAttribute('data-url'),
      }
      return data
    }
  },
}
