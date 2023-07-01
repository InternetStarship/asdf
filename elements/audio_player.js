const audio_player = (data, type = 'audio_player') => {
  const element = data.element
  const output = blueprint('Audio/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, type) || element.css
  const borderRadius = properties.borderRadius(css)

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
    css = css.replace(/\.elAudioSkin\d+/g, `.id-${data.id}`)
    app.copiedCSS += `\n\n/* CSS for Audio Player */\n`
    app.copiedCSS += css
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

  output.params = Object.assign(output.params, params(css, 'element', element.id))
  output.params['--style-background-color'] = css['background-color']

  if (element.content.visible) {
    output.attrs['data-show-only'] = element.content.visible
  }

  output.attrs = Object.assign(output.attrs, animations.attrs(document.querySelector(`[id="${element.id}"]`)))

  output.params = Object.assign(
    output.params,
    animations.params(document.querySelector(`[id="${element.id}"]`))
  )

  return output
}
