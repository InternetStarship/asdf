/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */
const countdown = data => {
  let pageDocument = document
  if (app.iframeId) {
    pageDocument = document.querySelector(`iframe#${app.iframeId}`).contentDocument
  }

  const element = data.element
  const id = data.id
  const parentId = data.parentId
  const index = data.index
  const output = {
    type: 'Countdown/V1',
    id: id,
    version: 0,
    parentId: parentId,
    fractionalIndex: `a${index}`,
    params: {
      type: 'countdown',
      countdown_opts: {
        show_years: false,
        show_months: false,
        show_weeks: false,
        show_days: false,
        show_hours: true,
        show_minutes: true,
        show_seconds: true,
      },
      evergreen_props: {
        time_resets: 'monthly',
        reset_day: 1,
        reset_time: '00:00:00',
        reset_time_hours: 0,
        reset_time_minutes: 0,
        reset_time_seconds: 0,
        timezone: 'America/New_York',
      },
      show_colons: true,
      timezone: 'America/New_York',
      timer_action: 'showhide',
      cookie_policy: 'none',
      expire_days: 0,
      end_date: '2022-12-18',
      countdown_id: '6Z-6O4GA-25',
    },
    selectors: {
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
    },
    attrs: {
      style: {
        'padding-top': 15,
        'padding-bottom': 12,
        'border-radius': '4px',
      },
      'data-skip-shadow-settings': 'false',
      'data-skip-corners-settings': 'false',
    },
  }
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
