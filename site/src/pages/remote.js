import React from 'react';
import Layout from '../components/layout';
import RemoteImage1 from '../examples/remote-image-1';
import RemoteImage2 from '../examples/remote-image-2';

const RemotePage = () => (
  <Layout>
    <h1>Upload remote images to Cloudinary</h1>
    <p>Use `createRemoteImageNode to upload remote images to Cloudinary.</p>
    <div className="examples">
      <RemoteImage1 />
      <RemoteImage2 />
    </div>
  </Layout>
);

export default RemotePage;
