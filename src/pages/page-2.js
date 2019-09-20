import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

export const query = graphql`
  {
    file(name: { eq: "jason-astronaut" }) {
      image: childCloudinaryAsset {
        sizes
        src @transform(value: "e_grayscale")
        srcSet
        id
        base64
        aspectRatio
      }
    }
  }
`

const SecondPage = ({ data }) => (
  <Layout>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <Image fluid={data.file.image} alt="Jason the astronaut." />
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
