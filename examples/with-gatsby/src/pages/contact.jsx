import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

function ContactPage() {
  return (
    <Layout>
      <SEO keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]} title="Contact" />
      <section>
        <form>
          <h2 className="mb-8 leading-loose">
            Here is an example of a form built using the official Tailwind CSS Forms plugin.{` `}
            <a
              className="font-bold text-gray-700 no-underline"
              href="https://github.com/tailwindlabs/tailwindcss-forms"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Read the docs
            </a>
            .
          </h2>

          <label className="block mb-2 text-xs font-bold uppercase" htmlFor="first-name">
            First Name
          </label>

          <input
            className="w-full mb-6 rounded-md border-gray-800"
            id="first-name"
            placeholder="Bill"
            type="text"
          />

          <label className="block mb-2 text-xs font-bold uppercase" htmlFor="last-name">
            Last Name
          </label>

          <input
            className="w-full mb-6 rounded-md border-gray-800"
            id="last-name"
            placeholder="Murray"
            type="text"
          />

          <label className="block mb-2 text-xs font-bold uppercase" htmlFor="message">
            Message
          </label>

          <textarea
            className="w-full mb-6 rounded-md border-gray-800"
            id="message"
            placeholder="Say something..."
            rows="8"
          />

          <button className="px-4 py-2 text-sm font-bold text-white bg-gray-700 border-b-4 border-gray-800 rounded hover:border-gray-700 hover:bg-gray-600">
            Submit
          </button>
        </form>
      </section>
    </Layout>
  )
}

export default ContactPage
