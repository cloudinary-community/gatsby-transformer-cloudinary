import React from "react"
import { Link } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import Placeholder from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>

    <h2>Using Sharp</h2>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Placeholder />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
