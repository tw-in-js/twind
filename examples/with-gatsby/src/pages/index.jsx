import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import catAndHumanIllustration from '../images/cat-and-human-illustration.svg'

function IndexPage() {
  return (
    <Layout>
      <SEO keywords={[`gatsby`, `twind`, `tailwind`, `react`, `tailwindcss`]} title="Home" />

      <section className="text-center">
        <img
          alt="Cat and human sitting on a couch"
          className="block w-1/2 mx-auto mb-8"
          src={catAndHumanIllustration}
        />

        <h2 className="inline-block p-3 mb-4 text-2xl font-bold bg-yellow-400">
          Hey there! Welcome to your first Gatsby site.
        </h2>

        <p className="leading-loose">
          This is a barebones starter for Gatsby styled using{` `}
          <a
            className="font-bold text-gray-900 no-underline"
            href="https://twind.style"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Twind
          </a>
          , a utility-first CSS framework.
        </p>
      </section>
    </Layout>
  )
}

export default IndexPage
