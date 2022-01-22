import { graphql, useStaticQuery, Link } from 'gatsby'
import React, { useState } from 'react'

function Header() {
  const [isExpanded, toggleExpansion] = useState(false)
  const { site } = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  // <style>
  // #esrszalajy65_tr {
  //   animation: esrszalajy65_tr__tr 3000ms linear infinite normal forwards
  // }

  // @keyframes esrszalajy65_tr__tr {
  //   0% {
  //     transform: translate(154.652417px, 63.770002px) rotate(0deg);
  //     animation-timing-function: cubic-bezier(0.420000, 0, 1, 1)
  //   }

  //   23.333333% {
  //     transform: translate(154.652417px, 63.770002px) rotate(7.962948deg)
  //   }

  //   43.333333% {
  //     transform: translate(154.652417px, 63.770002px) rotate(4.164075deg);
  //     animation-timing-function: cubic-bezier(0, 0, 0.580000, 1)
  //   }

  //   63.333333% {
  //     transform: translate(154.652417px, 63.770002px) rotate(12.610805deg)
  //   }

  //   73.333333% {
  //     transform: translate(154.652417px, 63.770002px) rotate(13.321761deg)
  //   }

  //   100% {
  //     transform: translate(154.652417px, 63.770002px) rotate(0.218094deg)
  //   }
  // }
  // </style>

  return (
    <header className="bg-green-700">
      <div className="flex flex-wrap items-center justify-between max-w-4xl p-4 mx-auto md:p-8">
        <Link to="/">
          <h1 className="flex items-center text-white no-underline">
            <svg
              id="esrszalajy61"
              className="w-8 h-8 mr-2 fill-current"
              height="54"
              width="54"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
            >
              <g id="esrszalajy62" transform="matrix(1 0 0 1 14.23241708500002 18.33000183000001)">
                <circle
                  id="esrszalajy63"
                  r="81.670000"
                  transform="matrix(1 0 0 1 95.31000000000000 81.67000000000000)"
                  fill="rgb(245,245,245)"
                  stroke="none"
                  strokeWidth="1"
                />
                <line
                  id="esrszalajy64"
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
              <g id="esrszalajy65_tr" transform="translate(154.652417,63.770002) rotate(0)">
                <g id="esrszalajy65" transform="translate(-140.420000,-45.440000)">
                  <path
                    id="esrszalajy66"
                    d="M12.140000,107.090000L101.070000,55C101.070000,55,114.370000,64.740000,120.670000,80.140000C124.476366,89.667276,126.237774,99.888211,125.840000,110.140000L28.630000,144.730000C28.630000,144.730000,17.860000,136.800000,14.630000,129.300000C11.400000,121.800000,12.140000,107.090000,12.140000,107.090000Z"
                    transform="matrix(1 0 0 1 -9.53198787967920 -17.65918638058027)"
                    fill="rgb(128,203,196)"
                    stroke="rgb(0,0,0)"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                  <line
                    id="esrszalajy67"
                    x1="114.360000"
                    y1="77.150000"
                    x2="140.420000"
                    y2="44.760000"
                    fill="none"
                    stroke="rgb(0,0,0)"
                    strokeWidth="5"
                  />
                  <line
                    id="esrszalajy68"
                    x1="102.630000"
                    y1="47.450000"
                    x2="140.570000"
                    y2="45.440000"
                    fill="none"
                    stroke="rgb(0,0,0)"
                    strokeWidth="5"
                  />
                  <path
                    id="esrszalajy69"
                    d="M55.800000,134.930000L37,92.540000L51,84.250000L70.120000,129.510000Z"
                    transform="matrix(1 0 0 1 -9.57000000000000 -18.17000000000000)"
                    fill="rgb(238,153,156)"
                    stroke="rgb(0,0,0)"
                    strokeWidth="4"
                  />
                  <path
                    id="esrszalajy610"
                    d="M70.840000,129.930000L51,85.190000L65.800000,76.440000L86,124.210000Z"
                    transform="matrix(1 0 0 1 -9.57000000000000 -18.17000000000000)"
                    fill="rgb(238,153,156)"
                    stroke="rgb(0,0,0)"
                    strokeWidth="4"
                  />
                </g>
              </g>
            </svg>
            <span className="text-xl font-bold tracking-tight">{site.siteMetadata.title}</span>
          </h1>
        </Link>

        <button
          className="items-center block px-3 py-2 text-white border border-white rounded md:hidden"
          onClick={() => toggleExpansion(!isExpanded)}
        >
          <svg
            className="w-3 h-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>

        <nav
          className={`${isExpanded ? `block` : `hidden`} md:block md:items-center w-full md:w-auto`}
        >
          {[
            {
              route: `/about`,
              title: `About`,
            },
            {
              route: `/contact`,
              title: `Contact`,
            },
          ].map((link) => (
            <Link
              className="block mt-4 text-white no-underline md:inline-block md:mt-0 md:ml-6"
              key={link.title}
              to={link.route}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
