import React, { useEffect, useState } from 'react';
import Image from 'gatsby-image';
import { getFixedImageObject } from 'gatsby-transformer-cloudinary/api';

const ManualFixed = () => {
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    getFixedImageObject({
      public_id: 'gatsby-cloudinary/jason',
      cloudName: 'jlengstorf',
      originalHeight: 3024,
      originalWidth: 4032,
    }).then((result) => setFixed(result));
  }, []);

  // Duplicate the query so we can display it on the page.
  const query = `
    import React from 'react';
    import Image from 'gatsby-image';
    import { getFixedImageObject } from 'gatsby-transformer-cloudinary';

    export default () => {
      const [fixed, setFixed] = useState(false);

      useEffect(() => {
        getFixedImageObject({
          public_id: 'gatsby-cloudinary/jason',
          cloudName: 'jlengstorf',
          originalHeight: 3024,
          originalWidth: 4032,
        }).then(result => setFixed(result));
      }, []);

      return fixed ? <Image fixed={fixed} alt="Jason" /> : <p>loading...</p>;
    };
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>You can manually create images, too!</h2>
      {fixed ? <Image fixed={fixed} alt="Jason" /> : <p>loading...</p>}
      <pre>{query}</pre>
    </div>
  );
};

export default ManualFixed;
