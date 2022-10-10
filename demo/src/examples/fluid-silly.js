import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const FluidSilly = () => {
  const data = useStaticQuery(graphql`
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            transformations: ["e_blackwhite"]
            chained: [
              "e_vectorize:colors:2:despeckle:20,e_tint:100:tomato:0p:white:100p"
              "l_beard_png,w_0.77,fl_relative,g_face,a_-5,y_0.06"
            ]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      image: file(name: { eq: "marisa" }) {
        cloudinary: childCloudinaryAsset {
          gatsbyImageData(
            layout: CONSTRAINED
            transformations: ["e_blackwhite"]
            chained: [
              "e_vectorize:colors:2:despeckle:20,e_tint:100:tomato:0p:white:100p"
              "l_beard_png,w_0.77,fl_relative,g_face,a_-5,y_0.06"
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
        alt="Marisa Morby standing in a rose garden."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default FluidSilly;
