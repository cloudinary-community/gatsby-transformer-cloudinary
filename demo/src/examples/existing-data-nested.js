import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const ExistingDataNested = ({ variant = 'full' }) => {
  const data = useStaticQuery(graphql`
    query {
      article(name: { eq: "Article One" }) {
        feature {
          image {
            gatsbyImageData(
              width: 300
              height: 300
              layout: FIXED
              transformations: ["c_fill"]
              placeholder: TRACED_SVG
            )
          }
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      article(name: { eq: "Article One" }) {
        feature {
          image {
            gatsbyImageData(
              width: 300
              height: 300
              layout: FIXED
              transformations: ["c_fill"]
              placeholder: TRACED_SVG
            )
          }
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  const nodeData = JSON.stringify(
    {
      feature: {
        image: {
          cloudName: 'lilly-labs-consulting',
          publicId: 'sample',
        },
      },
    },
    null,
    2
  );

  const config = JSON.stringify(
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        transformTypes: ['ArticleFeatureImage'],
      },
    },
    null,
    2
  );

  return (
    <div className="image-example">
      <h2>Existing Data with nested data</h2>

      <GatsbyImage
        image={data.article.feature.image.gatsbyImageData}
        alt="default sample image"
      />

      <h3>Query</h3>
      <pre>{query}</pre>

      {variant === 'full' && (
        <>
          <h3>
            <code>Article</code> Node Shape
          </h3>
          <pre>{nodeData}</pre>
          <h3>Config</h3>
          <pre>{config}</pre>
        </>
      )}
    </div>
  );
};

export default ExistingDataNested;
