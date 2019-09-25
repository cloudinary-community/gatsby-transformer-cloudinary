import React from 'react';
import Layout from '../components/layout';
import ManualFixed from '../examples/manual-fixed';
import ManualFluid from '../examples/manual-fluid';

export default () => (
  <Layout>
    <h1>Manually Create Cloudinary Data for Gatsby Image</h1>
    <p>Already have your images on Cloudinary? No problem!</p>
    <p>
      You can manually create fixed and fluid images by importing helper
      functions from the transformer.
    </p>
    <div className="examples">
      <ManualFixed />
      <ManualFluid />
    </div>
  </Layout>
);
