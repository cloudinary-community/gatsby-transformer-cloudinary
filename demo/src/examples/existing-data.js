import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const ExistingData = ({ variant = 'full' }) => {
  const data = useStaticQuery(graphql`
    query {
      blogPost(name: { eq: "Blog Post One" }) {
        heroImage {
          gatsbyImageData(
            height: 300
            layout: FIXED
            transformations: ["e_grayscale"]
            placeholder: BLURRED
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      blogPost(name: { eq: "Blog Post One" }) {
        heroImage {
          gatsbyImageData(
            height: 300
            layout: FIXED
            transformations: ["e_grayscale"]
            placeholder: BLURRED
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  const nodeData = JSON.stringify(
    {
      heroImage: {
        cloudName: 'lilly-labs-consulting',
        publicId: 'sample',
      },
    },
    null,
    2
  );

  const config = JSON.stringify(
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        transformTypes: ['BlogPostHeroImage'],
      },
    },
    null,
    2
  );

  return (
    <div className="image-example">
      <h2>Existing Data</h2>

      <GatsbyImage
        image={data.blogPost.heroImage.gatsbyImageData}
        alt="default sample image"
      />

      <h3>Query</h3>
      <pre>{query}</pre>
      {variant === 'full' && (
        <>
          <h3>
            <code>BlogPost</code> Node Shape
          </h3>
          <pre>{nodeData}</pre>
          <h3>Config</h3>
          <pre>{config}</pre>
        </>
      )}
    </div>
  );
};

export default ExistingData;
