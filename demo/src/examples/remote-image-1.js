import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const RemoteImage1 = () => {
  const data = useStaticQuery(graphql`
    query {
      project(name: { eq: "Project Example One" }) {
        coverImage {
          gatsbyImageData(
            layout: FIXED
            height: 300
            aspectRatio: 1
            placeholder: TRACED_SVG
            transformations: ["c_crop", "e_pixelate_faces"]
          )
        }
      }
    }
  `);

  // Duplicate the query so we can display it on the page.
  const query = `
    query {
      project(name: { eq: "Project Example One" }) {
        coverImage {
          gatsbyImageData(
            layout: FIXED
            height: 300
            aspectRatio: 1
            placeholder: TRACED_SVG
            transformations: ["c_crop", "e_pixelate_faces"]
          )
        }
      }
    }
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Remote image</h2>

      <GatsbyImage
        image={data.project.coverImage.gatsbyImageData}
        alt="Drone photo of a Pirate ship with a US flag by Austin Neill from Unsplash."
      />

      <h3>Query</h3>
      <pre>{query}</pre>
    </div>
  );
};

export default RemoteImage1;
