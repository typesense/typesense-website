/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './content/**/*.md',
    './content/.vitepress/**/*.{js,ts,vue}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    // Breakpoints ported 1:1 from palette.styl (desktop-first max-width queries
    // in the original; expressed here as min-width tokens where possible).
    screens: {
      'mobile-narrow': '420px', // $MQMobileNarrow 419px
      mobile: '720px', // $MQMobile 719px
      narrow: '960px', // $MQNarrow 959px
      wide: '1280px', // vitepress's desktop breakpoint, where the nav bar gets its extras
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
        // Neutral ink/line/surface scales, wired to the gray scale (defined in
        // theme/style.css) so every `text-ink`/`border-line`/`bg-surface-*`
        // utility re-derives under `.dark`.
        ink: {
          DEFAULT: 'var(--gray-12)',
          muted: 'var(--gray-11)',
          light: 'var(--gray-10)',
          lighter: 'var(--gray-9)',
          lightest: 'var(--gray-8)',
        },
        line: {
          DEFAULT: 'var(--gray-5)',
          dark: 'var(--gray-7)',
        },
        surface: {
          gray: 'var(--gray-3)',
          'gray-hover': 'var(--gray-4)',
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
      transitionTimingFunction: {
        // ease-out-expo. fast start, long settle, no overshoot
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'anchor-underline': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '45%, 55%': { clipPath: 'inset(0)' },
          '100%': { clipPath: 'inset(0 0 0 100%)' },
        },
        'anchor-underline-fade': {
          '0%, 100%': { opacity: '0' },
          '15%, 70%': { opacity: '1' },
        },
      },
      animation: {
        'anchor-underline': 'anchor-underline 1.3s ease-in-out forwards',
        'anchor-underline-fade': 'anchor-underline-fade 1.3s ease forwards',
      },
    },
  },
  // We own all styling now; preflight is ON per the migration plan.
  corePlugins: {
    preflight: true,
    // its `.container` also matches vitepress's doc column and caps it at the
    // `narrow` screen (960px), squeezing the content against the outline
    container: false,
  },
  plugins: [require('tailwindcss-animate')],
}
