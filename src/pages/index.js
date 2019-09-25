import React from 'react';
import Layout from '../components/layout';
import FluidDefault from '../examples/fluid-default';
import FixedThumb from '../examples/fixed-thumb';
import GifDefault from '../examples/gif-default';
import FluidSilly from '../examples/fluid-silly';

const IndexPage = () => (
  <Layout>
    <h1>Cloudinary + Gatsby for Painless Image Handling</h1>
    <p>
      <a href="https://cloudinary.com">Cloudinary</a> is really good at managing
      assets. <a href="https://gatsbyjs.org">Gatsby</a> is really good at
      delivering high-performance web pages using (among other things){' '}
      <a href="https://www.gatsbyjs.org/packages/gatsby-image/">
        <code>gatsby-image</code>
      </a>
      .
    </p>
    <p>
      Put ’em together and they’re like peanut butter and jelly. Peas and
      carrots. Chocolate and everything.
    </p>
    <p>
      Your workflow stays the same: add images to your site, have{' '}
      <code>gatsby-source-filesystem</code> read them, and query for them to use
      them in your components.
    </p>
    <p>
      Under the hood, your images will be uploaded to Cloudinary and added back
      to Gatsby’s data layer. No more dealing with Sharp issues! No more waiting
      for hundreds of images to be generated on your local machine! Just sweet,
      sweet, high-performance images with a{' '}
      <a href="https://cloudinary.com/documentation/image_transformation_reference">
        powerful image transformation API
      </a>{' '}
      at your fingertips.
    </p>
    <div className="examples">
      <FluidDefault />
      <FixedThumb />
      <GifDefault />
      <FluidSilly />
    </div>
    <h2>Installation</h2>
    <p>See the README for more details about getting started.</p>
  </Layout>
);

export default IndexPage;
