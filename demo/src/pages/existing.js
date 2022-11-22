import React from 'react';
import Layout from '../components/layout';
import ExistingDataNested from '../examples/existing-data-nested';
import ExistingData from '../examples/existing-data';

const ExistingPage = () => (
  <Layout>
    <h1>Node with Existing Data</h1>
    <p>
      It's possible to use existing Cloudinary assets, as opposed to uploading
      local files. You need to configure the GraphQL Node Type with the existing
      data and the data must conform to the expected data shape.
    </p>
    <div className="examples">
      <ExistingData />
      <ExistingDataNested />
    </div>
  </Layout>
);

export default ExistingPage;
