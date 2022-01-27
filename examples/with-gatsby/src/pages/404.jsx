import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import abductionIllustration from '../images/abduction-illustration.svg'

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <div>
        <img
          alt="Ghost getting abducted by aliens"
          className="block mx-auto w-1/2"
          src={abductionIllustration}
        />
        <h2 className="bg-yellow-400 text-2xl font-bold inline-block my-8 p-3">
          Looks like this page is a ghost that got abducted by aliens...
        </h2>
      </div>
    </Layout>
  )
}

export default NotFoundPage
