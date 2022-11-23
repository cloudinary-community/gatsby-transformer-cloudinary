import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const UploadedSilly = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "joppe-spaa-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: TRACED_SVG
            transformations: ["e_blackwhite"]
            chained: [
              "e_vectorize:colors:2:despeckle:20,e_tint:100:tomato:0p:white:100p"
              "l_gatsby-cloudinary:sergey-semin-unsplash,w_0.2,g_south"
            ]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "joppe-spaa-unsplash" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: TRACED_SVG
            transformations: ["e_blackwhite"]
            chained: [
              "e_vectorize:colors:2:despeckle:20,e_tint:100:tomato:0p:white:100p"
              "l_gatsby-cloudinary:sergey-semin-unsplash,w_0.2,g_south"
            ]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Or you can get plain silly</h2>

      <GatsbyImage
        image={data.image.cloudinary.gatsbyImageData}
        alt="Pirate Cat photo by Joppe Spaa from Unsplash."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default UploadedSilly;
