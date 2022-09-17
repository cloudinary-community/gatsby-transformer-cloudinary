import { Link } from 'gatsby';
import React from 'react';

const Header = ({ siteTitle }) => (
  <header>
    <Link
      to="/"
      style={{
        color: 'white',
        textDecoration: 'none',
      }}
    >
      {siteTitle}
    </Link>
    <nav>
      <Link to="/fluid/" activeClassName="active">
        Fluid
      </Link>
      <Link to="/fixed/" activeClassName="active">
        Fixed
      </Link>
      <Link to="/gifs/" activeClassName="active">
        GIFs
      </Link>
      <Link to="/existing/" activeClassName="active">
        Existing
      </Link>
      <Link to="/remote/" activeClassName="active">
        Remote
      </Link>
      <a href="https://www.npmjs.com/package/gatsby-transformer-cloudinary#install">
        Install
      </a>
      <a href="https://github.com/cloudinary-devs/gatsby-transformer-cloudinary">
        Source Code
      </a>
    </nav>
  </header>
);

export default Header;
