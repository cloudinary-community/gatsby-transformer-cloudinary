import React from 'react';
import Layout from '../components/layout';
import FixedDefault from '../examples/fixed-default';
import FixedTransformed from '../examples/fixed-transformed';
import FixedChaining from '../examples/fixed-chaining';
import FixedThumb from '../examples/fixed-thumb';

const Fixed = () => (
  <Layout>
    <h1>Fixed-Width Images</h1>
    <p>
      If your image should always be the same size no matter what the viewport
      size is, use a fixed image.
    </p>
    <div className="examples">
      <FixedDefault />
      <FixedTransformed />
      <FixedChaining />
      <FixedThumb />
    </div>
  </Layout>
);

export default Fixed;
