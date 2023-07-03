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
          css: app.properties.css(section.id, 'section'),
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
          css: app.properties.css(row.id, 'row'),
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
        let stickyPosition = 'top-right'
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
          stickyStyle = 'black-with-dropshadow'
        } else if (classes.includes('cf-sticky-video-theme2')) {
          stickyStyle = 'white-with-dropshadow'
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

        console.log(data.content)

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

      if (
        dom.getAttribute('data-de-type') === 'countdown' ||
        dom.getAttribute('data-de-type') === 'countdown-evergreen' ||
        dom.getAttribute('data-de-type') === 'countdown-daily'
      ) {
        data.type = 'countdown'
        const element = dom.querySelector('.is-countdown')
        data.content = {
          visible: app.checkVisibility(dom),
          showWeeks: dom.getAttribute('data-show-weeks') || false,
          showMonths: dom.getAttribute('data-show-months') || false,
          showYears: dom.getAttribute('data-show-years') || false,
          showDays: dom.getAttribute('data-show-days') || false,
          showHours: dom.getAttribute('data-show-hours') || true,
          showMinutes: dom.getAttribute('data-show-minutes') || true,
          showSeconds: dom.getAttribute('data-show-seconds') || true,
          date: element.getAttribute('data-date'),
          time: element.getAttribute('data-time'),
          timezone: element.getAttribute('data-tz'),
          action: dom.getAttribute('data-expire-type'),
          lang: element.getAttribute('data-lang'),
          url: element.getAttribute('data-url'),
          hours: element.getAttribute('data-hours'),
          minutes: element.getAttribute('data-minutes'),
          seconds: element.getAttribute('data-seconds'),
          type: dom.getAttribute('data-de-type'),
          hideIds: element.getAttribute('data-hide-ids'),
          showIds: element.getAttribute('data-show-ids'),
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
      popup: { ...app.popup(classic_page_tree, popupId) },
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
      fractionalIndex: 'a0',
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
          'border-color',
          'border-style',
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

        if (dom.style.borderColor) {
          data['border-color'] = dom.style.borderColor
        }

        if (dom.style.borderStyle) {
          data['border-style'] = dom.style.borderStyle
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

      let style = css['border-style']

      function findDifferent(arr) {
        const counts = {}
        for (let i = 0; i < arr.length; i++) {
          if (counts[arr[i]] === undefined) {
            counts[arr[i]] = 1
          } else {
            counts[arr[i]]++
          }
        }
        for (const prop in counts) {
          if (counts[prop] === 1) {
            return prop
          }
        }
        return arr[0]
      }

      if (!style) {
        style = findDifferent(borderStyle)
      }

      return {
        'border-style': style,
      }
    },

    borderColor: css => {
      const top = css['border-top-color']
      const bottom = css['border-bottom-color']
      const left = css['border-left-color']
      const right = css['border-right-color']
      const borderColor = [top, bottom, left, right]

      let color = css['border-color']

      borderColor.forEach(item => {
        // default border color in classic, check for any other color, otherwise default to top.
        if (item !== 'rgb(47, 47, 47)' && item !== 'rgb(68, 82, 97)') {
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

    if (css['border-color']) {
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
            return app.image(data)
          case 'video':
            return app.video(data)
          case 'button':
            return app.button(data)
          case 'icon':
            return app.icon(data)
          case 'list':
            return app.list(data)
          case 'input':
            return app.input(data)
          case 'textarea':
            return app.textarea(data)
          case 'select':
            return app.select(data)
          case 'divider':
            return app.divider(data)
          case 'embed':
            return app.embed(data)
          case 'fb_comments':
            return app.fb_comments(data)
          case 'social_share':
            return app.social_share(data)
          case 'countdown':
            return app.countdown(data)
          case 'headline':
            return app.headline(data)
          case 'checkbox_headline':
            return app.checkbox(data)
          case 'progress':
            return app.progress(data)
          case 'featured_image':
            return app.featured_image(data)
          case 'faq_block':
            return app.faq_block(data)
          case 'image_list':
            return app.image_list(data)
          case 'text_block':
            return app.text_block(data)
          case 'navigation':
            return app.navigation(data)
          case 'pricing':
            return app.pricing(data)
          case 'shipping_block':
            return app.shipping_block(data)
          case 'billing_block':
            return app.billing_block(data)
          case 'video_popup':
            return app.video_popup(data)
          case 'audio_player':
            return app.audio_player(data)
          case 'image_popup':
            return app.image_popup(data)
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

        output.children = app.rows(section.rows, id)
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

  rows: (rows, parentId) => {
    return rows.map((row, index) => {
      if (row) {
        const id = app.makeId()
        const output = app.blueprint('RowContainer/V1', id, parentId, index, row)
        const borderRadius = app.properties.borderRadius(row.css)
        const backgroundClasses = document.querySelector(`[id="${row.id}"]`).classList
        let backgroundPosition = ''

        app.convertBackgroundPositionClassName(backgroundClasses, className => {
          backgroundPosition = className
        })

        output.attrs = {
          className: `${backgroundPosition}`,
          style: {
            width: row.css['width'],
            'margin-left': 'auto',
            'margin-right': 'auto',
            'margin-top': parseInt(row.css['margin-top']) || 0,
            'padding-top': parseInt(row.css['padding-top']) || 0,
            'padding-bottom': parseInt(row.css['padding-bottom']) || 0,
            'padding-left': parseInt(row.css['padding-left']) || 0,
            'padding-right': parseInt(row.css['padding-right']) || 0,
            position: row.css['position'] || 'relative',
            'z-index': parseInt(row.css['z-index']) || 0,
          },
          'data-skip-background-settings': 'false',
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          'data-skip-borders-settings': 'false',
        }

        output.params = app.params(row.css, 'row', row.id)
        output.children = app.columns(row.columns, id)
        output.attrs.style = Object.assign(output.attrs.style, borderRadius)

        app.idList.push({
          type: 'row',
          title: row.title,
          cf1_id: row.id,
          cf2_id: id,
        })

        return output
      }
    })
  },

  columns: (columns, parentId) => {
    return columns.map((column, index) => {
      if (column) {
        const columnCSS = app.properties.css(column.id, 'column')
        const columnContainerCSS = app.properties.css(column.id, 'columnContainer')
        const id = app.makeId()
        const output = app.blueprint('ColContainer/V1', id, parentId, index, column)
        const borderRadius = app.properties.borderRadius(columnCSS)
        const backgroundClasses = document.querySelector(`[id="${column.id}"] .col-inner`).classList
        let backgroundPosition = ''

        app.convertBackgroundPositionClassName(backgroundClasses, className => {
          backgroundPosition = className
        })

        output.attrs = {
          style: {
            'margin-top': parseInt(columnContainerCSS['margin-top']) || 0,
            'margin-left': parseInt(columnContainerCSS['margin-left']) || 0,
            'margin-right': parseInt(columnContainerCSS['margin-right']) || 0,
            'padding-left': parseInt(columnContainerCSS['padding-left']) || 0,
            'padding-right': parseInt(columnContainerCSS['padding-right']) || 0,
          },
        }

        output.params = {
          mdNum: parseInt(column.size),
          colDirection: 'left',
          'margin-top--unit': 'px',
          'margin-bottom--unit': 'px',
          'margin-left--unit': 'px',
          'margin-right--unit': 'px',
        }

        output.selectors = {
          '& > .col-inner': {
            params: app.params(columnCSS, 'column', column.id),
            attrs: {
              style: {
                'padding-top': parseInt(columnCSS['padding-top']) || 0,
                'padding-bottom': parseInt(columnCSS['padding-bottom']) || 0,
                position: columnCSS['position'] || 'relative',
                'z-index': parseInt(columnCSS['z-index']) || 0,
                'margin-left': parseInt(columnCSS['margin-left']) || 0,
                'margin-right': parseInt(columnCSS['margin-right']) || 0,
                'padding-left': parseInt(columnCSS['padding-left']) || 0,
                'padding-right': parseInt(columnCSS['padding-right']) || 0,
              },
              'data-skip-background-settings': 'false',
              'data-skip-shadow-settings': 'false',
              'data-skip-corners-settings': 'false',
            },
          },
          '.col-inner': {
            attrs: {
              className: `${backgroundPosition}`,
            },
          },
        }

        output.children = app.elements(column.elements, id)

        output.selectors['& > .col-inner'].attrs.style = Object.assign(
          output.selectors['& > .col-inner'].attrs.style,
          borderRadius
        )

        app.idList.push({
          type: 'column',
          title: column.title,
          cf1_id: column.id,
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

  popup: (sections, parentId) => {
    const borderRadius = app.properties.borderRadius(sections[0].css)
    const containerClasses = [
      'smallContainer',
      'midContainer',
      'midWideContainer',
      'wideContainer',
      'fullContainer',
    ]
    const currentClasses = document.querySelector(`[id="${sections[0].id}"]`).getAttribute('class')
    const containerClass = containerClasses.find(item => currentClasses.includes(item))
    const backgroundClasses = document.querySelector(`[id="${sections[0].id}"]`).classList
    let backgroundPosition = ''

    app.convertBackgroundPositionClassName(backgroundClasses, className => {
      backgroundPosition = className
    })

    const popupModal = document.querySelector('.containerModal')
    if (popupModal) {
      popupModal.style.display = 'block'
    }
    const css = app.properties.css(null, 'popup')
    const cssBackdrop = app.properties.css(null, 'popup-backdrop')
    const popupWidth = document.querySelector('.containerModal').getBoundingClientRect()

    const output = {
      type: 'ModalContainer/V1',
      id: parentId,
      version: 0,
      selectors: {
        '.containerModal': {
          attrs: {
            className: `${containerClass} ${backgroundPosition}`,
            style: {
              'margin-top': parseInt(css['margin-top']) || 0,
              'margin-bottom': parseInt(css['margin-bottom']) || 0,
              'padding-top': parseInt(css['padding-top']) || 0,
              'padding-bottom': parseInt(css['padding-bottom']) || 0,
              position: css['position'] || 'relative',
              'z-index': parseInt(css['z-index']) || 0,
              width: parseInt(css['width']),
            },
            'data-section-colors': 'lightest',
            'data-show-popup-on-page-load': 'false',
            'data-skip-background-settings': 'false',
            'data-skip-corners-settings': 'false',
            'data-skip-shadow-settings': 'false',
          },
          params: app.params(css, 'section', sections[0].id),
        },
        '.modal-wrapper': {
          params: {
            '--style-background-color': cssBackdrop['background-color'],
            '--style-padding-horizontal': parseInt(cssBackdrop['padding-left']),
            '--style-padding-horizontal--unit': 'px',
          },
        },
        '.elModalInnerContainer': {
          params: {
            'width--unit': 'px',
          },
          attrs: {
            style: {
              width: popupWidth.width,
            },
          },
        },
      },
      attrs: {
        'data-selected-element': 'not-set',
      },
      children: [],
    }

    output.selectors['.containerModal'].attrs.style = Object.assign(
      output.selectors['.containerModal'].attrs.style,
      borderRadius
    )

    const classes = document.querySelector(`.containerModal`).getAttribute('class')

    if (classes.includes('bounce')) {
      output.selectors['.containerModal'].attrs['data-show-popup-on-exit'] = 'true'
    } else {
      output.selectors['.containerModal'].attrs['data-show-popup-on-exit'] = 'false'
    }

    output.children = sections.map(section => {
      if (section.id === 'modalPopup') {
        const id = app.makeId()
        const data = {
          type: 'SectionContainer/V1',
          id: id,
          version: 0,
          parentId: parentId,
          fractionalIndex: 'a0',
          children: app.rows(section.rows, id),
        }

        return data
      }
    })

    return output
  },

  audio_player: (data, type = 'audio_player') => {
    const element = data.element
    const output = app.blueprint('Audio/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, type) || element.css
    const borderRadius = app.properties.borderRadius(css)

    const alignments = {
      'margin-right': 0,
      'margin-left': 0,
    }

    const cf_classic_themes = [
      `
    .elAudioSkin1 {
        background-color: #111111;
        background-image: -webkit-gradient(linear, center top, center bottom, from(#1f1f1f), to(#111));
        background-image: -webkit-linear-gradient(top, #1f1f1f, #111);
        background-image: -moz-linear-gradient(top, #1f1f1f, #111);
        background-image: -o-linear-gradient(top, #1f1f1f, #111);
        background-image: -ms-linear-gradient(top, #1f1f1f, #111);
        background-image: linear-gradient(to bottom, #1f1f1f, #111);
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.3);
        border-bottom: 3px solid rgba(0,0,0,0.3);
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
        box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1)
    }
    
    .elAudioSkin1 .elAudio {
        -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        -moz-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        border-radius: 5px
    }`,
      `
    .elAudioSkin2 {
        background-color: #FFF;
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.1);
        border-bottom: 3px solid rgba(0,0,0,0.2);
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
        box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1)
    }
    
    .elAudioSkin2 .elAudio {
        -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        -moz-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        border-radius: 5px
    }`,
      `
    .elAudioSkin3 {
        background-color: #175c8d;
        background-image: -webkit-gradient(linear, center top, center bottom, from(#1c72b0), to(#175c8d));
        background-image: -webkit-linear-gradient(top, #1c72b0, #175c8d);
        background-image: -moz-linear-gradient(top, #1c72b0, #175c8d);
        background-image: -o-linear-gradient(top, #1c72b0, #175c8d);
        background-image: -ms-linear-gradient(top, #1c72b0, #175c8d);
        background-image: linear-gradient(to bottom, #1c72b0, #175c8d);
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.1);
        border-bottom: 3px solid rgba(0,0,0,0.2);
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
        box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1)
    }
    
    .elAudioSkin3 .elAudio {
        -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        -moz-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        border-radius: 5px
    }`,
      `
    .elAudioSkin4 {
        background-color: #F73936;
        background-image: -webkit-gradient(linear, center top, center bottom, from(#f73936), to(#cc302d));
        background-image: -webkit-linear-gradient(top, #f73936, #cc302d);
        background-image: -moz-linear-gradient(top, #f73936, #cc302d);
        background-image: -o-linear-gradient(top, #f73936, #cc302d);
        background-image: -ms-linear-gradient(top, #f73936, #cc302d);
        background-image: linear-gradient(to bottom, #f73936, #cc302d);
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.1);
        border-bottom: 3px solid rgba(0,0,0,0.2);
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
        box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1)
    }
    
    .elAudioSkin4 .elAudio {
        -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        -moz-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        border-radius: 5px
    }`,
      `
  .elAudioSkin5 {
      background-color: #F73936;
      background-image: -webkit-gradient(linear, center top, center bottom, from(#f73936), to(#cc302d));
      background-image: -webkit-linear-gradient(top, #f73936, #cc302d);
      background-image: -moz-linear-gradient(top, #f73936, #cc302d);
      background-image: -o-linear-gradient(top, #f73936, #cc302d);
      background-image: -ms-linear-gradient(top, #f73936, #cc302d);
      background-image: linear-gradient(to bottom, #f73936, #cc302d);
      border-radius: 5px;
      border: 1px solid rgba(0,0,0,0.1);
      border-bottom: 3px solid rgba(0,0,0,0.2);
      -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);
      -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
      box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1)
  }
  
  .elAudioSkin5 .elAudio {
      -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
      -moz-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
      box-shadow: 0 1px 10px rgba(0,0,0,0.3);
      border-radius: 5px
  }`,
      `
    .elAudioSkin6 {
        background-color: #a5b814;
        background-image: -webkit-gradient(linear, center top, center bottom, from(#a5b814), to(#96a813));
        background-image: -webkit-linear-gradient(top, #a5b814, #96a813);
        background-image: -moz-linear-gradient(top, #a5b814, #96a813);
        background-image: -o-linear-gradient(top, #a5b814, #96a813);
        background-image: -ms-linear-gradient(top, #a5b814, #96a813);
        background-image: linear-gradient(to bottom, #a5b814, #96a813);
        border-radius: 5px;
        border: 1px solid rgba(0,0,0,0.1);
        border-bottom: 3px solid rgba(0,0,0,0.2);
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1);
        box-shadow: 0 1px 5px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.1)
    }
    
    .elAudioSkin6 .elAudio {
        -webkit-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        -moz-box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        box-shadow: 0 1px 10px rgba(0,0,0,0.3);
        border-radius: 5px
    }`,
      `
    .elAudioSkin7 {
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        box-shadow: 0 1px 5px rgba(0,0,0,0.4)
    }`,
    ]

    if (element.content.html.includes('elAudioSkin')) {
      const themeClass = element.content.html.match(/elAudioSkin\d+/g)
      const themeNumber = themeClass[0].match(/\d+/g)
      let css = cf_classic_themes[themeNumber[0] - 1]
      css = css.replace(/\.elAudioSkin\d+/g, `#${element.id}`)
      app.generatedCSS += `\n\n/* CSS for Audio Player */\n`
      app.generatedCSS += css
      app.recommendations.push({
        type: 'Audio Player Theme',
        status: 'CSS',
        explainer: 'Custom CSS has been applied to the page to support the theme of this audio player.',
      })
    }

    const dom = document.querySelector(`[id="${element.id}"]`)

    if (dom.classList.contains('elAlign_right')) {
      alignments['margin-left'] = 'auto'
      alignments['margin-right'] = 0
    } else if (dom.classList.contains('elAlign_left')) {
      alignments['margin-right'] = 'auto'
      alignments['margin-left'] = 0
    } else if (dom.classList.contains('elAlign_center')) {
      alignments['margin-right'] = 'auto'
      alignments['margin-left'] = 'auto'
    }

    output.attrs = {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': parseInt(css['padding-left']) || 0,
        'padding-right': parseInt(css['padding-right']) || 0,
        width: parseInt(css['width']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-audio-url': data.element.content.url || '',
      'data-audio-loop': data.element.content.loop || 'no',
    }

    output.attrs.style = Object.assign(output.attrs.style, alignments)

    output.attrs.style = Object.assign(output.attrs.style, borderRadius)

    output.params = Object.assign(output.params, app.params(css, 'element', element.id))
    output.params['--style-background-color'] = css['background-color']

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

    output.attrs.id = element.id

    return output
  },

  billing_block: data => {
    const element = data.element
    const id = data.id
    const parentId = data.parentId
    const index = data.index
    const css_headline = app.properties.css(element.id, 'billing_headline')
    const css_input = app.properties.css(element.id, 'billing_input')
    const children = []

    for (let i = 0; i < element.content.items.length; i++) {
      const headlineJSON = app.headline(
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
        'billing_headline'
      )

      let inputJSON = {}

      if (data.element.content.items[i].label === 'Country') {
        const inputDom = document.querySelector(`#${element.id} select[name="country"]`)

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
          inputJSON = app.select({
            element: {
              content: {
                width: inputBox.width,
                height: inputBox.height,
                placeholder: 'Select Country',
                name: document.querySelector(`#${element.id} select[name="country"]`).getAttribute('name'),
                type: document.querySelector(`#${element.id} select[name="country"]`).getAttribute('type'),
                required: document
                  .querySelector(`#${element.id} select[name="country"]`)
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
        const inputDom = document.querySelector(`#${element.id} input[name="address"]`)

        if (inputDom) {
          const inputBox = inputDom.getBoundingClientRect()
          inputJSON = app.input({
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

      const innerFlexContainer = app.flex_container([headlineJSON, inputJSON], id, i)
      innerFlexContainer.attrs.style['flex-direction'] = 'column'
      innerFlexContainer.attrs.style['gap'] = 0

      if (i !== 0) {
        innerFlexContainer.attrs.style['margin-top'] = 10
      }

      children.push(innerFlexContainer)
    }

    const output = app.flex_container(children, parentId, index)
    output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
    output.attrs.style['flex-direction'] = 'column'
    output.attrs.style['gap'] = 0.5

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs = Object.assign(
      output.attrs,
      app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )

    output.attrs.id = element.id

    return output
  },

  button: data => {
    const element = data.element
    const output = app.blueprint('Button/V1', data.id, data.parentId, data.index, element)
    const mainId = app.makeId()
    const subId = app.makeId()
    const css = app.properties.css(element.id, 'button')
    const cssMain = app.properties.css(element.id, 'buttonMain')
    const cssSub = app.properties.css(element.id, 'buttonSub')
    const cssPrepend = app.properties.css(element.id, 'buttonPrepend')
    const cssAppend = app.properties.css(element.id, 'buttonAppend')
    const borderRadius = app.properties.borderRadius(css)
    const theParams = app.params(css, 'element', element.id)

    theParams['width--unit'] = '%'
    theParams['--style-padding-horizontal'] = parseInt(css['padding-left'])
    theParams['--style-padding-horizontal--unit'] = 'px'
    theParams['--style-padding-vertical'] = parseInt(css['padding-top'])
    theParams['--style-padding-vertical--unit'] = 'px'

    const fa_prependDom = document.querySelector(`#${element.id} .fa_prepended`)
    let fa_prepended = {}

    const fa_appendDom = document.querySelector(`#${element.id} .fa_appended`)
    let fa_appended = {}

    if (fa_prependDom) {
      fa_prepended = {
        attrs: {
          'data-skip-icon-settings': 'false',
          className: fa_prependDom.getAttribute('class').replace('fa_prepended ', ''),
          style: {
            'margin-left': parseInt(cssPrepend['margin-left']) || 0,
            'margin-right': parseInt(cssPrepend['margin-right']) || 0,
            'font-size': parseInt(cssPrepend['font-size']) || 0,
            color: cssPrepend['color'],
          },
        },
        params: {
          'margin-left--unit': 'px',
          'margin-right--unit': 'px',
          'font-size--unit': 'px',
        },
      }
    }

    if (fa_appendDom) {
      fa_appended = {
        attrs: {
          'data-skip-icon-settings': 'false',
          className: fa_appendDom.getAttribute('class').replace('fa_appended ', ''),
          style: {
            'margin-left': parseInt(cssAppend['margin-left']) || 0,
            'margin-right': parseInt(cssAppend['margin-right']) || 0,
            'font-size': parseInt(cssAppend['font-size']) || 0,
            color: cssAppend['color'],
          },
        },
        params: {
          'margin-left--unit': 'px',
          'margin-right--unit': 'px',
          'font-size--unit': 'px',
        },
      }
    }

    let newShowIds = ''
    let newHideIds = ''

    if (element.content.showIds) {
      element.content.showIds.split(',').forEach(id => {
        const item = app.idList.find(item => item.cf1_id === id)
        const newId = item ? item.cf2_id : id
        newShowIds += `${newId},`
      })
    }

    if (element.content.hideIds) {
      element.content.hideIds.split(',').forEach(id => {
        const item = app.idList.find(item => item.cf1_id === id)
        const newId = item ? item.cf2_id : id
        newHideIds += `${newId},`
      })
    }

    let href = element.content.href

    if (href.includes('#scroll-')) {
      let scrollId = href.replace('#scroll-', '')
      scrollId = decodeURIComponent(scrollId)
      const scrollItem = app.idList.find(item => item.title.trim() === scrollId.trim())
      const newScrollId = scrollItem ? scrollItem.cf2_id : 'not-found'
      href = `#scroll-id-${newScrollId}`
    }

    newShowIds = newShowIds.slice(0, -1)
    newHideIds = newHideIds.slice(0, -1)

    if (href.includes('http:') || href.includes('https:')) {
      app.recommendations.push({
        type: 'button',
        id: element.id,
        title: 'Button',
        message: 'This button links to an external website. Please make sure it is correct.',
      })
    }

    output.params = {
      buttonState: 'default',
      href: href,
      target: element.content.target || '_self',
      'margin-top--unit': 'px',
      'margin-right--unit': 'px',
      'margin-left--unit': 'px',
      'margin-bottom--unit': 'px',
      showIds: newShowIds,
      hideIds: newHideIds,
    }

    output.selectors = {
      '.elButton': {
        attrs: {
          style: {
            width: element.content.width,
            'font-family': cssMain['font-family'],
          },
          'data-skip-corners-settings': 'false',
          'data-skip-borders-settings': 'false',
          'data-skip-shadow-settings': 'false',
        },
        params: theParams,
      },
      '.elButton .elButtonText': {
        attrs: {
          'font-size--unit': 'px',
          style: {
            'font-family': cssMain['font-family'],
            'font-weight': cssMain['font-weight'],
            'letter-spacing': parseInt(cssMain['letter-spacing']) || 0,
            'line-height': parseInt(cssMain['line-height']) || 0,
            'font-size': parseInt(cssMain['font-size']) || 26,
            color: cssMain['color'],
            'text-transform': cssMain['text-transform'],
            'text-decoration': cssMain['text-decoration'],
            'text-align': cssMain['text-align'],
            opacity: cssMain['opacity'] || 1,
          },
          'data-skip-text-shadow-settings': 'false',
        },
        params: app.params(cssMain, 'element', element.id),
      },
      '.elButton .elButtonSub': {
        attrs: {
          style: {
            'font-family': cssSub['font-family'],
            'font-weight': cssMain['font-weight'],
            'letter-spacing': parseInt(cssSub['letter-spacing']) || 0,
            'line-height': parseInt(cssSub['line-height']) || 0,
            'font-size': parseInt(cssSub['font-size']) || 26,
            color: cssSub['color'],
            'text-transform': cssSub['text-transform'],
            'text-decoration': cssSub['text-decoration'],
            'text-align': cssSub['text-align'],
            opacity: cssSub['opacity'] || 0.7,
          },
          'data-skip-text-shadow-settings': 'false',
        },
        params: app.params(cssSub, 'element', element.id),
      },
      '.elButton:hover,\\n.elButton.elButtonHovered': {
        params: {
          '--style-background-color': css['background-color'],
        },
      },
      '.elButton:hover .elButtonText,\\n.elButton.elButtonHovered .elButtonText': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
      '.elButton:hover .elButtonSub,\\n.elButton.elButtonHovered .elButtonSub': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
      '.elButton:active,\\n.elButton.elButtonActive': {
        params: {
          '--style-background-color': css['background-color'],
        },
      },
      '.elButton:active .elButtonText,\\n.elButton.elButtonActive .elButtonText': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
      '.elButton:active .elButtonSub,\\n.elButton.elButtonActive .elButtonSub': {
        attrs: {
          style: {
            color: cssMain['color'],
          },
        },
      },
    }

    output.attrs = {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'margin-right': parseInt(element.css['margin-right']) || 0,
        'margin-left': parseInt(element.css['margin-left']) || 0,
        'margin-bottom': parseInt(element.css['margin-bottom']) || 0,
        'text-align': element.css['text-align'] || 'center',
        display: element.css['display'] || 'block',
        position: element.css['position'] || 'relative',
        'z-index': parseInt(element.css['z-index']) || 0,
      },
    }

    output.children = [
      {
        type: 'slot',
        slotName: 'button-main',
        id: mainId,
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a0',
        children: [
          {
            type: 'text',
            innerText: element.content.main,
            id: app.makeId(),
            version: 0,
            parentId: mainId,
            fractionalIndex: 'a0',
          },
        ],
      },
    ]

    if (fa_prepended?.params) {
      output.selectors['.fa_prepended'] = fa_prepended
    }

    if (fa_appended?.params) {
      output.selectors['.fa_apended'] = fa_appended
    }

    if (element.content.sub) {
      output.children.push({
        type: 'text',
        slotName: 'button-sub',
        id: subId,
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a0',
        innerText: element.content.sub,
      })
    }

    output.selectors['.elButton'].attrs.style = Object.assign(
      output.selectors['.elButton'].attrs.style,
      borderRadius
    )

    output.attrs.id = element.id

    return output
  },

  checkbox: (data, type = 'checkbox') => {
    const element = data.element
    const output = app.blueprint('Checkbox/V1', data.id, data.parentId, data.index, element)
    const contentEditableNodeId = app.makeId()
    const css = app.properties.css(element.id, type)
    let children = app.headlinePageTree(element.content.json, contentEditableNodeId)

    children = children.filter(function (element) {
      return element !== undefined
    })

    output.params = {
      type: 'custom_type',
      name: element.content.name,
      required: element.content.required === 'yes' ? true : false,
    }

    output.attrs = {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': parseInt(css['padding-left']) || 0,
        'padding-right': parseInt(css['padding-right']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-skip-background-settings': 'false',
    }

    output.selectors = {
      '.elCheckboxLabel .elCheckboxInput ~ .elCheckbox': {
        attrs: {
          style: {
            'font-family': css['font-family'],
            'letter-spacing': css['letter-spacing'] || 'normal',
            'line-height': css['line-height'] || 0,
            'font-size': parseInt(css['font-size']) || 26,
            color: css['color'],
            'text-transform': css['text-transform'] || 'none',
            'text-decoration': css['text-decoration'] || 'none',
            'text-align': css['text-align'] || 'center',
            opacity: parseInt(css['opacity']) || 1,
          },
        },
      },
    }

    output.children = [
      {
        type: 'ContentEditableNode',
        id: contentEditableNodeId,
        slotName: 'label',
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a0',
        children: children,
      },
    ]

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs.id = element.id

    return output
  },

  countdown: data => {
    const element = data.element
    const output = app.blueprint('Countdown/V1', data.id, data.parentId, data.index, element)

    let time_reset = null
    let countdown_type = null
    let date = element.content.date
    let end_date = null
    let month = null
    let day = null
    let year = null

    if (date) {
      date = date.split('/')
      month = date[0]
      day = date[1]
      year = date[2]
    }

    switch (element.content.type) {
      case 'countdown':
        countdown_type = 'countdown'
        time_reset = 'monthly'
        end_date = `${year}-${month}-${day}`
        break
      case 'countdown-evergreen':
        countdown_type = 'evergreen'
        time_reset = 'on_page_load'
        break
      case 'countdown-daily':
        time_reset = 'daily'
        countdown_type = 'evergreen'
        break
    }

    output.params = {
      type: countdown_type,
      show_colons: false,
      timezone: element.content.timezone,
      timer_action: element.content.action,
      cookie_policy: 'none',
      expire_days: 0,
      countdown_id: app.makeId(),
    }

    if (element.content.action === 'url') {
      output.params.timer_action = 'redirect_to'
      output.params.redirect_to = element.content.url
    }

    if (element.content.action === 'showhide') {
      output.params.timer_action = 'showhide'
      output.params.showIds = element.content.showIds
      output.params.hideIds = element.content.hideIds
    }

    if (end_date) {
      output.params.end_date = end_date
      output.params.end_time = `${element.content.time}:00:00`
    }

    output.params.evergreen_props = {
      time_resets: time_reset,
      reset_day: 1,
      timezone: element.content.timezone,
    }

    if (element.content.type === 'countdown-daily') {
      output.params.evergreen_props.reset_time = `${element.content.time}:00:00`
    }

    if (element.content.type === 'countdown-evergreen') {
      if (element.content.hours) {
        output.params.evergreen_props.reset_time_hours = parseInt(element.content.hours)
      }

      if (element.content.minutes) {
        output.params.evergreen_props.reset_time_minutes = parseInt(element.content.minutes)
      }

      if (element.content.seconds) {
        output.params.evergreen_props.reset_time_seconds = parseInt(element.content.seconds)
      }
    }

    output.params.countdown_opts = {
      show_years: /true/i.test(element.content.showYears),
      show_months: /true/i.test(element.content.showMonths),
      show_weeks: /true/i.test(element.content.showWeeks),
      show_days: /true/i.test(element.content.showDays),
      show_hours: /true/i.test(element.content.showHours),
      show_minutes: /true/i.test(element.content.showMinutes),
      show_seconds: /true/i.test(element.content.showSeconds),
    }

    // todo: try to make themes work
    // size, label color, etc

    output.selectors = {
      '.elCountdownAmount': {
        attrs: {
          style: {
            color: '#fff',
            'font-size': '28px',
            'font-family': 'Inter',
            'font-weight': '700',
            'line-height': '100%',
          },
        },
      },
      '.elCountdownPeriod': {
        attrs: {
          style: {
            'text-transform': 'uppercase',
            color: '#fff',
            'text-align': 'center',
            'font-size': '11px',
            'font-family': 'Inter',
            'font-weight': '600',
            'min-width': 5.3,
          },
        },
        params: {
          'min-width--unit': 'em',
        },
      },
      '.elCountdownColumn': {
        attrs: {
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          style: {
            gap: '0.3em',
            'padding-top': '8px',
            'padding-bottom': '8px',
            'border-radius': '8px',
          },
        },
        params: {
          '--style-background-color': '#1C65E1',
          '--style-padding-horizontal': '5px',
          '--style-box-shadow-distance-x': 0,
          '--style-box-shadow-distance-y': 6,
          '--style-box-shadow-blur': 24,
          '--style-box-shadow-spread': -8,
          '--style-box-shadow-color': 'rgba(28, 101, 225, 0.5)',
          '--style-border-width': '3px',
          '--style-border-style': 'solid',
          '--style-border-color': '#164EAD',
        },
      },
      '.elCountdownGroupTime': {
        attrs: {
          style: {
            gap: '1.1em',
          },
        },
      },
      '.elCountdownAmountContainer': {
        attrs: {
          'data-skip-shadow-settings': 'true',
          'data-skip-corners-settings': 'true',
          style: {
            'line-height': '100%',
            'padding-top': 0,
            'padding-bottom': 0,
            'border-style': 'none',
          },
        },
        params: {
          '--style-padding-horizontal': 0,
        },
      },
    }

    output.attrs = {
      style: {
        'padding-top': 15,
        'padding-bottom': 12,
        'border-radius': '4px',
      },
      'data-skip-shadow-settings': 'false',
      'data-skip-corners-settings': 'false',
    }

    output.attrs.id = element.id

    console.log('countdown output', output)

    return output
  },

  divider: data => {
    const element = data.element
    const id = data.id
    const parentId = data.parentId
    const index = data.index
    const css = app.properties.css(element.id, 'divider')
    const cssContainer = app.properties.css(element.id, 'dividerContainer')
    const dividerInner = document.querySelector(`#${element.id} .elDividerInner`)
    const theParams = app.params(css, 'element', element.id)
    theParams['--style-border-top-width'] = parseInt(css['border-top-width']) || 0
    theParams['width--unit'] = '%'
    const alignment = dividerInner.getAttribute('data-align')
    const output = {
      type: 'Divider/V1',
      id: id,
      version: 0,
      parentId: parentId,
      fractionalIndex: `a${index}`,
      params: {
        'margin-top--unit': 'px',
        '--style-padding-horizontal--unit': 'px',
        '--style-padding-horizontal': parseInt(cssContainer['padding-left']) || 0,
        'padding-bottom--unit': 'px',
        'padding-top--unit': 'px',
        'width--unit': '%',
      },
      attrs: {
        style: {
          'margin-top': parseInt(element.css['margin-top']) || 0,
          'padding-top': parseInt(cssContainer['padding-top']) || 0,
          'padding-bottom': parseInt(cssContainer['padding-bottom']) || 0,
          position: element.css['position'] || 'relative',
          'z-index': parseInt(element.css['z-index']) || 0,
        },
      },
      selectors: {
        '.elDivider': {
          params: theParams,
          attrs: {
            style: {
              margin: '0 auto',
              width: parseInt(dividerInner.getAttribute('data-width-border')) || 100,
            },
            'data-skip-shadow-settings': 'false',
          },
        },
      },
    }

    if (alignment === 'left') {
      output.selectors['.elDivider'].attrs.style.margin = '0 auto 0 0'
    } else if (alignment === 'right') {
      output.selectors['.elDivider'].attrs.style.margin = '0 0 0 auto'
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

    output.attrs.id = element.id
    return output
  },

  embed: data => {
    const element = data.element
    const output = app.blueprint('CustomHtmlJs/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'embed')

    output.params = {
      originalCode: element.content.code,
    }

    output.attrs = {
      style: {
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
    }

    output.attrs.id = element.id

    return output
  },

  faq_block: data => {
    const element = data.element
    const id = data.id
    const parentId = data.parentId
    const index = data.index
    const css_headline = app.properties.css(element.id, 'faq_block_headline')
    const css_paragraph = app.properties.css(element.id, 'faq_block_paragraph')

    const headlineId = app.makeId()
    const headlineJSON = app.headline(
      {
        element: {
          content: {
            visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
            text: data.element.content.headline_text,
            html: data.element.content.headline,
            json: data.element.content.headline_json,
          },
          id: element.id,
          css: css_headline,
          parentId: id,
        },
        id: headlineId,
        index: index,
      },
      'faq_block_headline',
      'faqPrepend',
      'faqIcon'
    )

    const paragraphDataJSON = app.headline(
      {
        element: {
          content: {
            visible: app.checkVisibility(document.querySelector(`#${element.id}`)),
            text: data.element.content.paragraph_text,
            html: data.element.content.paragraph,
            json: data.element.content.paragraph_json,
          },
          id: element.id,
          css: css_paragraph,
          parentId: id,
        },
      },
      'faq_block_paragraph'
    )

    const output = app.flex_container([headlineJSON, paragraphDataJSON], parentId, index)
    output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
    output.attrs.style['flex-direction'] = 'column'

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
      output.attrs = Object.assign(
        output.attrs,
        app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
      )
    }

    output.attrs.id = element.id

    return output
  },

  fb_comments: data => {
    const element = data.element
    const output = app.blueprint('CustomHtmlJs/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'embed')

    output.params = {
      originalCode: element.content.code,
    }

    output.attrs = {
      style: {
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
    }

    app.recommendations.push({
      type: 'fb_comments',
      id: element.id,
      title: 'FB Comments',
      message: 'The Facebook comments have been converted to a Custom HTML/JS element.',
    })

    output.attrs.id = element.id

    return output
  },

  featured_image: data => {
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

    const imageJSON = app.image(
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

    const headlineJSON = app.headline(
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

    const paragraphDataJSON = app.headline(
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

    const imageContainer = app.flex_container([imageJSON], parentId, index)
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
      textContainer = app.flex_container([headlineJSON, paragraphDataJSON], parentId, index)
    } else if (!data.element.content.headline_text && data.element.content.paragraph_text) {
      textContainer = app.flex_container([paragraphDataJSON], parentId, index)
    } else if (data.element.content.headline_text && !data.element.content.paragraph_text) {
      textContainer = app.flex_container([headlineJSON], parentId, index)
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

    const output = app.flex_container(flexContainer, parentId, index)
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
  },

  flex_container: (children, parentId, index) => {
    const id = app.makeId()
    children.forEach(item => {
      item.parentId = id
    })

    const output = {
      type: 'FlexContainer/V1',
      id: id,
      version: 0,
      parentId: parentId,
      fractionalIndex: `a${index}`,
      attrs: {
        className: 'elFlexNoWrapMobile elFlexNoWrap',
        style: {
          width: 100,
          'justify-content': 'flex-start',
          'flex-direction': 'row',
          'margin-top': 0,
          'padding-top': 0,
          'padding-bottom': 0,
          gap: 0,
        },
      },
      params: {
        'width--unit': '%',
        'gap--unit': 'em',
        'margin-top--unit': 'px',
        '--style-padding-horizontal--unit': 'px',
        '--style-padding-horizontal': 0,
      },
      children: children,
    }

    return output
  },

  headline: (
    data,
    type = 'headline',
    prependIconType = 'headlinePrepend',
    fa_prepended_class = 'fa_prepended'
  ) => {
    const element = data.element

    let blueprintTitle = 'Headline/V1'
    let blueprintClassname = '.elHeadline'

    // Fix for later: The settings for subheadline and paragraph are not the same as Headline.
    // if (element.title === 'sub-headline') {
    //   blueprintTitle = 'SubHeadline/V1'
    //   blueprintClassname = '.elSubHeadline'
    // } else if (element.title === 'Paragraph') {
    //   blueprintTitle = 'Paragraph/V1'
    //   blueprintClassname = '.elParagraph'
    // }

    const output = app.blueprint(blueprintTitle, data.id, data.parentId, data.index, element)
    const contentEditableNodeId = app.makeId()
    const css = app.properties.css(element.id, type)
    let children = app.headlinePageTree(element.content.json, contentEditableNodeId)
    let fontWeight = css['font-weight']
    let boldColor = ''

    if (/<\/?[a-z][\s\S]*>/i.test(element.content.html)) {
      if (document.querySelector(`style#bold_style_${element.id}`)) {
        const boldColorStyle = document.querySelector(`style#bold_style_${element.id}`).textContent
        boldColor = boldColorStyle.split('color:')[1].replace(';', '').replace('}', '').trim()
      }
    } else {
      const plainTextId = app.makeId()
      children = [
        {
          type: 'text',
          innerText: element.content.text,
          id: plainTextId,
          version: 0,
          parentId: contentEditableNodeId,
          fractionalIndex: 'a0',
        },
      ]
    }

    const borderRadius = app.properties.borderRadius(element.css)

    if (fontWeight === 'normal') {
      fontWeight = '400'
    } else if (fontWeight === 'bold') {
      fontWeight = '700'
    } else if (fontWeight === 'bolder') {
      fontWeight = '800'
    } else if (fontWeight === 'lighter') {
      fontWeight = '300'
    }

    const cssPrepend = app.properties.css(element.id, prependIconType)
    const fa_prependDom = document.querySelector(`#${element.id} .${fa_prepended_class}`)
    let fa_prepended = {}

    if (fa_prependDom) {
      fa_prepended = {
        attrs: {
          'data-skip-icon-settings': 'false',
          className: fa_prependDom.getAttribute('class').replace(`${fa_prepended_class} `, ''),
          style: {
            'margin-left': parseInt(cssPrepend['margin-left']) || 0,
            'margin-right': 10,
            'font-size': parseInt(cssPrepend['font-size']) || 0,
            color: cssPrepend['color'],
            width: 'auto',
          },
        },
        params: {
          'margin-left--unit': 'px',
          'margin-right--unit': 'px',
          'font-size--unit': 'px',
        },
      }
    }

    children = children.filter(function (element) {
      return element !== undefined
    })

    output.params = type !== 'image_list_headline' ? app.params(css, 'element', element.id) : {}

    output.attrs = {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': parseInt(css['padding-left']) || 0,
        'padding-right': parseInt(css['padding-right']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-skip-background-settings': 'false',
    }

    output.selectors = {
      [blueprintClassname]: {
        attrs: {
          style: {
            'font-family': css['font-family'],
            'font-weight': fontWeight,
            'letter-spacing': css['letter-spacing'] || 'normal',
            'line-height': css['line-height'] || 0,
            'font-size': parseInt(css['font-size']) || 26,
            color: css['color'],
            'text-transform': css['text-transform'] || 'none',
            'text-decoration': css['text-decoration'] || 'none',
            'text-align': css['text-align'] || 'center',
            opacity: parseInt(css['opacity']) || 1,
          },
        },
        [`${blueprintClassname} b,\\n${blueprintClassname} strong`]: {
          attrs: {
            style: {
              color: boldColor || css['color'],
            },
          },
        },
      },
      [`${blueprintClassname} b,\\n${blueprintClassname} strong`]: {
        attrs: {
          style: {
            color: boldColor || css['color'],
          },
        },
      },
      '.fa_prepended': fa_prepended,
    }

    output.children = [
      {
        type: 'ContentEditableNode',
        attrs: { 'data-align-selector': blueprintClassname },
        id: contentEditableNodeId,
        version: 0,
        parentId: data.id,
        fractionalIndex: 'a0',
        children: children,
      },
    ]

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs.style = Object.assign(output.attrs.style, borderRadius)

    output.attrs.id = element.id

    return output
  },

  icon: data => {
    const element = data.element
    const output = app.blueprint('Icon/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'icon')
    const href = document.querySelector(`#${element.id} .eliconelement`).getAttribute('href')

    const cf_classic_themes = [
      `
    .iconelement_theme_1 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 1px 1px 0 #fff,3px 3px 3px rgba(0,0,0,0.075)
  }
  
  .iconelement_theme_1 i {
    display: inline-block;
      width: auto;
      background: #f9f9f9;
      border-radius: 200px;
      padding: 20px 26px;
      border-bottom: 2px solid rgba(0,0,0,0.075)
  }`,
      `
  .iconelement_theme_2 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15);
      color: #fff
  }
  
  .iconelement_theme_2 i {
    display: inline-block;
      width: auto;
      background: #0074c7;
      border-radius: 4px;
      padding: 10px 16px;
      color: #fff;
      border: 2px solid rgba(0,0,0,0.15);
      border-bottom: 4px solid rgba(0,0,0,0.15)
  }`,
      `
  .iconelement_theme_3 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_3 i {
    display: inline-block;
      width: auto;
      background: #fafafa;
      border-radius: 4px;
      padding: 10px 16px;
      border: 2px solid rgba(0,0,0,0.075);
      border-bottom: 4px solid rgba(0,0,0,0.075)
  }`,
      `
  .iconelement_theme_4 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_4 i {
    display: inline-block;
      width: auto;
      background: #fafafa;
      border-radius: 4px;
      padding: 10px 16px;
      border: 2px solid rgba(0,0,0,0.075);
      border-bottom: 4px solid rgba(0,0,0,0.075)
  }`,
      `
  .iconelement_theme_5 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block
  }
  
  .iconelement_theme_5 i {
    display: inline-block;
      width: auto;
      border-radius: 200px;
      padding: 19px 26px;
      border: 2px solid rgba(0,0,0,0.15)
  }`,
      `
  .iconelement_theme_6 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block
  }
  
  .iconelement_theme_6 i {
    display: inline-block;
      width: auto;
      border-radius: 4px;
      padding: 10px 10px;
      border: 2px solid rgba(0,0,0,0.15)
  }`,
      `
  .iconelement_theme_7 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_7 i {
    display: inline-block;
      width: auto;
      background: #3cb371;
      border-radius: 4px;
      padding: 10px 16px;
      color: #fff;
      background: #6abe18;
      background: -moz-linear-gradient(top, #cbe951, #9dd254 5%, #5eac11);
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #cbe951), color-stop(0.03, #9dd254), to(#5eac11));
      filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#9dd254', EndColorStr='#5eac11');
      -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#9dd254', EndColorStr='#5eac11')";
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      border-radius: 5px;
      border: 1px solid #53a40c;
      border-bottom: 1px solid #468f0a;
      color: #FFF !important;
      text-shadow: 0 1px 1px #316903
  }`,
      `
  .iconelement_theme_8 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_8 i {
    display: inline-block;
      width: auto;
      padding: 10px 16px;
      text-shadow: 0 1px 0 #fff;
      background: #f5f5f5;
      background: -webkit-gradient(linear, left top, left bottom, from(#f9f9f9), to(#f0f0f0));
      background: -moz-linear-gradient(top, #f9f9f9, #f0f0f0);
      border: 1px solid #dedede;
      border-color: #dedede #d8d8d8 #d3d3d3;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      -webkit-box-shadow: 0 1px 2px #eaeaea, inset 0 1px 0 #fbfbfb;
      -moz-box-shadow: 0 1px 2px #eaeaea, inset 0 1px 0 #fbfbfb;
      box-shadow: 0 1px 2px #eaeaea, inset 0 1px 0 #fbfbfb;
      background: #e6433d;
      background: -webkit-gradient(linear, left top, left bottom, from(#f8674b), to(#d54746));
      background: -moz-linear-gradient(top, #f8674b, #d54746);
      border-color: #d1371c #d1371c #9f220d;
      color: #fff;
      text-shadow: 0 1px 1px #961a07;
      -webkit-box-shadow: 0 1px 2px #d6d6d6, inset 0 1px 0 #ff9573;
      -moz-box-shadow: 0 1px 2px #d6d6d6, inset 0 1px 0 #ff9573;
      box-shadow: 0 1px 2px #d6d6d6
  }`,
      `
  .iconelement_theme_9 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_9 i {
    display: inline-block;
      width: auto;
      padding: 10px 16px;
      -moz-box-shadow: inset 0px -7px 8px -7px #ffd59e;
      -webkit-box-shadow: inset 0px -7px 8px -7px #ffd59e;
      box-shadow: inset 0px -7px 8px -7px #ffd59e;
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #f9d67d), color-stop(1, #f3b156));
      background: -moz-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
      background: -webkit-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
      background: -o-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
      background: -ms-linear-gradient(top, #f9d67d 5%, #f3b156 100%);
      background: linear-gradient(to bottom, #f9d67d 5%, #f3b156 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f9d67d', endColorstr='#f3b156', GradientType=0);
      background-color: #f9d67d;
      -moz-border-radius: 8px;
      -webkit-border-radius: 8px;
      border-radius: 8px;
      border: 1px solid #dda755;
      display: inline-block;
      font-weight: bold;
      color: #9d540b !important;
  }
  `,
      `
  .iconelement_theme_10 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_10 i {
    display: inline-block;
      width: auto;
      background: #3cb371;
      border-radius: 4px;
      padding: 10px 16px;
      background: -webkit-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
      background: -moz-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
      background: -o-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
      background: -ms-linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
      background: linear-gradient(top, #f4f5f7 0%, #e1e2e6 90%, #cfd1d4 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f4f5f7', endColorstr='#cfd1d4', GradientType=0);
      border: 1px solid #949494;
      -webkit-box-shadow: inset 0px 1px 0px #fff,0px 1px 1px rgba(0,0,0,0.15);
      -moz-box-shadow: inset 0px 1px 0px #fff,0px 1px 1px rgba(0,0,0,0.15);
      box-shadow: inset 0px 1px 0px #fff,0px 1px 1px rgba(0,0,0,0.15);
      color: #555454;
      text-shadow: 0px 1px 0px #fff;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px
  }
  `,
      `
  .iconelement_theme_11 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_11 i {
    display: inline-block;
      width: auto;
      background: #3cb371;
      border-radius: 4px;
      padding: 10px 16px;
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ffd683), color-stop(0.03, #f5b026), to(#f48423));
      filter: progid:DXImageTransform.Microsoft.gradient(startColorStr='#f5b026', EndColorStr='#f48423');
      -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#f5b026', EndColorStr='#f48423')";
      -moz-border-radius: 5px;
      -webkit-border-radius: 5px;
      border-radius: 5px;
      border: 1px solid #e6791c;
      border-bottom: 1px solid #d86f15;
      color: #FFF;
      text-shadow: 0 1px 1px #6f3a02
  }`,
      `
  .iconelement_theme_12 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_12 i {
    display: inline-block;
      width: auto;
      background: #3cb371;
      border-radius: 4px;
      padding: 10px 16px;
      color: #fff;
      -moz-box-shadow: inset 0px 1px 0px 0px #7a8eb9;
      -webkit-box-shadow: inset 0px 1px 0px 0px #7a8eb9;
      box-shadow: inset 0px 1px 0px 0px #7a8eb9;
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #637aad), color-stop(1, #5972a7));
      background: -moz-linear-gradient(top, #637aad 5%, #5972a7 100%);
      background: -webkit-linear-gradient(top, #637aad 5%, #5972a7 100%);
      background: -o-linear-gradient(top, #637aad 5%, #5972a7 100%);
      background: -ms-linear-gradient(top, #637aad 5%, #5972a7 100%);
      background: linear-gradient(to bottom, #637aad 5%, #5972a7 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#637aad', endColorstr='#5972a7', GradientType=0);
      background-color: #637aad;
      border: 1px solid #314179
  }`,
      `
  .iconelement_theme_13 {
      padding: 0;
      margin: 0;
      color: inherit;
      text-align: center;
      font-size: 55px;
      line-height: 1em;
      display: block;
      text-shadow: 3px 2px 5px rgba(0,0,0,0.15)
  }
  
  .iconelement_theme_13 i {
    display: inline-block;
      width: auto;
      background: #3cb371;
      border-radius: 4px;
      padding: 10px 16px;
      color: #fff;
      background: -webkit-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
      background: -moz-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
      background: -o-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
      background: -ms-linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
      background: linear-gradient(top, #777 0%, #585858 90%, #454545 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#777777', endColorstr='#454545', GradientType=0);
      border: 1px solid #323232;
      -webkit-box-shadow: inset 0px 1px 0px rgba(255,255,255,0.35),0px 1px 1px rgba(0,0,0,0.15);
      -moz-box-shadow: inset 0px 1px 0px rgba(255,255,255,0.35),0px 1px 1px rgba(0,0,0,0.15);
      box-shadow: inset 0px 1px 0px rgba(255,255,255,0.35),0px 1px 1px rgba(0,0,0,0.15);
      color: #fff;
      text-shadow: 0px -1px 0px rgba(0,0,0,0.22);
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px
  }`,
    ]

    if (element.content.html.includes('iconelement_theme_')) {
      const themeClass = element.content.html.match(/iconelement_theme_\d+/g)
      const themeNumber = themeClass[0].match(/\d+/g)
      let css = cf_classic_themes[themeNumber[0] - 1]
      css = css.replace(/\.iconelement_theme_\d+/g, `#${element.id}`)
      app.generatedCSS += `\n\n/* CSS for Icon */\n`
      app.generatedCSS += css
      app.recommendations.push({
        type: 'Icon Theme',
        status: 'CSS',
        explainer: 'Custom CSS has been applied to the page to support the theme of this icon.',
      })
    }

    output.selectors = {
      '.fa_icon': {
        attrs: {
          className: element.content.fontAwesome,
          style: {
            'padding-top': '10px',
            'padding-bottom': '10px',
            'font-size': parseInt(css['font-size']) || 0,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '.iconElement': {
        attrs: {
          style: {
            'margin-top': parseInt(element.css['margin-top']) || 0,
            'text-align': css['text-align'] || 'center',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            opacity: parseInt(css['opacity']) || 1,
          },
        },
        params: app.params(css, 'element', element.id),
      },
      '.iconElement .fa, .iconElement .fas, .iconElement .fa-fw': {
        attrs: {
          style: {
            color: css['color'],
          },
        },
      },
    }

    if (href) {
      output.selectors['.iconElement'].params.href = href
    }

    output.attrs.id = element.id

    return output
  },

  image_list: data => {
    const element = data.element
    const id = data.id
    const parentId = data.parentId
    const index = data.index
    const css_headline = app.properties.css(element.id, 'image_list_headline')
    const children = []

    for (let i = 0; i < element.content.list.length; i++) {
      const headlineJSON = app.headline(
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
        imageJSON = app.image({
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

      const innerFlexContainer = app.flex_container(flexData, id, i)

      if (domContainerListFirstItem) {
        const itemStyles = getComputedStyle(domContainerListFirstItem)
        innerFlexContainer.attrs.style['border-bottom-width'] = itemStyles['border-bottom-width']
        innerFlexContainer.attrs.style['border-color'] = itemStyles['border-color']
        innerFlexContainer.attrs.style['border-style'] = itemStyles['border-style']
      }

      children.push(innerFlexContainer)
    }

    const output = app.flex_container(children, parentId, index)
    output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
    output.attrs.style['flex-direction'] = 'column'
    output.attrs.style['gap'] = 0.5
    output.attrs.style['margin-left'] = document.querySelector(`#${element.id}`).style.marginLeft || 0

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs = Object.assign(
      output.attrs,
      app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )

    output.attrs.id = element.id

    return output
  },

  image_popup: data => {
    const element = data.element
    const output = app.image(data)
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
  },

  image: data => {
    const element = data.element
    const output = app.blueprint('Image/V2', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'image')
    const borderRadius = app.properties.borderRadius(css)
    const theParams = app.params(css, 'element', element.id)

    theParams['default-aspect-ratio'] = '1280 / 853'

    output.params = {
      'padding-top--unit': 'px',
      'padding-bottom--unit': 'px',
      'padding-left--unit': 'px',
      'padding-right--unit': 'px',
      imageUrl: [
        {
          type: 'text',
          innerText: element.content.src,
        },
      ],
    }

    output.params = Object.assign(output.params, theParams)

    output.attrs = {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        position: css['position'] || 'relative',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': parseInt(css['padding-left']) || 0,
        'padding-right': parseInt(css['padding-right']) || 0,
        'background-color': css['background-color'],
        'z-index': parseInt(css['z-index']) || 0,
        opacity: parseFloat(css['opacity']) || 1,
        width: parseInt(element.content.width),
        height: 'auto',
      },
      'data-skip-corners-settings': 'false',
      'data-skip-borders-settings': 'false',
      'data-skip-shadow-settings': 'false',
      'data-skip-background-settings': 'false',
    }

    output.selectors = {
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
            filter: css['filter'] || 'none',
            'object-fit': 'fill',
            'object-position': 'center',
            'max-width': '100%',
            'vertical-align': 'bottom',
            'aspect-ratio': 'auto',
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            'box-sizing': 'border-box',
          },
          'data-lazy-loading': 'false',
          'data-image-quality': 100,
        },
      },
    }

    output.selectors['.elImage'].attrs.style = Object.assign(
      output.selectors['.elImage'].attrs.style,
      borderRadius
    )

    const radiusCSS = document.querySelector(`#${element.id} .ximg`)
    let radiusUnit = 'px'

    if (radiusCSS) {
      const radiusStyle = getComputedStyle(radiusCSS)
      const radiusValue = radiusStyle.borderRadius

      if (radiusCSS) {
        radiusUnit = radiusValue.match(/px|%/g)[0]
      }
    }

    output.params['border-radius--unit'] = radiusUnit
    output.attrs.style = Object.assign(output.attrs.style, borderRadius)

    if (element.content.link) {
      output.selectors['.elImage'].attrs['data-element-link'] = element.content.link
      output.selectors['.elImage'].attrs.target = element.content.target
    }

    output.attrs.id = element.id

    return output
  },

  input: data => {
    const element = data.element
    const output = app.blueprint('Input/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'input')

    output.params = {
      label: element.content.placeholder,
      labelType: 'on-border',
      '--style-background-color': '#fff',
    }

    output.attrs = {
      type: element.content.name,
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
      },
    }

    output.selectors = {
      '.elInput': {
        attrs: {
          name: element.content.name,
          type: element.content.name,
          className: element.content.required,
          'data-custom-type': element.content.custom_type,
        },
      },
      '.inputHolder, .borderHolder': {
        attrs: {
          style: {
            'padding-top': '12px',
            'padding-bottom': '12px',
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          '--style-padding-horizontal': '12px',
          '--style-border-width': '1px',
          '--style-border-style': 'solid',
          '--style-border-color': 'rgba(0, 0, 0, 0.2)',
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper .labelText': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper.elFormItemWrapper.elInputFocused .labelText': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) - 3 || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper.hasValue .labelText': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) - 3 || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '.elInput::placeholder': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper, .inputHolder, .borderHolder': {
        attrs: {
          'data-skip-corners-settings': 'false',
          style: {
            'border-radius': '4px',
          },
        },
      },
    }

    app.cssForInput(element.id, 'Input')
    output.attrs.id = element.id

    return output
  },

  list: data => {
    const element = data.element
    const id = data.id
    const css = app.properties.css(element.id, 'list')
    const mainId = app.makeId()
    const children = []
    let themeClassName = ''
    let boldColor = '#000'
    let iconColor = '#000'
    let linkColor = '#000'
    let bulletSpacing = null

    const cf_classic_themes = [
      `
  .elBulletList_theme1 li {
        padding: 0;
        margin-bottom: 0
    }
    
    .elBulletList_theme1 li i.fa,.elBulletList_theme1 li i.far,.elBulletList_theme1 li i.fas,.elBulletList_theme1 li i.fad,.elBulletList_theme1 li i.fab,.elBulletList_theme1[data-list-type=ordered] li::before {
        padding: 10px 10px;
        background: #f9f9f9;
        border: 1px solid #eee;
        border-bottom: 2px solid #eee;
        border-radius: 4px;
        margin: 5px 0;
        margin-right: 6px;
        width: auto;
        margin-left: 0 !important;
        display: inline-block
    }
    
    `,
      `
  .elBulletList_theme2 li {
        padding: 0;
        margin-bottom: 0
    }
    
    .elBulletList_theme2 li i.fa,.elBulletList_theme2 li i.far,.elBulletList_theme2 li i.fas,.elBulletList_theme2 li i.fab,.elBulletList_theme2 li i.fad,.elBulletList_theme2[data-list-type=ordered] li::before {
        padding: 10px 10px;
        background: #fafafa;
        border: 1px solid #eee;
        border-bottom: 2px solid #ddd;
        border-radius: 224px;
        margin: 5px 0;
        margin-right: 6px;
        width: auto;
        margin-left: 0 !important;
        display: inline-block
    }`,
      `
      .elBulletList_theme3 li {
        padding: 0;
        margin-bottom: 0;
        border-bottom: 1px solid #eee
    }
    
    .elBulletList_theme3 li:last-child {
        border-bottom: none
    }
    
    .elBulletList_theme3 li i.fa,.elBulletList_theme3 li i.far,.elBulletList_theme3 li i.fas,.elBulletList_theme3 li i.fab,.elBulletList_theme3 li i.fad,.elBulletList_theme3[data-list-type=ordered] li::before {
        padding: 10px 10px;
        background: #3cb371;
        border-bottom: 2px solid #308f5a;
        color: #fff;
        border-radius: 3px;
        margin: 5px 0;
        margin-right: 6px;
        width: auto;
        margin-left: 0 !important;
        display: inline-block
    }`,
      `
  .elBulletList_theme4 li {
        padding: 0;
        margin-bottom: 0;
        border-bottom: 1px solid #eee
    }
    
    .elBulletList_theme4 li:last-child {
        border-bottom: none
    }
    
    .elBulletList_theme4 li i.fa,.elBulletList_theme4 li i.far,.elBulletList_theme4 li i.fas,.elBulletList_theme4 li i.fab,.elBulletList_theme4 li i.fad,.elBulletList_theme4[data-list-type=ordered] li::before {
        padding: 10px 10px;
        background: #d8542e;
        border-bottom: 2px solid #ae3d1e;
        color: #fff;
        border-radius: 3px;
        margin: 5px 0;
        margin-right: 6px;
        width: auto;
        margin-left: 0 !important;
        display: inline-block
    }`,

      `
      .elBulletList_theme5 {
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid #eee;
        background: #fff
    }
    
    .elBulletList_theme5 li {
        padding: 0;
        margin-bottom: 0;
        border-bottom: 1px solid #eee;
        background: #fff
    }
    
    .elBulletList_theme5 li:last-child {
        border-top: none
    }
    
    .elBulletList_theme5 li i.fa,.elBulletList_theme5 li i.far,.elBulletList_theme5 li i.fas,.elBulletList_theme5 li i.fab,.elBulletList_theme5 li i.fad,.elBulletList_theme5[data-list-type=ordered] li::before {
        padding: 11px 9px;
        background: #f9f9f9;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: 6px;
        width: auto;
        margin-left: 0 !important;
        display: inline-block
    }
    
    .elBulletList_theme5 li i.fa:last-child,.elBulletList_theme5[data-list-type=ordered] li::before {
        border-bottom: none
    }`,

      `
  .elBulletList_theme6 {
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid #186aa1;
        background: #fff
    }
    
    .elBulletList_theme6 li {
        padding: 0;
        margin-bottom: 0;
        border-bottom: 1px solid #186aa1
    }
    
    .elBulletList_theme6 li:first-child {
        border-top-right-radius: 5px
    }
    
    .elBulletList_theme6 li:last-child {
        border-top: none;
        border-bottom-right-radius: 4px
    }
    
    .elBulletList_theme6 li i.fa,.elBulletList_theme6 li i.far,.elBulletList_theme6 li i.fas,.elBulletList_theme6 li i.fab,.elBulletList_theme6 li i.fad,.elBulletList_theme6[data-list-type=ordered] li::before {
        padding: 11px 9px;
        background: #128ee6;
        background-image: -webkit-linear-gradient(top, #128ee6, #0074c7);
        background-image: -moz-linear-gradient(top, #128ee6, #0074c7);
        background-image: -ms-linear-gradient(top, #128ee6, #0074c7);
        background-image: -o-linear-gradient(top, #128ee6, #0074c7);
        background-image: linear-gradient(to bottom, #128ee6, #0074c7);
        color: #fff;
        border-right: 1px solid #186aa1;
        border-bottom: 1px solid #186aa1;
        margin-right: 6px;
        width: auto;
        margin-left: 0 !important;
        display: inline-block
    }
    
    .elBulletList_theme6 li i.fa:last-child,.elBulletList_theme6 li i.far:last-child,.elBulletList_theme6 li i.fas:last-child,.elBulletList_theme6 li i.fab:last-child,.elBulletList_theme6 li i.fad:last-child,.elBulletList_theme6[data-list-type=ordered] li::before {
        border-bottom: none
    }
  `,

      `
  .elBulletList_theme7 {
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid #3cb371;
      background: #fff
  }
  
  .elBulletList_theme7 li {
      padding: 0;
      margin-bottom: 0;
      border-bottom: 1px solid #3cb371
  }
  
  .elBulletList_theme7 li:first-child {
      border-top-right-radius: 5px
  }
  
  .elBulletList_theme7 li:last-child {
      border-top: none;
      border-bottom-right-radius: 5px
  }
  
  .elBulletList_theme7 li i.fa,.elBulletList_theme7 li i.far,.elBulletList_theme7 li i.fas,.elBulletList_theme7 li i.fab,.elBulletList_theme7 li i.fad,.elBulletList_theme7[data-list-type=ordered] li::before {
      padding: 11px 9px;
      background: #3fcc7c;
      background-image: -webkit-linear-gradient(top, #3fcc7c, #3cb371);
      background-image: -moz-linear-gradient(top, #3fcc7c, #3cb371);
      background-image: -ms-linear-gradient(top, #3fcc7c, #3cb371);
      background-image: -o-linear-gradient(top, #3fcc7c, #3cb371);
      background-image: linear-gradient(to bottom, #3fcc7c, #3cb371);
      color: #fff;
      border-right: 1px solid #3cb371;
      border-bottom: 1px solid #3cb371;
      margin-right: 6px;
      width: auto;
      margin-left: 0 !important;
      display: inline-block
  }
    `,
    ]

    const secondListItem = document.querySelector(`#${element.id} li:nth-child(2)`)
    if (secondListItem) {
      const secondListItemStyle = window.getComputedStyle(secondListItem)
      if (secondListItemStyle.marginTop) {
        bulletSpacing = parseInt(secondListItemStyle.marginTop)
      }
    }

    if (element.content.html && element.content.html.includes('elBulletList_theme')) {
      const themeClass = element.content.html.match(/elBulletList_theme\d+/g)
      const themeNumber = themeClass[0].match(/\d+/g)
      let css = cf_classic_themes[themeNumber[0] - 1]
      css = css.replace(/\.elBulletList_theme\d+/g, `#${element.id}`)
      bulletSpacing = 0
      app.generatedCSS += `\n\n/* CSS for Bullet List */\n`
      app.generatedCSS += css
      app.recommendations.push({
        type: 'Bullet List Theme',
        status: 'CSS',
        explainer: 'Custom CSS has been applied to the page to support the theme of this bullet list.',
      })
    }

    element.content.items.forEach((item, index) => {
      const itemID = app.makeId()
      const content = app.headlinePageTree(item.json, item.id)

      content.forEach((item, index) => {
        item.parentId = itemID
        item.fractionalIndex = 'a' + (index + 1).toString(36)
      })

      content[0] = {
        type: 'IconNode',
        attrs: {
          className: `${content[0].attrs.class} fa_icon`,
          contenteditable: 'false',
        },
        id: content[0].id,
        version: 0,
        parentId: itemID,
        fractionalIndex: content[0].fractionalIndex,
      }

      const data = {
        type: 'li',
        id: itemID,
        version: 0,
        parentId: mainId,
        fractionalIndex: 'a' + (index + 1).toString(36),
        children: content,
      }
      children.push(data)
    })

    if (
      document.querySelector(`#${element.id} .elBulletList b`) &&
      document.querySelector(`style#bold_style_${element.id}`)
    ) {
      const boldColorStyle = document.querySelector(`style#bold_style_${element.id}`).textContent
      boldColor = boldColorStyle.split('color:')[1].replace(';', '').replace('}', '').trim()
    }

    const firstIcon = document.querySelector(`#${element.id} .elBulletList i`)
    if (firstIcon) {
      iconColor = firstIcon.style.color
    }

    const firstLink = document.querySelector(`#${element.id} .elBulletList a`)
    if (firstLink) {
      linkColor = firstLink.style.color
    }

    const output = app.blueprint('BulletList/V1', data.id, data.parentId, data.index, element)

    output.attrs = {
      style: {
        'margin-top': document.querySelector(`#${element.id}`).style.marginTop || 0,
        'margin-left': document.querySelector(`#${element.id}`).style.marginLeft || 0,
        'margin-right': document.querySelector(`#${element.id}`).style.marginRight || 0,
        'text-align': css['text-align'] || 'left',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
        'font-size': parseInt(css['font-size']) || 16,
      },
      className: themeClassName,
      params: {
        'font-size--unit': 'px',
      },
    }

    output.selectors = {
      '.elBulletList': {
        attrs: {
          'data-style-guide-content': 'm',
          style: {
            color: css['color'] || 'inherit',
            'text-align': css['text-align'] || 'left',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            position: css['position'] || 'relative',
            'z-index': parseInt(css['z-index']) || 0,
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          'style-guide-override-content': true,
          'font-size--unit': 'px',
        },
      },
      '.elBulletList b,\n.elBulletList strong': {
        attrs: {
          style: {
            color: boldColor,
          },
        },
      },
      '.elBulletList .fa,\n.elBulletList .fas,\n.elBulletList .fa-fw': {
        attrs: {
          style: {
            color: iconColor,
          },
        },
      },
      '.elBulletList .elTypographyLink': {
        attrs: {
          style: {
            color: linkColor,
          },
        },
      },
    }

    if (bulletSpacing !== null) {
      output.selectors['.elBulletList li:not(:first-child)'] = {
        params: {
          'margin-top--unit': 'px',
        },
        attrs: {
          style: {
            'margin-top': bulletSpacing,
          },
        },
      }
    }

    output.children = [
      {
        type: 'ContentEditableNode',
        attrs: {
          'data-align-selector': '.elBulletList',
        },
        id: mainId,
        version: 0,
        parentId: id,
        fractionalIndex: 'a0',
        children: children,
      },
    ]

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

    output.attrs.id = element.id

    return output
  },

  navigation: data => {
    const element = data.element
    const parentId = data.parentId
    const index = data.index
    const children = []

    for (let i = 0; i < element.content.items.length; i++) {
      const headlineJSON = app.headline(
        {
          element: {
            content: {
              text: data.element.content.items[i].content_text,
              html: data.element.content.items[i].content_html,
              json: data.element.content.items[i].json,
            },
            id: element.id,
            css: app.properties.css(element.id, `navigation_headline_${i + 1}`),
          },
          id: app.makeId(),
          index: i,
        },
        `navigation_headline_${i + 1}`
      )
      headlineJSON.attrs.style['margin-top'] = 0
      headlineJSON.selectors['.elHeadline'].attrs.style['font-weight'] = data.element.content.fontWeight

      children.push(headlineJSON)
    }

    const output = app.flex_container(children, parentId, index)
    output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
    output.attrs.style['flex-direction'] = 'row'
    output.attrs.style['justify-content'] = 'center'
    output.attrs.style['gap'] = 2.3

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
      output.attrs = Object.assign(
        output.attrs,
        app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
      )
    }

    output.attrs.id = element.id

    return output
  },

  pricing: data => {
    const element = data.element
    const parentId = data.parentId
    const index = data.index
    const flexParentId = app.makeId()
    const children = []
    const children_header = []

    children_header.push(
      app.headline(
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
      app.headline(
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
      app.headline(
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

    const header = app.flex_container(children_header, flexParentId, index)
    header.attrs.style['flex-direction'] = 'column'

    const headerContainer = document.querySelector(`#${element.id} .panel-heading`)
    const headerStyles = getComputedStyle(headerContainer)

    header.attrs.style['background-color'] =
      headerStyles.getPropertyValue('background-color') || 'transparent'
    header.params['--style-padding-horizontal'] = '15px'
    header.attrs.style['padding-top'] = '25px'
    header.attrs.style['padding-bottom'] = '25px'

    for (let i = 0; i < element.content.items.length; i++) {
      const lineItem = app.headline(
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

    const listItems = app.flex_container(children, flexParentId, index)
    listItems.attrs.style['flex-direction'] = 'column'

    const output = app.flex_container([header, listItems], parentId, index)

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
  },

  progress: data => {
    const element = data.element
    const output = app.blueprint('ProgressBar/V1', data.id, data.parentId, data.index, element)
    const cssParent = app.properties.css(element.id)
    const css = app.properties.css(element.id, 'progress')
    const cssBar = app.properties.css(element.id, 'progress-bar')
    const borderRadius = app.properties.borderRadius(css)
    const borderRadiusBar = app.properties.borderRadius(cssBar)
    let fontWeight = cssBar['font-weight']
    if (fontWeight === 'normal') {
      fontWeight = '400'
    } else if (fontWeight === 'bold') {
      fontWeight = '600'
    } else if (fontWeight === 'bolder') {
      fontWeight = '800'
    } else if (fontWeight === 'lighter') {
      fontWeight = '200'
    }

    const classic_themes = [
      'elButtonGradient',
      'elButtonBottomBorder',
      'elButtonSubtle',
      'progress-bar-striped',
      'progress-bar-striped_active',
    ]
    const classic_themes_css = {
      elButtonGradient: {
        css: `
  .replace-me .progress-bar { 
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2);
    border: 1px solid rgba(0,0,0,0.1);
  }`,
      },
      elButtonBottomBorder: {
        css: `
  .replace-me .progress-bar { border-bottom: 3px solid rgba(0,0,0,0.2); }
  `,
      },
      elButtonSubtle: {
        css: `
  .replace-me .progress-bar {
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
  }`,
      },
      'progress-bar-striped': {
        css: `
  .replace-me .progress-bar {
    background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
  }`,
      },
      'progress-bar-striped_active': {
        css: `
  .replace-me .progress-bar {
    background-image: linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    animation: progress-bar-stripes 2s linear infinite reverse;
  }
        
  @-webkit-keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
  
    to {
        background-position: 0 0
    }
  }
  
  @keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
  
    to {
        background-position: 0 0
    }
  }
      `,
      },
    }

    const domElement = document.querySelector(`#${element.id} .progress-bar`)

    classic_themes.forEach(theme => {
      if (domElement.classList.contains(theme)) {
        let css = classic_themes_css[theme].css
        css = css.replace(/\.replace-me/g, `#${element.id}`)
        app.generatedCSS += `\n\n/* CSS for Progress Bar */\n`
        app.generatedCSS += css
        app.recommendations.push({
          type: 'Progress Bar Theme',
          status: 'CSS',
          explainer: 'Custom CSS has been applied to the page to support the theme of this progress bar.',
        })
      }
    })

    output.selectors = {
      '.progress': {
        attrs: {
          'data-skip-shadow-settings': 'false',
          'data-skip-corners-settings': 'false',
          'data-skip-background-settings': 'false',
          style: {
            'margin-top': parseInt(cssParent['margin-top']) || 0,
          },
        },
        params: app.params(css, 'element', element.id),
      },
      '.progress-bar': {
        params: {
          '--style-background-color': cssBar['background-color'],
          'height--unit': 'px',
        },
        attrs: {
          style: {
            height: element.content.height,
            'padding-left': parseInt(cssBar['padding-left']) || 0,
          },
        },
      },
      '.progress-label': {
        attrs: {
          style: {
            'text-align': cssBar['text-align'],
            'font-size': cssBar['font-size'],
            'text-shadow': cssBar['text-shadow'],
            'font-weight': fontWeight,
          },
        },
      },
    }

    output.params = {
      'progress-text': element.content.label,
      show_text_outside: 'false',
      'width--unit': 'px',
      progress: element.content.percentage,
      'margin-top--unit': 'px',
    }

    output.attrs = {
      style: {
        width: element.content.width,
        'margin-top': parseInt(cssBar['margin-top']) || 0,
      },
    }

    output.selectors['.progress'].attrs.style = Object.assign(
      output.selectors['.progress'].attrs.style,
      borderRadius
    )

    output.selectors['.progress-bar'].attrs.style = Object.assign(
      output.selectors['.progress-bar'].attrs.style,
      borderRadiusBar
    )

    output.attrs.id = element.id

    return output
  },

  select: data => {
    const element = data.element
    const output = app.blueprint('SelectBox/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'select')
    let dataType = element.content.name
    let selectName = element.content.name
    let customType = element.content.custom_type
    let placeholder = null

    if (dataType === 'cfx_all_countries') {
      dataType = 'all_countries'
      selectName = 'country'
      placeholder = 'Select Country'
    } else if (dataType === 'cfx_states') {
      dataType = 'all_united_states'
      selectName = 'state'
      placeholder = 'Select State'
    } else if (dataType === 'cfx_canada') {
      dataType = 'all_canadian_provinces'
      selectName = 'state'
      placeholder = 'Select Province'
    } else {
      dataType = dataType.replace('cfx_', '')
    }

    output.attrs = {
      style: {
        'padding-top': 11,
        'padding-bottom': 11,
        'margin-left': '0px',
        width: element.content.width,
      },
    }

    const defaultOptionId = app.makeId()

    if (placeholder) {
      output.children = [
        {
          type: 'option',
          attrs: {
            value: 'DEFAULT',
          },
          id: defaultOptionId,
          version: 0,
          parentId: data.id,
          fractionalIndex: 'a0',
          children: [
            {
              type: 'text',
              innerText: placeholder,
              id: app.makeId(),
              version: 0,
              parentId: defaultOptionId,
              fractionalIndex: 'a0',
            },
          ],
        },
      ]
    } else {
      output.children = [
        {
          type: 'option',
          attrs: {
            value: '',
          },
          id: defaultOptionId,
          version: 0,
          parentId: data.id,
          fractionalIndex: 'a0',
          children: [
            {
              type: 'text',
              innerText: 'Select your option',
              id: app.makeId,
              version: 0,
              parentId: defaultOptionId,
              fractionalIndex: 'a0',
            },
          ],
        },
      ]

      element.content.items.forEach(item => {
        const optionId = app.makeId()
        output.children.push({
          type: 'option',
          attrs: {
            value: item.value,
          },
          id: optionId,
          version: 0,
          parentId: data.id,
          fractionalIndex: 'a1',
          children: [
            {
              type: 'text',
              innerText: item.text,
              id: app.makeId(),
              version: 0,
              parentId: optionId,
              fractionalIndex: 'a0',
            },
          ],
        })
      })
    }

    if (dataType === 'states_canada') {
      selectName = 'something'
      dataType = null
      customType = null
      output.children = []
      app.recommendations.push({
        type: 'Select',
        status: 'Not Supported',
        explainer: 'Select option for Canada & United States is not supported.',
      })
    }

    output.selectors = {
      '.elSelect': {
        attrs: {
          style: {
            'padding-top': '12px',
            'padding-bottom': '12px',
            'font-size': parseInt(css['font-size']) || 16,
          },
          className: element.content.required,
          name: selectName,
        },
      },
      '.elSelect, .elSelectLabel': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) || 16,
          },
          'data-skip-text-shadow-settings': 'false',
        },
      },
      '.elSelectWrapper': {
        attrs: {},
      },
    }

    if (customType) {
      output.selectors['.elSelect'].attrs['data-custom-type'] = customType
    }

    if (dataType) {
      output.selectors['.elSelectWrapper'].attrs['data-type'] = dataType
    }

    app.cssForInput(element.id, 'Select')
    output.attrs.id = element.id

    return output
  },

  shipping_block: data => {
    const element = data.element
    const id = data.id
    const parentId = data.parentId
    const index = data.index
    const css_headline = app.properties.css(element.id, 'shipping_headline')
    const css_input = app.properties.css(element.id, 'shipping_input')
    const children = []

    for (let i = 0; i < element.content.items.length; i++) {
      const headlineJSON = app.headline(
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
          inputJSON = app.select({
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
          inputJSON = app.input({
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

      const innerFlexContainer = app.flex_container([headlineJSON, inputJSON], id, i)
      innerFlexContainer.attrs.style['flex-direction'] = 'column'
      innerFlexContainer.attrs.style['gap'] = 0

      if (i !== 0) {
        innerFlexContainer.attrs.style['margin-top'] = 10
      }

      children.push(innerFlexContainer)
    }

    const output = app.flex_container(children, parentId, index)
    output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
    output.attrs.style['flex-direction'] = 'column'
    output.attrs.style['gap'] = 0.5

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs = Object.assign(
      output.attrs,
      app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )

    output.attrs.id = element.id

    return output
  },

  social_share: data => {
    const element = data.element
    const output = app.blueprint('CustomHtmlJs/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'embed')

    output.params = {
      originalCode: `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/social-likes/dist/social-likes_flat.css">
  <script src="https://cdn.jsdelivr.net/npm/social-likes/dist/social-likes.min.js"></script>
  <div class="social-likes" data-url="${element.content.url}" data-title="${element.content.title}">
    <div class="facebook" title="Share link on Facebook">Facebook</div>
    <div class="twitter" data-via="${element.content.via}" title="Share link on Twitter">Twitter</div>
  </div>
      `,
    }

    output.attrs = {
      style: {
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
    }

    app.recommendations.push({
      type: 'social_share',
      id: element.id,
      title: 'Social Share',
      message: 'The social share links have been converted to a Custom HTML/JS element.',
    })

    output.attrs.id = element.id

    return output
  },

  text_block: data => {
    const element = data.element
    const parentId = data.parentId
    const index = data.index
    const children = []

    for (let i = 0; i < element.content.items.length; i++) {
      const headlineJSON = app.headline(
        {
          element: {
            content: {
              text: data.element.content.items[i].content_text,
              html: data.element.content.items[i].content_html,
              json: data.element.content.items[i].json,
            },
            id: element.id,
            css: app.properties.css(
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

    const output = app.flex_container(children, parentId, index)
    output.attrs.style['margin-top'] = document.querySelector(`#${element.id}`).style.marginTop || 0
    output.attrs.style['flex-direction'] = 'column'
    output.attrs.style['gap'] = 0.2

    const mainContainer = document.querySelector(`#${element.id} .elTextblock`)
    const containerStyles = getComputedStyle(mainContainer)
    const borderRadius = app.properties.borderRadius(containerStyles)

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
      app.generatedCSS += `\n\n/* CSS for Text Block */\n`
      app.generatedCSS += `#${element.id}[data-page-element="FlexContainer/V1"] { 
    column-count: ${columnCount} !important;
    display: block !important;
  }`
    }

    if (element.content.visible) {
      output.attrs['data-show-only'] = element.content.visible
    }

    output.attrs = Object.assign(
      output.attrs,
      app.animations.attrs(document.querySelector(`[id="${element.id}"]`))
    )

    output.attrs.id = element.id

    return output
  },

  textarea: data => {
    const element = data.element
    const output = app.blueprint('TextArea/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'input')

    output.params = {
      label: element.content.placeholder,
      labelType: 'on-border',
      '--style-background-color': '#fff',
    }

    output.attrs = {
      type: element.content.name,
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
      },
    }

    output.selectors = {
      '.elTextarea': {
        attrs: {
          name: element.content.name,
          type: element.content.name,
          className: element.content.required,
          'data-custom-type': element.content.custom_type,
        },
      },
      '.inputHolder, .borderHolder': {
        attrs: {
          style: {
            'padding-top': '12px',
            'padding-bottom': '12px',
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          '--style-padding-horizontal': '12px',
          '--style-border-width': '1px',
          '--style-border-style': 'solid',
          '--style-border-color': 'rgba(0, 0, 0, 0.2)',
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper .labelText': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper.elFormItemWrapper.elInputFocused .labelText': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) - 3 || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper.hasValue .labelText': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) - 3 || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '.elInput::placeholder': {
        attrs: {
          style: {
            'font-size': parseInt(css['font-size']) || 16,
          },
        },
        params: {
          'font-size--unit': 'px',
        },
      },
      '&.elFormItemWrapper, .inputHolder, .borderHolder': {
        attrs: {
          'data-skip-corners-settings': 'false',
          style: {
            'border-radius': '4px',
          },
        },
      },
    }

    app.cssForInput(element.id, 'TextArea')
    output.attrs.id = element.id

    return output
  },

  video_popup: (data, type = 'video_popup') => {
    const element = data.element
    const output = app.blueprint('VideoPopup/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, type) || element.css
    const borderRadius = app.properties.borderRadius(css)

    output.params = {
      'padding-top--unit': 'px',
      'padding-bottom--unit': 'px',
      'padding-horizontal--unit': 'px',
      'padding-horizontal': parseInt(css['padding-left']) || 0,
      imageUrl: [
        {
          type: 'text',
          innerText: element.content.src,
        },
      ],
    }

    output.attrs = {
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-skip-background-settings': 'false',
    }

    output.selectors = {
      '.elVideoWrapper': {
        params: {
          video_url: element.content.video_url,
          '--style-background-color': 'rgba(0, 0, 0, 0.8)',
        },
        attrs: {
          'data-video-type': 'youtube',
          'data-skip-background-settings': 'true',
        },
      },
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
            filter: css['filter'] || 'none',
            'object-fit': 'fill',
            'object-position': 'center',
            'max-width': '100%',
            'vertical-align': 'bottom',
            'aspect-ratio': 'auto',
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            'box-sizing': 'border-box',
            position: css['position'] || 'relative',
            'padding-top': parseInt(css['padding-top']) || 0,
            'padding-bottom': parseInt(css['padding-bottom']) || 0,
            'padding-left': parseInt(css['padding-left']) || 0,
            'padding-right': parseInt(css['padding-right']) || 0,
            'background-color': css['background-color'],
            'z-index': parseInt(css['z-index']) || 0,
          },
        },
        params: app.params(app.properties.css(element.id, type), 'element', element.id),
      },
      '.elImageWrapper': {
        attrs: {
          style: {
            opacity: parseFloat(css['opacity']) || 1,
            'text-align': css['text-align'] || 'center',
          },
        },
      },
    }

    output.selectors['.elImage'].attrs.style = Object.assign(
      output.selectors['.elImage'].attrs.style,
      borderRadius
    )

    const radiusCSS = document.querySelector(`#${element.id} .ximg`)
    let radiusUnit = 'px'

    if (radiusCSS) {
      const radiusStyle = getComputedStyle(radiusCSS)
      const radiusValue = radiusStyle.borderRadius

      if (radiusCSS) {
        radiusUnit = radiusValue.match(/px|%/g)[0]
      }
    }

    output.params['border-radius--unit'] = radiusUnit
    output.attrs.style = Object.assign(output.attrs.style, borderRadius)

    output.attrs.id = element.id

    return output
  },

  video: data => {
    const element = data.element
    const output = app.blueprint('Video/V1', data.id, data.parentId, data.index, element)
    const css = app.properties.css(element.id, 'video')
    const borderRadius = app.properties.borderRadius(css)
    const theParams = app.params(css, 'element', element.id)

    theParams[`video_url`] = element.content.url || 'https://www.youtube.com/watch?v=Z7o9pbPHu0k'
    theParams[`video-${element.content.videoType}-autoplay`] = element.content.autoplay || '0'
    theParams[`video-${element.content.videoType}-controls`] = element.content.controls || '0'
    theParams[`video-${element.content.videoType}-unmute-label`] = element.content.unmuteLabel || ''
    theParams[`video-${element.content.videoType}-width--unit`] = 'px'
    theParams[`video-${element.content.videoType}-height--unit`] = 'px'
    theParams[`video-${element.content.videoType}-width`] = element.content.width
    theParams[`video-${element.content.videoType}-height`] = element.content.height
    theParams[`video-sticky-size`] = element.content.sticky.size || ''
    theParams[`video-sticky-position`] = element.content.sticky.position || ''
    theParams[`video-sticky-style`] = element.content.sticky.style || ''

    output.attrs = {
      'data-skip-background-settings': 'false',
      'data-skip-shadow-settings': 'false',
      'data-skip-corners-settings': 'false',
      style: {
        'margin-top': parseInt(element.css['margin-top']) || 0,
        'text-align': element.css['text-align'] || 'center',
        'padding-top': parseInt(css['padding-top']) || 0,
        'padding-bottom': parseInt(css['padding-bottom']) || 0,
        'padding-left': parseInt(css['padding-left']) || 0,
        'padding-right': parseInt(css['padding-right']) || 0,
        'background-color': css['background-color'],
        position: css['position'] || 'relative',
        'z-index': parseInt(css['z-index']) || 0,
      },
      'data-video-type': element.content.videoType || 'youtube',
      'data-video-title': element.content.title || '',
      'data-session-starter-text': element.content.starterText || '',
      'data-is-video-sticky': JSON.parse(element.content.sticky.enabled) || false,
      [`data-${element.content.videoType}-block-pause`]: JSON.parse(element.content.blockPause) || false,
      'data-sticky-closeable': element.content.sticky.closeable.toString(),
    }

    output.params = theParams

    output.selectors = {
      '.elVideoplaceholder_inner': {
        params: {
          '--style-background-image-url': element.content.bgImage,
        },
        attrs: {
          className: 'bgCoverCenter',
        },
      },
    }

    if (element.content.webm_url) {
      output.params[`video-webm-url`] = element.content.webm_url
    }

    output.attrs.style = Object.assign(output.attrs.style, borderRadius)

    output.attrs.id = element.id

    return output
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
