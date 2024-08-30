import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';

const CnamePage = () => {
  const data = useStaticQuery(graphql`
    query {
      allSecureDistribution {
        nodes {
          gatsbyImageData(height: 300)
        }
      }
      allCname {
        nodes {
          gatsbyImageData(height: 300)
        }
      }
      allPrivateCdn {
        nodes {
          gatsbyImageData(height: 300)
        }
      }
      allPrivateCdnUnsecure {
        nodes {
          gatsbyImageData(height: 300)
        }
      }
      override1: allSecureDistribution {
        nodes {
          gatsbyImageData(height: 300, secure: false, cname: "example.com")
        }
      }
      override2: allPrivateCdnUnsecure {
        nodes {
          gatsbyImageData(height: 300, secure: true, privateCdn: true)
        }
      }
    }
  `);

  return (
    <>
      {data.allSecureDistribution.nodes.map((node) => {
        const gatsbyImage = getImage(node.gatsbyImageData);
        const src = gatsbyImage.images.fallback.src;

        return (
          <>
            <h2>
              {src.startsWith('https://example.com') ? '✅' : '❌'}
              {' Secure distribution'}
            </h2>

            <p>
              Expect url to start with <code>https://example.com</code>.
              Configued in config, not graphql query.
            </p>
            <pre>{src}</pre>
          </>
        );
      })}

      {data.allCname.nodes.map((node) => {
        const gatsbyImage = getImage(node.gatsbyImageData);
        const src = gatsbyImage.images.fallback.src;

        return (
          <>
            <h2>
              {src.startsWith('http://example.com') ? '✅' : '❌'}
              {' Cname'}
            </h2>

            <p>
              Expect url to start with <code>http://example.com</code>
            </p>
            <pre>{src}</pre>
          </>
        );
      })}

      {data.allPrivateCdn.nodes.map((node) => {
        const gatsbyImage = getImage(node.gatsbyImageData);
        const src = gatsbyImage.images.fallback.src;

        return (
          <>
            <h2>
              {src.startsWith('https://lilly-labs-consulting') ? '✅' : '❌'}
              {' Private CDN (Secure)'}
            </h2>

            <p>
              Expect urls to start with{' '}
              <code>https://lilly-labs-consulting</code>
            </p>
            <pre>{src}</pre>
          </>
        );
      })}

      {data.allPrivateCdnUnsecure.nodes.map((node) => {
        const gatsbyImage = getImage(node.gatsbyImageData);
        const src = gatsbyImage.images.fallback.src;

        return (
          <>
            <h2>
              {src.startsWith('http://lilly-labs-consulting') ? '✅' : '❌'}
              {' Private CDN (UnSecure)'}
            </h2>

            <p>
              Expect urls to start with{' '}
              <code>http://lilly-labs-consulting</code>
            </p>
            <pre>{src}</pre>
          </>
        );
      })}

      {data.override1.nodes.map((node) => {
        const gatsbyImage = getImage(node.gatsbyImageData);
        const src = gatsbyImage.images.fallback.src;

        return (
          <>
            <h2>
              {src.startsWith('http://example.com') ? '✅' : '❌'}
              {' Override Secure Distribution'}
            </h2>

            <p>
              Expect url to start with <code>http://example.com</code> by
              overriding the configured plugin options in graphql.
            </p>
            <pre>{src}</pre>
          </>
        );
      })}

      {data.override2.nodes.map((node) => {
        const gatsbyImage = getImage(node.gatsbyImageData);
        const src = gatsbyImage.images.fallback.src;

        return (
          <>
            <h2>
              {src.startsWith('https://lilly-labs-consulting') ? '✅' : '❌'}
              {' Override Private CDN (UnSecure)'}
            </h2>

            <p>
              Expect urls to start with{' '}
              <code>https://lilly-labs-consulting</code>
            </p>
            <pre>{src}</pre>
          </>
        );
      })}
    </>
  );
};

export default CnamePage;
