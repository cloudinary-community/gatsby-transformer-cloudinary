import * as React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

export default function BlogPostTemplate({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  const { title, heroImage, heroImageWithUnconformingShape } = frontmatter;
  return (
    <>
      <h2>{title}</h2>
      {heroImage?.gatsbyImageData ? (
        <GatsbyImage image={heroImage.gatsbyImageData} alt={heroImage.alt} />
      ) : (
        <div>
          No gatsby image for <code>heroImage</code>
        </div>
      )}
      {heroImageWithUnconformingShape?.gatsbyImageData ? (
        <GatsbyImage
          image={heroImageWithUnconformingShape.gatsbyImageData}
          alt={heroImageWithUnconformingShape.alt}
        />
      ) : (
        <div>
          No gatsby image for <code>heroImageWithUnconformingShape</code>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        title
        heroImage {
          gatsbyImageData(height: 200, backgroundColor: "#BADA55")
          alt
        }
        heroImageWithUnconformingShape {
          gatsbyImageData(height: 200, backgroundColor: "#BADA55")
          alt
        }
      }
    }
  }
`;
