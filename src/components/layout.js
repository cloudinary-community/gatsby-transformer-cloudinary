/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Header from './header';
import './layout.css';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main>
        <div className="content">{children}</div>
      </main>
      <footer>
        © {new Date().getFullYear()} · built by{' '}
        <a href="https://lengstorf.com">Jason Lengstorf</a> ·{' '}
        <a href="https://www.learnwithjason.dev/build-a-gatsby-transformer-plugin-for-cloudinary">
          watch part of this plugin get built live
        </a>
      </footer>
    </>
  );
};

export default Layout;
