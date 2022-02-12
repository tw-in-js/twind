import Layout from '@/template/layout'
import Head from 'next/head'
import Link from 'next/link'
import { animation, cx, keyframes } from 'twind'

import { start } from '$sitemap/docs'

const breeze = animation.breeze(
  '3000ms linear infinite normal forwards',
  keyframes.breeze`
    0% {
      transform: translate(154.652417px, 63.770002px) rotate(0deg);
      animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
    }

    23.333333% {
      transform: translate(154.652417px, 63.770002px) rotate(7.962948deg);
    }

    43.333333% {
      transform: translate(154.652417px, 63.770002px) rotate(4.164075deg);
      animation-timing-function: cubic-bezier(0, 0, 0.58, 1);
    }

    63.333333% {
      transform: translate(154.652417px, 63.770002px) rotate(12.610805deg);
    }

    73.333333% {
      transform: translate(154.652417px, 63.770002px) rotate(13.321761deg);
    }

    100% {
      transform: translate(154.652417px, 63.770002px) rotate(0.218094deg);
    }
  `,
)

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>twind.style</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
        <svg
          className={cx`mx-auto h-(24 md:40 lg:56)`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
        >
          <g transform="matrix(1 0 0 1 14.23241708500002 18.33000183000001)">
            <circle
              r="81.670000"
              transform="matrix(1 0 0 1 95.31000000000000 81.67000000000000)"
              fill="rgb(245,245,245)"
              stroke="none"
              strokeWidth="1"
            />
            <line
              x1="139.750000"
              y1="33.480000"
              x2="139.750000"
              y2="160.400000"
              fill="none"
              stroke="rgb(0,0,0)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
          <g className={breeze} transform="translate(154.652417,63.770002) rotate(0)">
            <g transform="translate(-140.420000,-45.440000)">
              <path
                d="M12.140000,107.090000L101.070000,55C101.070000,55,114.370000,64.740000,120.670000,80.140000C124.476366,89.667276,126.237774,99.888211,125.840000,110.140000L28.630000,144.730000C28.630000,144.730000,17.860000,136.800000,14.630000,129.300000C11.400000,121.800000,12.140000,107.090000,12.140000,107.090000Z"
                transform="matrix(1 0 0 1 -9.53198787967920 -17.65918638058027)"
                fill="rgb(128,203,196)"
                stroke="rgb(0,0,0)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <line
                x1="114.360000"
                y1="77.150000"
                x2="140.420000"
                y2="44.760000"
                fill="none"
                stroke="rgb(0,0,0)"
                strokeWidth="5"
              />
              <line
                x1="102.630000"
                y1="47.450000"
                x2="140.570000"
                y2="45.440000"
                fill="none"
                stroke="rgb(0,0,0)"
                strokeWidth="5"
              />
              <path
                d="M55.800000,134.930000L37,92.540000L51,84.250000L70.120000,129.510000Z"
                transform="matrix(1 0 0 1 -9.57000000000000 -18.17000000000000)"
                fill="rgb(238,153,156)"
                stroke="rgb(0,0,0)"
                strokeWidth="4"
              />
              <path
                d="M70.840000,129.930000L51,85.190000L65.800000,76.440000L86,124.210000Z"
                transform="matrix(1 0 0 1 -9.57000000000000 -18.17000000000000)"
                fill="rgb(238,153,156)"
                stroke="rgb(0,0,0)"
                strokeWidth="4"
              />
            </g>
          </g>
        </svg>

        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-11 via-accent-11 to-info-11">
            twind
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-info-11 via-accent-11 to-brand-11">
            .style
          </span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-accent-11">
          The smallest, fastest, most feature complete tailwind-in-js solution in existence
        </p>
        <div className="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
          <Link href={start}>
            <a
              className={cx`
                    text-brand-12 bg-brand-9
                    hover:(bg-brand-10)
                    focus:(outline-none ring-(2 brand-7 offset-(2 brand-3)))
                    font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto
                  `}
            >
              Get started
            </a>
          </Link>
          <button
            type="button"
            className={cx`
                  bg-neutral-3 text-neutral-11
                  hover:(bg-neutral-4 text-neutral-12)
                  ring-(1 neutral-7 hover:neutral-8)
                  focus:(outline-none ring-(2 brand-8))
                  shadow-sm rounded-lg
                  hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12
                `}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-none"
              aria-hidden="true"
            >
              <path d="m19 19-3.5-3.5"></path>
              <circle cx="11" cy="11" r="6"></circle>
            </svg>
            <span className="flex-auto">Quick search...</span>
            <kbd className="font-sans font-semibold">
              <abbr title="Command" className="no-underline">
                ⌘
              </abbr>{' '}
              K
            </kbd>
          </button>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <dt className="mt-5 text-lg leading-6 font-medium text-brand-12">
                <span aria-hidden="true">⚡️ </span>No build step
              </dt>
              <dd className="mt-2 text-base">
                Get all the benefits of Tailwind without the need for PostCSS, configuration,
                purging, or autoprefixing.
              </dd>
            </div>

            <div>
              <dt className="mt-5 text-lg leading-6 font-medium text-brand-12">
                <span aria-hidden="true">🚀 </span>Framework agnostic
              </dt>
              <dd className="mt-2 text-base">
                If your app uses HTML and JavaScript, it should work with Twind. This goes for
                server-rendered apps too.
              </dd>
            </div>

            <div>
              <dt className="mt-5 text-lg leading-6 font-medium text-brand-12">
                <span aria-hidden="true">😎 </span>One low fixed cost
              </dt>
              <dd className="mt-2 text-base">
                Twind ships the compiler, not the CSS. This means unlimited styles and variants for
                one low fixed cost of ~4.5kB.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </Layout>
  )
}

export function getStaticProps() {
  return {
    props: {},
  }
}
