import React from 'react';
import Layout from '../components/layout';
import ExistingData1 from '../examples/existing-data-1';
import ExistingData2 from '../examples/existing-data-2';

const ExistingPage = () => (
  <Layout>
    <h1>Node with Existing Data</h1>
    <p>
      It's possible to use existing Cloudinary assets, as opposed to uploading
      local files.
    </p>
    <div className="examples">
      <ExistingData1 />
      <ExistingData2 />
    </div>
  </Layout>
);

export default ExistingPage;
