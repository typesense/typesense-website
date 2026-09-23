/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './content/**/*.md',
    './content/.vitepress/**/*.{js,ts,vue}',
  ],
  theme: {
    // Breakpoints ported 1:1 from palette.styl (desktop-first max-width queries
    // in the original; expressed here as min-width tokens where possible).
    screens: {
      'mobile-narrow': '420px', // $MQMobileNarrow 419px
      mobile: '720px', // $MQMobile 719px
      narrow: '960px', // $MQNarrow 959px
    },
    extend: {
      colors: {
        accent: {
          // Wired to the brand scale (defined in theme/style.css). Used mostly as
          // text (text-accent), so DEFAULT is the accessible step 11; `foreground`
          // is white for the rare dark-green `bg-accent` surfaces.
          DEFAULT: 'var(--brand-11-raw)',
          foreground: 'hsl(0 0% 100%)',
          hover: 'var(--brand-12-raw)',
          'hover-border': 'var(--brand-8-raw)',
          light: 'var(--brand-6-raw)',
          selected: 'var(--brand-5-raw)',
          secondary: 'var(--brand-9-raw)', // solid brand lime — fills only
        },
        // Neutral ink/line/surface scales. Backed by CSS vars (defined in
        // theme/style.css) so every `text-ink`/`border-line`/`bg-surface-*`
        // utility re-derives under `.dark`. Light values are the ported hex.
        ink: {
          DEFAULT: 'var(--ink)', // #313132 $textColor
          muted: 'var(--ink-muted)', // #6f6f71 lighten 25%
          light: 'var(--ink-light)', // #89898b lighten 35%
          lighter: 'var(--ink-lighter)', // #909092 lighten 38%
          lightest: 'var(--ink-lightest)', // #a2a2a4 lighten 45%
        },
        line: {
          DEFAULT: 'var(--line)', // #eee8ee $borderColor
          dark: 'var(--line-dark)', // #cfbecf darken 14%
        },
        surface: {
          gray: 'var(--surface-gray)', // #f7f7f7 $lightGrayColor
          'gray-hover': 'var(--surface-gray-hover)', // #ebebeb darken 5%
        },
        code: {
          bg: '#181218', // $codeBgColor
          inline: '#655267', // $inlineCodeColor
        },
        badge: {
          tip: '#42b983', // $badgeTipColor
          warning: '#b39500', // $badgeWarningColor
          error: '#DA5961', // $badgeErrorColor
        },
        'warning-bg': '#fef5dd', // lighten($badgeWarningColor, 70%)

        // shadcn-vue design tokens (HSL CSS variables, defined in theme/style.css).
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          '"Source Sans Pro"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
      },
      spacing: {
        navbar: '4rem', // $navbarHeight 64px
        sidebar: '20rem', // $sidebarWidth 320px
      },
      maxWidth: {
        content: '740px', // $contentWidth
        home: '960px', // $homePageWidth
      },
      boxShadow: {
        popover: '0 12px 28px rgba(49, 49, 50, 0.12)',
      },
    },
  },
  // We own all styling now; preflight is ON per the migration plan.
  corePlugins: {
    preflight: true,
  },
  plugins: [require('tailwindcss-animate')],
}
