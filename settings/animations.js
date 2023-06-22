const animations = {
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
}
