import React from 'react';
import Layout from '../components/layout';
import FluidDefault from '../examples/fluid-default';
import FluidTransformed from '../examples/fluid-transformed';
import FluidPixelated from '../examples/fluid-pixelated';
import FluidSilly from '../examples/fluid-silly';

export default () => (
  <Layout>
    <h1>Fluid Images</h1>
    <p>
      In many cases, it’s desirable to make images responsive. The fluid image
      query is designed to expand the image to fill available space.
    </p>
    <div className="examples">
      <FluidDefault />
      <FluidTransformed />
      <FluidPixelated />
      <FluidSilly />
    </div>
  </Layout>
);
