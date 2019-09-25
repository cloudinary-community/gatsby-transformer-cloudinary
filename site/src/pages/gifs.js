import React from 'react';
import Layout from '../components/layout';
import GifDefault from '../examples/gif-default';
import GifTransformed from '../examples/gif-transformed';

const IndexPage = () => (
  <Layout>
    <h1>Animated GIFs and gatsby-image?!</h1>
    <p>
      Cloudinary can handle GIFs, so we can use ’em with this transformer. No
      special rules apply; just add a GIF like you would any other image.
    </p>
    <div className="examples">
      <GifDefault />
      <GifTransformed />
    </div>
  </Layout>
);

export default IndexPage;
