const app = {
  generatedCSS: '',
  generatedJS: '',
  idList: [],
  recommendations: [],
  idLookupTable: [],
  iframeId: '',

  init: () => {
    const clickfunnels_classic = app.clickfunnels_classic.sections(
      document.querySelector('.containerWrapper')
    )

    const clickfunnels_v2 = app.clickfunnels_v2(clickfunnels_classic)
    clickfunnels_v2.version = 93

    const google_font_families = ''

    clickfunnels_v2.popup.children = clickfunnels_v2.popup.children.filter(function (element) {
      return element !== undefined
    })

    clickfunnels_v2.content.children = clickfunnels_v2.content.children.filter(function (element) {
      return element !== undefined
    })

    const response = {
      data: {
        css: app.generatedCSS,
        page_tree: JSON.stringify(clickfunnels_v2),
        google_font_families: google_font_families,
      },
      recommendations: app.recommendations,
      classic_pagetree: clickfunnels_classic,
      v2_pagetree: clickfunnels_v2,
    }

    window.parent.postMessage(JSON.parse(JSON.stringify(response)), '*')
  },

  clickfunnels_classic: {
    sections: dom => {
      const output = []
      const sections = dom.querySelectorAll('.container')

      app.idList = []

      sections.forEach(section => {
        output.push({
          type: 'section',
          title: section.dataset.title,
          id: section.id,
          css: app.properties.css(section.id),
          rows: app.clickfunnels_classic.rows(section),
          content: {
            visible: app.checkVisibility(section),
          },
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
          css: app.properties.css(row.id),
          columns: app.clickfunnels_classic.columns(row),
          content: {
            visible: app.checkVisibility(row),
          },
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
          css: app.properties.css(column.id, 'column'),
          size: app.columnSize(column),
          elements: app.clickfunnels_classic.elements(column),
          content: {
            visible: app.checkVisibility(column),
          },
        })
      })

      return output
    },

    elements: dom => {
      const output = []
      const elements = dom.querySelectorAll('.de')

      elements.forEach(element => {
        output.push(app.clickfunnels_classic.element(element))
      })

      return output
    },

    element: dom => {
      const data = {
        title: dom.dataset.title,
        type: '',
        content: {},
        id: dom.id,
        css: app.properties.css(dom.id),
      }

      if (dom.getAttribute('data-de-type') === 'sms') {
        return null
      }

      if (dom.getAttribute('data-de-type') === 'cb_headline') {
        data.type = 'checkbox_headline'
        const element = dom.querySelector('.elHeadline')
        const checkbox = dom.querySelector('.elInput')
        data.content = {
          visible: app.checkVisibility(dom),
          text: element.textContent,
          html: element.innerHTML,
          json: app.parseHtml(element.innerHTML.replace(/<i class="fa_prepended.*?<\/i>/g, ''), dom.id),
          name: checkbox.getAttribute('data-custom-type'),
          required: checkbox.getAttribute('data-required'),
        }

        return data
      }

      if (dom.querySelector('.elHeadline')) {
        data.type = 'headline'
        const element = dom.querySelector('.elHeadline')
        data.content = {
          visible: app.checkVisibility(dom),
          text: element.textContent,
          html: element.innerHTML,
          json: app.parseHtml(element.innerHTML.replace(/<i class="fa_prepended.*?<\/i>/g, ''), dom.id),
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
            json: app.parseHtml(item.innerHTML, dom.id, null, 'pricely-item'),
          })
        })

        data.content = {
          visible: app.checkVisibility(dom),
          items: items,
          header: {
            label: {
              text: dom.querySelector('.pricely-label').textContent,
              html: dom.querySelector('.pricely-label').innerHTML,
              json: app.parseHtml(
                dom.querySelector('.pricely-label').innerHTML,
                dom.id,
                null,
                'pricely-label'
              ),
            },
            figure: {
              text: dom.querySelector('.pricely-amount').textContent,
              html: dom.querySelector('.pricely-amount').innerHTML,
              json: app.parseHtml(
                dom.querySelector('.pricely-amount').innerHTML,
                dom.id,
                null,
                'pricely-amount'
              ),
            },
            foreword: {
              text: dom.querySelector('.pricely-foreword').textContent,
              html: dom.querySelector('.pricely-foreword').innerHTML,
              json: app.parseHtml(
                dom.querySelector('.pricely-foreword').innerHTML,
                dom.id,
                null,
                'pricely-foreword'
              ),
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
        let width
        if (element.classList.contains('elButtonFull')) {
          width = 100
        } else {
          width = 'auto'
        }
        let href = element.getAttribute('href')
        if (href === '#' && element.getAttribute('data-show-button-ids')) {
          href = '#show-hide'
        }
        data.content = {
          visible: app.checkVisibility(dom),
          main: elementMain.textContent,
          sub: elementSub.textContent,
          href: href,
          target: element.target,
          width: width,
          height: button.height,
          font: elementMain.style.fontFamily,
          showIds: element.getAttribute('data-show-button-ids'),
          hideIds: element.getAttribute('data-hide-button-ids'),
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

      if (dom.getAttribute('data-de-type') === 'textarea') {
        data.type = 'textarea'
        const element = dom.querySelector('.elInput')
        const input = element.getBoundingClientRect()
        data.content = {
          visible: app.checkVisibility(dom),
          width: input.width,
          height: input.height,
          placeholder: element.getAttribute('placeholder'),
          name: element.getAttribute('name'),
          type: element.getAttribute('type'),
          custom_type: element.getAttribute('data-custom-type'),
          required: element.getAttribute('class').includes('required1') ? 'required1' : 'required0',
        }
        return data
      }

      if (dom.getAttribute('data-de-type') === 'select-input') {
        data.type = 'select'
        const element = dom.querySelector('.elInput')
        const input = element.getBoundingClientRect()
        const items = []
        const options = element.querySelectorAll('option')
        options.forEach(option => {
          items.push({
            value: option.value,
            text: option.textContent,
          })
        })
        data.content = {
          visible: app.checkVisibility(dom),
          width: input.width,
          height: input.height,
          placeholder: element.getAttribute('placeholder'),
          name: element.getAttribute('name'),
          type: element.getAttribute('type'),
          custom_type: element.getAttribute('data-custom-type'),
          required: element.getAttribute('class').includes('required1') ? 'required1' : 'required0',
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
          custom_type: element.getAttribute('data-custom-type'),
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
        const videoType = dom.getAttribute('data-video-type')

        let blockPause = false
        let stickyEnabled = false
        let stickyCloseable = false
        let stickySize = 'medium'
        let stickyPosition = 'top-left'
        let stickyStyle = ''

        if (videoType === 'youtube') {
          blockPause = dom.getAttribute('data-youtube-block-pause')
        } else if (videoType === 'vimeo') {
          blockPause = dom.getAttribute('data-vimeo-block-pause')
        } else if (videoType === 'wistia') {
          blockPause = dom.getAttribute('data-wistia-block-pause')
        }

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
          blockPause: blockPause,
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

        data.content.videoType = videoType || 'youtube'
        if (videoType === 'youtube') {
          data.content.url = dom.getAttribute('data-youtube-url')
        } else if (videoType === 'vimeo') {
          data.content.url = dom.getAttribute('data-cfvimeo-url')
          data.content.autoplay = dom.getAttribute('data-vimeo-autoplay')
        } else if (videoType === 'wistia') {
          data.content.url = dom.getAttribute('data-wistia-url')
          data.content.autoplay = dom.getAttribute('data-wistia-autoplay')
        } else if (videoType === 'custom') {
          data.content.url = dom.querySelector('.fluid-width-video-wrapper').innerHTML
        } else if (videoType === 'evp') {
          data.content.url = ''

          app.recommendations.push({
            type: 'Video',
            status: 'Not Supported',
            id: element.id,
            explainer:
              'The EasyVideoSuite is not supported. Please use a different video player or add video manually.',
          })
        } else if (videoType === 'html5') {
          data.content.webm_url = dom.getAttribute('data-webm-url')
          data.content.url = dom.getAttribute('data-mp4-url')
        }

        return data
      }

      if (dom.getAttribute('data-de-type') === 'featureimage') {
        data.type = 'featured_image'
        let element = dom
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
          headline_json: app.parseHtml(
            element.querySelector('.elScreenshot_text_headline').innerHTML,
            dom.id
          ),
          paragraph: paragraphHTML,
          paragraph_text: element.querySelector('.elScreenshot_text_body').textContent,
          paragraph_json: app.parseHtml(element.querySelector('.elScreenshot_text_body').innerHTML, dom.id),
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
          html: dom.outerHTML,
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
          headline_json: app.parseHtml(
            dom.querySelector('.faqTitleText').innerHTML.replace(/<i class="i.*?<\/i>/g, ''),
            dom.id,
            null,
            'faq_headline'
          ),
          paragraph: dom.querySelector('.faqAnswer').innerHTML,
          paragraph_text: dom.querySelector('.faqAnswer').textContent,
          paragraph_json: app.parseHtml(
            dom.querySelector('.faqAnswer').innerHTML.replace(/<i class="i.*?<\/i>/g, ''),
            dom.id,
            null,
            'faq_paragraph'
          ),
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
              json: app.parseHtml(item.innerHTML.replace(/<i class="i.*?<\/i>/g, ''), dom.id),
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
        let fontWeight = 'normal'
        if (dom.querySelector('.nodoNav').classList.contains('elLinkBold')) {
          fontWeight = 'bold'
        }

        dom.querySelectorAll('.nodoNav .nodoNavItem').forEach(item => {
          const styles = getComputedStyle(item)
          const display = styles.getPropertyValue('display')
          if (display !== 'none') {
            items.push({
              content_html: item.innerHTML,
              content_text: item.textContent,
              font_weight: fontWeight,
              json: app.parseHtml(item.innerHTML.replace(/<i class="fa_prepended.*?<\/i>/g, ''), dom.id),
            })
          }
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
          listItems.push({
            html: item.innerHTML,
            text: item.textContent,
            json: app.parseHtml(item.innerHTML.replace(/<i class="fa.*?<\/i>/g, ''), dom.id),
          })
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
        list.forEach((item, index) => {
          let content = item.innerText
          content = content.replace('\n', '').trim()
          items.push({
            html: item.innerHTML,
            text: content,
            icon: item.querySelector('i').getAttribute('class'),
            json: app.parseHtml(item.innerHTML.replace(/<i class="fa.*?<\/i>/g, ''), dom.id, index),
            id: dom.id,
          })
        })
        data.content = {
          visible: app.checkVisibility(dom),
          items: items,
          html: dom.innerHTML,
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
          html: dom.innerHTML,
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
        const computedWraperStyles = getComputedStyle(element)
        const width = computedWraperStyles.getPropertyValue('width')
        const height = computedWraperStyles.getPropertyValue('height')
        let percent = 0
        const widthClasses = [
          'progressbar_w_0',
          'progressbar_w_33',
          'progressbar_w_50',
          'progressbar_w_66',
          'progressbar_w_75',
          'progressbar_w_85',
          'progressbar_w_90',
          'progressbar_w_100',
        ]
        widthClasses.forEach(item => {
          if (element.querySelector('.progress-bar').classList.contains(item)) {
            percent = item.replace('progressbar_w_', '')
          }
        })

        data.content = {
          visible: app.checkVisibility(dom),
          background_color: element.getAttribute('data-color'),
          percentage: percent,
          width: parseInt(width.replace('%', '')),
          height: height,
          label: element.querySelector('.progress-bar').textContent,
          html: dom.innerHTML,
        }
        return data
      }

      if (dom.getAttribute('data-de-type') === 'imagegallery2') {
        data.type = 'image_popup'
        const element = dom.querySelector('.elIMG1')
        const image = element.getBoundingClientRect()
        let src = element.getAttribute('src')

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

      if (dom.getAttribute('data-de-type') === 'fbcomments') {
        data.type = 'fb_comments'
        const element = dom.querySelector('.fb-comments')
        const url = element.getAttribute('data-href')
        let numposts = element.getAttribute('data-numposts') || 5
        let colorscheme = element.getAttribute('data-colorscheme') || 'light'

        data.content = {
          visible: app.checkVisibility(dom),
          code: `<div id="fb-root"></div>
          <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0" nonce="PvSz5qfY"></script><div class="fb-comments" data-href="${url}" data-width="100%" data-numposts="${numposts}" data-colorscheme="${colorscheme}"></div>`,
        }
        return data
      }

      if (dom.querySelector('.social-likes')) {
        data.type = 'social_share'
        const element = dom.querySelector('.social-likes')
        const twitter = element.querySelector('[data-via]')
        let via = ''
        if (twitter) {
          via = twitter.getAttribute('data-via')
        }
        let theme = 'default'
        if (element.classList.contains('social-classic')) {
          theme = 'classic'
        }
        data.content = {
          visible: app.checkVisibility(dom),
          url: element.getAttribute('data-url'),
          title: element.getAttribute('data-title'),
          via: via,
          code: element.innerHTML,
          theme: theme,
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
  },

  clickfunnels_v2: classic_page_tree => {
    const contentId = app.makeId()
    const popupId = app.makeId()
    const htmlComputedStyles = getComputedStyle(document.querySelector('html'))
    const videoBg = document.querySelector('.modalBackdropWrapper')
    const backgroundParams = {}
    const backgroundColor = htmlComputedStyles.getPropertyValue('background-color')
    const backgroundImage = htmlComputedStyles.getPropertyValue('background-image')

    if (backgroundColor) backgroundParams['--style-background-color'] = backgroundColor
    if (backgroundImage) {
      backgroundParams['--style-background-image-url'] = backgroundImage
        .replace('url(', '')
        .replace(')', '')
        .replace(/"/g, '')
    }

    if (
      videoBg &&
      videoBg.getAttribute('data-youtube-selectbox') &&
      videoBg.getAttribute('data-youtube-selectbox') === 'youtube'
    ) {
      backgroundParams['video-bg-style-type'] = 'fill'
      backgroundParams['video-bg-url'] = videoBg.getAttribute('data-youtube-background')
      backgroundParams['video-bg-thumbnail-background'] = true
      backgroundParams['video-bg-use-background-as-overlay'] = false
      backgroundParams['video-bg-type'] = 'youtube'

      const endaction = videoBg.getAttribute('data-youtube-endaction')
      switch (endaction) {
        case 'popup':
          backgroundParams['video-bg-endaction'] = 'open-popup'
          break
        case 'redirect':
          backgroundParams['video-bg-endaction'] = 'redirect'
          backgroundParams['video-bg-redirect-url'] = videoBg.getAttribute('data-youtube-redirecturl')
          break
      }
    }

    const backgroundAttrs = {
      'data-skip-background-settings': 'false',
      'data-skip-background-video-settings': videoBg.getAttribute('data-youtube-selectbox')
        ? 'false'
        : 'true',
      className: '',
      style: {},
    }
    const backgroundClasses = document.querySelector('html').classList
    const backgroundPosition = htmlComputedStyles.getPropertyValue('background-position')

    if (backgroundPosition) {
      const checkCSS = backgroundPosition.split(' ')
      const data = {
        vertical: 0,
        horizontal: 0,
      }

      if (checkCSS[0].includes('%')) {
        if (parseInt(checkCSS[0]) === 50) {
          data.vertical = 'center'
        }

        if (parseInt(checkCSS[0]) === 100) {
          data.vertical = 'top'
        }

        if (parseInt(checkCSS[0]) === 0) {
          data.vertical = ''
        }
      }

      if (checkCSS[1].includes('%')) {
        if (parseInt(checkCSS[1]) === 50) {
          data.horizontal = 'center'
        }

        if (parseInt(checkCSS[1]) === 100) {
          data.horizontal = 'left'
        }

        if (parseInt(checkCSS[1]) === 0) {
          data.horizontal = ''
        }
      }

      backgroundAttrs['style']['background-position'] = `${data.horizontal} ${data.vertical} !important`

      if (backgroundClasses.contains('bgRepeatXBottom')) {
        backgroundAttrs['style']['background-position'] = `bottom !important`
      } else if (backgroundClasses.contains('bgRepeatXTop')) {
        backgroundAttrs['style']['background-position'] = `top !important`
      }
    }

    app.convertBackgroundPositionClassName(backgroundClasses, className => {
      backgroundAttrs.className = 'bgCoverV2Center ' + className
    })

    const convertedJSON = {
      version: null,
      content: {
        type: 'ContentNode',
        id: contentId,
        params: backgroundParams,
        attrs: backgroundAttrs,
        children: [],
      },
      settings: null,
      popup: { ...popup(classic_page_tree, popupId) },
    }

    convertedJSON.content.children = app.sections(classic_page_tree, contentId)
    convertedJSON.settings = app.settings()

    app.buildRecommendations()

    return convertedJSON
  },

  blueprint: (type, id, parentId, index, element) => {
    const output = {
      type: type,
      id: id,
      version: 0,
      parentId: parentId,
      fractionalIndex: 'a' + index,
      attrs: {},
      params: {},
    }

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs = Object.assign(
      output.attrs,
      app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )
    output.params = Object.assign(
      output.params,
      app.animations.params(document.querySelector(`[id="${element.id}"]`))
    )

    return output
  },

  animations: {
    attrs: dom => {
      if (dom.getAttribute('data-trigger') !== 'none') {
        return {
          'data-skip-animation-settings': 'false',
          'data-animation-delay': dom.getAttribute('data-delay') || 0,
          'data-animation-trigger': dom.getAttribute('data-trigger') || 'none',
          'data-animation-type': 'fade-in', // dom.getAttribute('data-animate'),
          'data-animation-timing-function': 'linear',
          'data-animation-direction': 'reverse',
          'data-animation-once': true,
          'data-animation-loop': false,
        }
      }
      return {}
    },
    params: () => {
      return {
        '--data-animation-time': 1000,
        '--data-animation-direction': 'right',
      }
    },
  },

  properties: {
    css: (elementId, type = null, isParams = false) => {
      let dom

      if (type === 'column') {
        dom = document.querySelector(`.containerWrapper #${elementId} .col-inner`)
      } else if (type === 'columnContainer') {
        dom = document.querySelector(`.containerWrapper #${elementId}`)
      } else if (type === 'image') {
        dom = document.querySelector(`#${elementId} img`)
      } else if (type === 'video_popup') {
        dom = document.querySelector(`#${elementId} img`)
      } else if (type === 'icon') {
        dom = document.querySelector(`#${elementId} .eliconelement`)
      } else if (type === 'progress') {
        dom = document.querySelector(`#${elementId} .progress`)
      } else if (type === 'progress-bar') {
        dom = document.querySelector(`#${elementId} .progress-bar`)
      } else if (type === 'headline') {
        dom = document.querySelector(`#${elementId} .elHeadline`)
      } else if (type === 'headlinePrepend') {
        dom = document.querySelector(`#${elementId} .fa_prepended`)
      } else if (type === 'faqPrepend') {
        dom = document.querySelector(`#${elementId} .faqIcon`)
      } else if (type === 'divider') {
        dom = document.querySelector(`#${elementId} .elDividerInner`)
      } else if (type === 'dividerContainer') {
        dom = document.querySelector(`#${elementId} .elDivider`)
      } else if (type === 'input') {
        dom = document.querySelector(`#${elementId} .elInput`)
      } else if (type === 'button') {
        dom = document.querySelector(`#${elementId} .elButton`)
      } else if (type === 'buttonMain') {
        dom = document.querySelector(`#${elementId} .elButtonMain`)
      } else if (type === 'buttonSub') {
        dom = document.querySelector(`#${elementId} .elButtonSub`)
      } else if (type === 'buttonPrepend') {
        dom = document.querySelector(`#${elementId} .fa_prepended`)
      } else if (type === 'buttonAppend') {
        dom = document.querySelector(`#${elementId} .fa_appended`)
      } else if (type === 'popup') {
        dom = document.querySelector(`.containerModal`)
      } else if (type === 'popup-backdrop') {
        dom = document.querySelector(`.modalBackdropWrapper`)
      } else if (type === 'featured_image_image') {
        dom = document.querySelector(`#${elementId} .elScreenshot_image img`)
      } else if (type === 'featured_image_headline') {
        dom = document.querySelector(`#${elementId} .elScreenshot_text_headline`)
      } else if (type === 'featured_image_paragraph') {
        dom = document.querySelector(`#${elementId} .elScreenshot_text_body`)
      } else if (type === 'faq_block_headline') {
        dom = document.querySelector(`#${elementId} .faqTitle`)
      } else if (type === 'faq_block_paragraph') {
        dom = document.querySelector(`#${elementId} .faqAnswer`)
      } else if (type === 'image_list_headline') {
        dom = document.querySelector(`#${elementId} li`)
      } else if (type && type.includes('text_block_headline_')) {
        const eqIndex = type.split('_')[3]
        const eqType = type.split('_')[4]
        dom = document.querySelector(`#${elementId} .elTextblock ${eqType}:nth-child(${eqIndex})`)
        if (dom.querySelector('span')) {
          dom = dom.querySelector('span')
          dom.style.paddingBottom = '10px'
        }
      } else if (type === 'pricing') {
        dom = document.querySelector(`#${elementId} .panel`)
      } else if (type === 'pricing_label_headline') {
        dom = document.querySelector(`#${elementId} .pricely-label`)
      } else if (type === 'pricing_figure_headline') {
        dom = document.querySelector(`#${elementId} .pricely-amount`)
        dom.style.padding = '20px 0'
      } else if (type === 'pricing_foreword_headline') {
        dom = document.querySelector(`#${elementId} .pricely-foreword`)
      } else if (type && type.includes('pricing_headline_')) {
        const eqIndex = type.split('_')[2]
        dom = document.querySelector(`#${elementId} .list-group .list-group-item:nth-child(${eqIndex})`)
      } else if (type === 'shipping_headline') {
        dom = document.querySelector(`#${elementId} .labelUnderInput`)
      } else if (type === 'shipping_input') {
        dom = document.querySelector(`#${elementId} .elInput`)
      } else if (type === 'billing_headline') {
        dom = document.querySelector(`#${elementId} .labelUnderInput`)
      } else if (type === 'billing_input') {
        dom = document.querySelector(`#${elementId} .elInput`)
      } else if (type === 'list') {
        dom = document.querySelector(`#${elementId} .elBulletList li`)
      } else {
        dom = document.querySelector(`#${elementId}`)
      }

      if (dom) {
        const data = {
          'margin-top--unit': 'px',
        }
        const computed = getComputedStyle(dom)

        const used_styles = [
          'background-color',
          'background-image',
          'background-position',
          'background-repeat',
          'background-size',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'font-family',
          'font-size',
          'font-weight',
          'text-transform',
          'letter-spacing',
          'line-height',
          'text-align',
          'border-bottom-width',
          'border-top-width',
          'border-left-width',
          'border-right-width',
          'border-bottom-color',
          'border-top-color',
          'border-left-color',
          'border-right-color',
          'border-bottom-style',
          'border-top-style',
          'border-left-style',
          'border-right-style',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-left-radius',
          'border-bottom-right-radius',
          'outline',
          'cursor',
          'width',
          'color',
          'position',
          'box-shadow',
          'text-shadow',
          'z-index',
          'display',
          'opacity',
          'filter',
        ]

        for (let index = 0; index < computed.length; index++) {
          if (used_styles.includes(computed[index])) {
            if (computed[index] === 'position' && computed.getPropertyValue(computed[index]) === 'static') {
              data[computed[index]] = 'relative'
            } else {
              data[computed[index]] = computed.getPropertyValue(computed[index])
            }
          }
        }

        if (parseInt(data['padding-bottom']) === 0 && parseInt(data['margin-bottom']) !== 0) {
          data['padding-bottom'] = data['margin-bottom']
        } else if (parseInt(data['padding-bottom']) !== 0 && parseInt(data['margin-bottom']) !== 0) {
          data['padding-bottom'] = parseInt(data['padding-bottom']) + parseInt(data['margin-bottom']) + 'px'
        }

        return data
      } else {
        return {}
      }
    },

    borderWidth: css => {
      const top = parseInt(css['border-top-width']) || 0
      const bottom = parseInt(css['border-bottom-width']) || 0
      const left = parseInt(css['border-left-width']) || 0
      const right = parseInt(css['border-right-width']) || 0
      const borderWidth = [top, bottom, left, right]

      return {
        'border-width': borderWidth[0] || borderWidth[1] || borderWidth[2] || borderWidth[3],
        'border-top-width': top,
        'border-bottom-width': bottom,
        'border-left-width': left,
        'border-right-width': right,
      }
    },

    borderStyle: css => {
      const top = css['border-top-style']
      const bottom = css['border-bottom-style']
      const left = css['border-left-style']
      const right = css['border-right-style']
      const borderStyle = [top, bottom, left, right]

      return {
        'border-style': borderStyle[0] || borderStyle[1] || borderStyle[2] || borderStyle[3],
      }
    },

    borderColor: css => {
      const top = css['border-top-color']
      const bottom = css['border-bottom-color']
      const left = css['border-left-color']
      const right = css['border-right-color']
      const borderColor = [top, bottom, left, right]

      let color = top

      borderColor.forEach(item => {
        // default border color in classic, check for any other color, otherwise default to top.
        if (item !== 'rgb(47, 47, 47)') {
          color = item
        }
      })

      return {
        'border-color': color,
      }
    },

    borderRadius: (css, equalCheck) => {
      if (css === undefined || css === null) return false

      const allEqual = arr => arr.every(val => val === arr[0])
      const topLeft = parseInt(css['border-top-left-radius']) || 0
      const topRight = parseInt(css['border-top-right-radius']) || 0
      const bottomLeft = parseInt(css['border-bottom-left-radius']) || 0
      const bottomRight = parseInt(css['border-bottom-right-radius']) || 0
      const borderRadius = [topLeft, topRight, bottomRight, bottomLeft]
      const allCorners = allEqual(borderRadius)

      if (equalCheck) {
        if (allCorners) {
          return true
        } else {
          return false
        }
      } else {
        if (allCorners) {
          return {
            'border-radius': borderRadius[0],
          }
        } else {
          return {
            'border-top-left-radius': borderRadius[0],
            'border-top-right-radius': borderRadius[1],
            'border-bottom-left-radius': borderRadius[2],
            'border-bottom-right-radius': borderRadius[3],
          }
        }
      }
    },
  },

  params: (css, type = null, id = null, params = {}) => {
    if (css === undefined || css === null) return false

    const borderRadiusCorner = app.properties.borderRadius(css, 'check')
    const data = {
      'margin-top--unit': app.checkParamType(css['margin-top']),
      'padding-top--unit': app.checkParamType(css['padding-top']),
      'padding-bottom--unit': app.checkParamType(css['padding-bottom']),
      'border-radius--unit': app.checkParamType(
        css['border-top-left-radius'] ||
          css['border-top-right-radius'] ||
          css['border-bottom-left-radius'] ||
          css['border-bottom-right-radius']
      ),
      'border-top-right-radius--unit': app.checkParamType(css['border-top-right-radius']),
      'border-top-left-radius--unit': app.checkParamType(css['border-top-left-radius']),
      'border-bottom-right-radius--unit': app.checkParamType(css['border-bottom-right-radius']),
      'border-bottom-left-radius--unit': app.checkParamType(css['border-bottom-left-radius']),
      'border-top-width--unit': app.checkParamType(css['border-top-width']),
      'border-bottom-width--unit': app.checkParamType(css['border-bottom-width']),
      'border-left-width--unit': app.checkParamType(css['border-left-width']),
      'border-right-width--unit': app.checkParamType(css['border-right-width']),
      'border-width--unit': app.checkParamType(css['border-width']),
      'width--unit': app.checkParamType(css['width']),
      'letter-spacing--unit': app.checkParamType(css['letter-spacing']),
      'line-height--unit': app.checkParamType(css['line-height']),
      'font-size--unit': app.checkParamType(css['font-size']),
      'separate-corners': !borderRadiusCorner,
    }

    if (css['background-color'] !== undefined) {
      data['--style-background-color'] = css['background-color']
    }

    if (css['background-image'] !== undefined && type !== 'input') {
      data['--style-background-image-url'] = css['background-image']
        .replace('url(', '')
        .replace(')', '')
        .replace(/"/g, '')
    }

    const backgroundPosition = css['background-position']

    if (backgroundPosition) {
      const checkCSS = backgroundPosition.split(' ')
      const position = {
        vertical: 0,
        horizontal: 0,
      }

      if (checkCSS[0].includes('%')) {
        if (parseInt(checkCSS[0]) === 50) {
          position.vertical = 'center'
        }

        if (parseInt(checkCSS[0]) === 100) {
          position.vertical = 'top'
        }

        if (parseInt(checkCSS[0]) === 0) {
          position.vertical = 'bottom'
        }
      }

      if (checkCSS[1].includes('%')) {
        if (parseInt(checkCSS[1]) === 50) {
          position.horizontal = 'center'
        }

        if (parseInt(checkCSS[1]) === 100) {
          position.horizontal = 'left'
        }

        if (parseInt(checkCSS[1]) === 0) {
          position.horizontal = 'right'
        }
      }

      data['--style-background-position'] = `${position.horizontal} ${position.vertical} !important`
    }

    if (css['box-shadow']) {
      const boxShadow = css['box-shadow']
      const shadowArray = boxShadow.match(/(?:[^\s\(\)]+|\([^\(\)]*\))+/g)

      if (shadowArray[0] !== 'none') {
        if (shadowArray.includes('inset')) {
          data['--style-box-shadow-style-type'] = 'inset'
        }
        data['--style-box-shadow-color'] = shadowArray[0]
        data['--style-box-shadow-distance-x'] = parseInt(shadowArray[1])
        data['--style-box-shadow-distance-y'] = parseInt(shadowArray[2])
        data['--style-box-shadow-blur'] = parseInt(shadowArray[3])
        data['--style-box-shadow-spread'] = parseInt(shadowArray[4])

        data['--style-box-shadow-spread--unit'] = app.checkParamType(shadowArray[4])
        data['--style-box-shadow-blur--unit'] = app.checkParamType(shadowArray[3])
        data['--style-box-shadow-distance-y--unit'] = app.checkParamType(shadowArray[2])
        data['--style-box-shadow-distance-x--unit'] = app.checkParamType(shadowArray[1])
      }
    }

    if (css['text-shadow']) {
      const textShadow = css['text-shadow']
      const shadowArray = textShadow.match(/(?:[^\s\(\)]+|\([^\(\)]*\))+/g)
      if (shadowArray[0] !== 'none') {
        data['--style-text-shadow-x'] = parseInt(shadowArray[1])
        data['--style-text-shadow-y'] = parseInt(shadowArray[2])
        data['--style-text-shadow-blur'] = parseInt(shadowArray[3])
        data['--style-text-shadow-color'] = shadowArray[0]
      }
    }

    const borderColor = app.properties.borderColor(css)
    if (borderColor['border-color']) {
      data['--style-border-color'] = borderColor['border-color']
    } else {
      data['--style-border-color'] = 'transparent'
    }

    const borderStyle = app.properties.borderStyle(css)
    if (borderStyle['border-style']) {
      data['--style-border-style'] =
        borderStyle['border-style'] === 'none' ? 'solid' : borderStyle['border-style']
    } else {
      data['--style-border-style'] = 'solid'
    }

    const borderWidth = app.properties.borderWidth(css)

    if (borderWidth['border-bottom-width']) {
      data['--style-border-bottom-width'] = `${parseInt(borderWidth['border-bottom-width'])}px`
    } else {
      data['--style-border-bottom-width'] = '0px'
    }

    if (borderWidth['border-top-width']) {
      data['--style-border-top-width'] = `${parseInt(borderWidth['border-top-width'])}px`
    } else {
      data['--style-border-top-width'] = '0px'
    }

    if (borderWidth['border-left-width']) {
      data['--style-border-left-width'] = `${parseInt(borderWidth['border-left-width'])}px`
    } else {
      data['--style-border-left-width'] = '0px'
    }

    if (borderWidth['border-right-width']) {
      data['--style-border-right-width'] = `${parseInt(borderWidth['border-right-width'])}px`
    } else {
      data['--style-border-right-width'] = '0px'
    }

    return { ...data, ...params }
  },

  checkParamType: type => {
    if (type === undefined) return 'px'

    const check = type.match(/px|%/)
    if (check) {
      return check[0]
    }
    return 'px'
  },

  settings: () => {
    const settingsId = app.makeId()
    const headerCodeId = app.makeId()
    const footerCodeId = app.makeId()
    const cssCodeId = app.makeId()
    const linkColorDom = document.querySelector('#link_color_style')
    let linkColor = '#000'
    if (linkColorDom) {
      linkColor = linkColorDom.innerText.replace('a { color: ', '').replace(';}', '').trim()
    }
    const textColor = document.querySelector('html').style.color
    const fontFamily = document.querySelector('html').style.fontFamily

    app.generatedCSS = app.generatedCSS + document.querySelector('#custom-css').innerText
    app.generatedCSS = app.generatedCSS.replace(/;!important|!important!important/g, ' !important')

    return {
      id: settingsId,
      type: 'settings',
      version: 0,
      children: [
        {
          id: 'page_style',
          type: 'css',
          parentId: app.makeId(),
          fractionalIndex: 'a0',
          attrs: {
            style: { color: textColor, 'font-family': fontFamily, 'font-weight': 500 },
          },
          selectors: { '.elTypographyLink': { attrs: { style: { color: linkColor } }, params: {} } },
          params: {},
        },
        {
          id: 'header-code',
          type: 'raw',
          parentId: headerCodeId,
          fractionalIndex: 'a0',
          innerText: '', // blank
        },
        {
          id: 'footer-code',
          type: 'raw',
          parentId: footerCodeId,
          fractionalIndex: 'a1',
          innerText: app.generatedJS,
        },
        {
          id: 'css',
          type: 'raw',
          parentId: cssCodeId,
          fractionalIndex: 'a2',
          innerText: cssbeautify(app.generatedCSS, {
            indent: '  ',
            openbrace: 'end-of-line',
            autosemicolon: true,
          }),
        },
      ],
    }
  },

  elements: (elements, parentId) => {
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
          case 'textarea':
            return textarea(data)
          case 'select':
            return select(data)
          case 'divider':
            return divider(data)
          case 'embed':
            return embed(data)
          case 'fb_comments':
            return fb_comments(data)
          case 'social_share':
            return social_share(data)
          case 'countdown':
            return countdown(data)
          case 'headline':
            return headline(data)
          case 'checkbox_headline':
            return checkbox(data)
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
  },

  sections: (sections, parentId) => {
    return sections.map((section, index) => {
      if (section && section.id !== 'modalPopup') {
        const id = app.makeId()
        const output = app.blueprint('SectionContainer/V1', id, parentId, index, section)
        const borderRadius = app.properties.borderRadius(section.css)
        const containerClasses = [
          'smallContainer',
          'midContainer',
          'midWideContainer',
          'wideContainer',
          'fullContainer',
        ]
        const stickyClasses = ['stickyTop', 'stickyBottom']
        const currentClasses = document.querySelector(`[id="${section.id}"]`).getAttribute('class')
        const containerClass = containerClasses.find(item => currentClasses.includes(item))
        const stickyClass = stickyClasses.find(item => currentClasses.includes(item))
        const backgroundClasses = document.querySelector(`[id="${section.id}"]`).classList
        let backgroundPosition = ''

        app.convertBackgroundPositionClassName(backgroundClasses, className => {
          backgroundPosition = className
        })

        output.attrs = {
          className: `${containerClass} ${stickyClass} ${backgroundPosition}`,
          style: {
            'margin-top': parseInt(section.css['margin-top']) || 0,
            'padding-top': parseInt(section.css['padding-top']) || 0,
            'padding-bottom': parseInt(section.css['padding-bottom']) || 0,
            'padding-left': parseInt(section.css['padding-left']) || 0,
            'padding-right': parseInt(section.css['padding-right']) || 0,
            position: section.css['position'] || 'relative',
            'z-index': parseInt(section.css['z-index']) || 0,
          },
          'data-section-colors': 'lightest',
          'data-skip-background-settings': 'false',
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          'data-skip-borders-settings': 'false',
        }

        output.children = rows(section.rows, id)
        output.params = app.params(section.css, 'section', section.id)
        output.attrs.style = Object.assign(output.attrs.style, borderRadius)

        app.idList.push({
          type: 'section',
          title: section.title,
          cf1_id: section.id,
          cf2_id: id,
        })

        return output
      }
    })
  },

  htmlToDom: html => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    return wrapper
  },

  makeId: () => {
    let id = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    const finalId = `6Z-${id}-0`
    if (!app.idLookupTable.includes(finalId)) {
      return finalId
    } else {
      app.makeId()
    }
  },

  checkVisibility: element => {
    const hideOn = element.getAttribute('data-hide-on')
    if (hideOn === 'desktop') {
      return 'desktop'
    } else if (hideOn === 'mobile') {
      return 'mobile'
    } else if (!hideOn && element.style.display === 'none') {
      return 'none'
    } else {
      return null
    }
  },

  columnSize: dom => {
    let output = ''

    dom.classList.forEach(className => {
      if (className.includes('col-md-')) {
        output = className.replace('col-md-', '')
      }
    })

    return output
  },

  convertBackgroundPositionClassName: (backgroundClasses, callback) => {
    const classesMap = {
      bgCover: 'bgCoverV2',
      bgCover100: 'bgW100',
      bgNoRepeat: 'bgNoRepeat',
      bgRepeat: 'bgRepeat',
      bgRepeatX: 'bgRepeatX',
      bgRepeatXTop: 'bgRepeatX',
      bgRepeatXBottom: 'bgRepeatX',
      bgRepeatY: 'bgRepeatY',
    }

    const bgClassesArray = Array.from(backgroundClasses)

    for (let classic in classesMap) {
      if (bgClassesArray.includes(classic)) {
        callback(classesMap[classic])
        return
      }
    }
  },

  checkImagesLoaded: (parentSelector, callback) => {
    const parent = document.querySelector(parentSelector)
    const images = parent.getElementsByTagName('img')
    let imagesToLoad = images.length

    for (let i = 0; i < images.length; i++) {
      if (images[i].complete) {
        imagesToLoad--
      } else {
        images[i].addEventListener('load', function () {
          imagesToLoad--
          if (imagesToLoad === 0) {
            callback()
          }
        })
      }
    }

    if (imagesToLoad === 0) {
      callback()
    }
  },

  headlinePageTree: (classicHeadlineArray, mainParentId) => {
    let outputArray = []

    if (!classicHeadlineArray) {
      return outputArray
    }

    classicHeadlineArray.forEach((headline, index) => {
      const id = app.makeId()
      const fractionalIndex = 'a' + (index + 1).toString(36)

      let output = {
        ...headline,
        id: id,
        version: 0,
        parentId: mainParentId,
        fractionalIndex: fractionalIndex,
      }

      if (headline.type === 'a') {
        if (!output.attrs) {
          output.attrs = {}
        }
        output.attrs['className'] = 'elTypographyLink'

        if (output.attrs.class) {
          delete output.attrs.class
        }
      }

      if (headline.type === 'span' && headline.attrs.style) {
        headline.attrs.style = {
          color: 'inherit',
        }
      }

      if (headline.children) {
        output.children = app.headlinePageTree(headline.children, id)
      }

      outputArray.push(output)
    })

    return outputArray
  },

  parseHtml: (htmlString, domId, listIndex = null, type = null) => {
    const parser = new DOMParser()
    const html = parser.parseFromString(htmlString, 'text/html')

    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue)) {
        return null
      }

      let objs = []

      switch (node.nodeType) {
        case Node.TEXT_NODE:
          let parts = node.nodeValue.split('\n')
          parts.forEach((part, index) => {
            if (part !== '') {
              objs.push({
                type: 'text',
                innerText: part,
              })
              objs.push({
                type: 'text',
                innerText: ' ',
              })
            }

            if (index < parts.length - 1) {
              objs.push({
                type: 'div',
                innerText: ' ',
              })
            }
          })
          break

        case Node.ELEMENT_NODE:
          let obj = {
            type: node.tagName.toLowerCase(),
          }

          if (node.hasAttributes()) {
            obj.attrs = Array.from(node.attributes).reduce((attrs, attr) => {
              attrs[attr.name] = attr.value
              return attrs
            }, {})
          }

          if (obj.type === 'a') {
            const nodeIndex = Array.from(node.parentNode.childNodes).indexOf(node)
            let el = document.querySelector(`#${domId} a:nth-child(${nodeIndex + 1})`)
            const linkColorDom = document.querySelector('#link_color_style')
            let color = '#000'

            if (linkColorDom) {
              color = linkColorDom.innerText.replace('a { color: ', '').replace(';}', '').trim()
            }

            if (
              type === 'pricely-label' ||
              type === 'pricely-amount' ||
              type === 'pricely-foreword' ||
              type === 'pricely-item'
            ) {
              el = document.querySelector(`#${node.id}`)
              if (el) {
                color = el.style.color
              }
            } else if (el) {
              color = el.style.color
            } else if (listIndex !== null) {
              el = document.querySelector(`#${node.id}`)
              if (el) {
                color = el.style.color
              }
            } else if (type === 'faq_paragraph' || type === 'faq_headline') {
              el = document.querySelector(`#${node.id}`)
              if (el) {
                color = el.style.color
              }
            }

            if (app.isColor(color)) {
              obj.attrs.style = {
                color: color,
              }
            }
          }

          if (node.hasChildNodes()) {
            obj.children = Array.from(node.childNodes)
              .flatMap(traverse)
              .filter(child => child !== null)
          }

          if (
            obj.type === 'div' &&
            obj.children &&
            obj.children.length === 1 &&
            obj.children[0].type === 'br'
          ) {
            objs.push({ type: 'div', children: [{ type: 'br' }] })
          } else if (obj.type === 'div' && obj.children && obj.children.length > 0) {
            objs = objs.concat(obj.children)
          } else {
            objs.push(obj)
          }

          break
      }

      return objs
    }

    return Array.from(html.body.childNodes)
      .flatMap(traverse)
      .filter(child => child !== null)
  },

  isColor: color => {
    var s = new Option().style
    s.color = color
    return s.color == color
  },

  buildRecommendations: () => {
    document.querySelectorAll('.de').forEach(dom => {
      if (dom.getAttribute('data-de-type') === 'privacy_notice') {
        app.recommendations.push({
          type: 'Privacy Notice',
          status: 'Not Supported',
          explainer: 'The Privacy Notice element is not supported.',
        })
      }

      if (dom.getAttribute('data-de-type') === 'videogallery1') {
        app.recommendations.push({
          type: 'Video Popup',
          status: 'Custom Code',
          explainer:
            'The video popup element is not supported inside of ClickFunnels 2.0 yet. This element will be converted to a custom code element.',
        })
      }

      if (dom.getAttribute('data-de-type') === 'button') {
        if (
          dom.querySelector('a').href.includes('#') &&
          dom.querySelector('a').href.split('#')[1] === 'fb-optin-url'
        ) {
          app.recommendations.push({
            type: 'FB Optin Button',
            status: 'Not Supported',
            explainer:
              'The Facebook optin button is not supported inside of ClickFunnels 2.0. This element will be converted to a normal button.',
          })
        }
      }

      if (dom.getAttribute('data-de-type') === 'sms') {
        app.recommendations.push({
          type: 'SMS',
          status: 'Not Supported',
          explainer: 'The SMS element is not supported inside of ClickFunnels 2.0 and has not been copied.',
        })
      }

      if (dom.getAttribute('data-de-type') === 'survey') {
        app.recommendations.push({
          type: 'Survey',
          status: 'Coming Soon',
          explainer: 'The survey element is work-in-progress and should be available soon.',
        })
      }
    })
  },

  cssForInput: (id, type) => {
    const input = document.querySelector(`#${id} .elInput`)
    const boxShadow = ['es-gradient', 'es-lightgreyInput', 'elInputStyle1', 'ceoinput']

    let boxShadowCSS = ''

    boxShadow.map(box => {
      if (input.classList.contains(box)) {
        switch (box) {
          case 'es-gradient':
            boxShadowCSS = 'box-shadow: inset 0px 0px 2px 2px rgba(0,0,0,0.055) !important;'
            break
          case 'es-lightgreyInput':
            boxShadowCSS =
              'box-shadow: inset 0px 2px 4px rgba(128,128,128,0.15), 0px 3px 2px rgba(140,157,169,0.14) !important;'
            break
          case 'elInputStyle1':
            boxShadowCSS = 'box-shadow: 0 0 0 3px rgb(4 3 3 / 5%) !important;'
            break
          case 'ceoinput':
            boxShadowCSS =
              'box-shadow: inset 0 1px 2px rgba(130,137,150,0.23), 0 1px 0 rgba(255,255,255,0.95) !important;'
            break
        }
      }
    })

    let className = '.elInput'
    if (type === 'TextArea') className = '.elTextarea'
    if (type === 'Select') className = '.elSelect'

    if (boxShadowCSS !== '') {
      app.generatedCSS += `\n\n/* CSS for ${type} */\n`
      app.generatedCSS += `
#${id} ${className} {
  ${boxShadowCSS}
}`

      app.recommendations.push({
        title: 'Input Box Shadow',
        status: 'CSS',
        explainer: 'Custom CSS has been added to the input box to match the original box shadow.',
      })
    }
  },
}
