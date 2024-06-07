import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';

const CnamePage = () => {
  const data = useStaticQuery(graphql`
    query {
      cname: allProject {
        nodes {
          name
          coverImage {
            gatsbyImageData(
              height: 300
              aspectRatio: 2
              placeholder: TRACED_SVG
              transformations: ["c_fill", "g_auto:subject", "q_auto"]
              cname: "example.com"
              secure: false
            )
          }
        }
      }
      secureDistribution: allProject {
        nodes {
          name
          coverImage {
            gatsbyImageData(
              height: 300
              aspectRatio: 2
              placeholder: TRACED_SVG
              transformations: ["c_fill", "g_auto:subject", "q_auto"]
              secureDistribution: "example.com"
              secure: true
            )
          }
        }
      }
      privateCDNSecure: allProject {
        nodes {
          name
          coverImage {
            gatsbyImageData(
              height: 300
              aspectRatio: 2
              placeholder: TRACED_SVG
              transformations: ["c_fill", "g_auto:subject", "q_auto"]
              privateCdn: true
              secure: true
            )
          }
        }
      }
      privateCDNUnSecure: allProject {
        nodes {
          name
          coverImage {
            gatsbyImageData(
              height: 300
              aspectRatio: 2
              placeholder: TRACED_SVG
              transformations: ["c_fill", "g_auto:subject", "q_auto"]
              privateCdn: true
              secure: false
            )
          }
        }
      }
    }
  `);

  return (
    <>
      <h2>Secure distribution</h2>
      <p>
        Expect url to start with <code>https://example.com</code>
      </p>
      {data.secureDistribution.nodes.map((node) => {
        const gatsbyImage = getImage(node.coverImage?.gatsbyImageData);

        return (
          <>
            <h2>{node.name}</h2>
            <pre>{gatsbyImage.images.fallback.src}</pre>
          </>
        );
      })}

      <h2>CNAME</h2>
      <p>
        Expect urls to start with <code>http://example.com</code>
      </p>
      {data.cname.nodes.map((node) => {
        const gatsbyImage = getImage(node.coverImage?.gatsbyImageData);

        return (
          <>
            <h2>{node.name}</h2>
            <pre>{gatsbyImage.images.fallback.src}</pre>
          </>
        );
      })}

      <h2>Private CDN (Secure)</h2>
      <p>
        Expect urls to start with the cloudinary subdomain (https version), not{' '}
        <code>https://res.cloudinary.com</code>
      </p>

      {data.privateCDNSecure.nodes.map((node) => {
        const gatsbyImage = getImage(node.coverImage?.gatsbyImageData);

        return (
          <>
            <h2>{node.name}</h2>
            <pre>{gatsbyImage.images.fallback.src}</pre>
          </>
        );
      })}

      <h2>Private CDN (UnSecure)</h2>
      <p>
        Expect urls to start with the cloudinary subdomain (http version), not{' '}
        <code>http://res.cloudinary.com</code>
      </p>

      {data.privateCDNUnSecure.nodes.map((node) => {
        const gatsbyImage = getImage(node.coverImage?.gatsbyImageData);

        return (
          <>
            <h2>{node.name}</h2>
            <pre>{gatsbyImage.images.fallback.src}</pre>
          </>
        );
      })}
    </>
  );
};

export default CnamePage;
