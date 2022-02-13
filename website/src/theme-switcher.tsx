// Based on https://github.com/preactjs/wmr/blob/main/docs/public/components/theme-switcher.js
import type { SVGProps, ChangeEvent, ChangeEventHandler } from 'react'
import { useCallback, useLayoutEffect, useState } from 'react'

import Head from 'next/head'

import { useLocalStorage, useMedia } from 'react-use'
import { cx } from 'twind'

function ThemeItem({
  next,
  active,
  value,
  onChange,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>
  active: string
  next: string
  value: string
}) {
  const Icon = value == 'auto' ? ThemeAutoIcon : value == 'dark' ? ThemeDarkIcon : ThemeLightIcon

  return (
    <label
      className="cursor-pointer flex items-center justify-center h-full absolute top-0 left-0 w-full transition-[background] duration-300 [data-next=true]:z-50"
      data-next={next === value}
    >
      <Icon
        className="opacity-0 [data-active=true]:opacity-100 w-4 h-4"
        data-active={active === value}
        aria-hidden="true"
      />
      <input
        name="theme"
        type="radio"
        title={`${value} theme`}
        value={value}
        className="sr-only"
        onChange={onChange}
        checked={active === value}
      />
    </label>
  )
}

const THEMES = ['auto', 'dark', 'light']

export function ThemeSwitcher({ className }: { className?: string }) {
  const prefersDark = useMedia('(prefers-color-scheme:dark)', false)

  const [localTheme, setTheme] = useLocalStorage('theme', THEMES[0])
  const [firstRun, setFirstRun] = useState(true)

  const theme = (firstRun ? THEMES[0] : localTheme) as string
  const idx = THEMES.indexOf(theme)
  const next = THEMES[idx + 1] || THEMES[0]

  const toggleTheme = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTheme(e.target.value)
    },
    [setTheme],
  )

  if (!firstRun && typeof document != 'undefined') {
    document.documentElement.setAttribute(
      'theme',
      theme != 'auto' ? theme : prefersDark ? 'dark' : 'light',
    )
  }

  // First use SSR state — then switch to active theme
  if (typeof document != 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(
      () => {
        setFirstRun(false)
      },
      [
        /* run only once */
      ],
    )
  }

  return (
    <>
      <Head>
        {typeof document == 'undefined' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `try{let t=localStorage.theme;document.documentElement.setAttribute('theme',t&&t!='"auto"'?t:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}`,
            }}
          ></script>
        )}
      </Head>

      <div className={cx('~(relative h-full w-4)', className)}>
        <fieldset>
          <legend className="sr-only">Switch theme</legend>
          {THEMES.map((t) => (
            <ThemeItem key={t} value={t} onChange={toggleTheme} next={next} active={theme} />
          ))}
        </fieldset>
      </div>
    </>
  )
}

function ThemeAutoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M11 7l-3.2 9h1.9l.7-2h3.2l.7 2h1.9L13 7h-2zm-.15 5.65L12 9l1.15 3.65h-2.3zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48z" />
    </svg>
  )
}

function ThemeDarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
    </svg>
  )
}

function ThemeLightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
    </svg>
  )
}
