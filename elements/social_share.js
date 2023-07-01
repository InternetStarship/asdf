const social_share = data => {
  const element = data.element
  const output = blueprint('CustomHtmlJs/V1', data.id, data.parentId, data.index, element)
  const css = properties.css(element.id, 'embed')

  // Note: this requires children to work right away. However, since there can be
  // any content we should render this in cf2 editor some how.....
  // Note: the code is generated for the FB comments in `clickfunnels-classic.js`
  // where: if (dom.getAttribute('data-de-type') === 'fbcomments')
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

  return output
}
