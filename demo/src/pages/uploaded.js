import React from 'react';
import Layout from '../components/layout';
import UploadedChaining from '../examples/uploaded-chaining';
import UploadedDefault from '../examples/uploaded-default';
import UploadedSilly from '../examples/uploaded-silly';
import UploadedThumb from '../examples/uploaded-thumb';
import UploadedTransformed from '../examples/uploaded-transformed';

const UploadedPage = () => (
  <Layout>
    <h1>Local images uploaded to Cloudinary</h1>
    <p>
      These are examples of local images uploaded to Cloudinary as part of the
      build process.
    </p>
    <div className="examples">
      <UploadedDefault />
      <UploadedThumb />
      <UploadedTransformed />
      <UploadedSilly />
      <UploadedChaining />
    </div>
  </Layout>
);

export default UploadedPage;
