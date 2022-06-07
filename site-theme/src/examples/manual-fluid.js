import React, { useEffect, useState } from 'react';
import Image from 'gatsby-image';
import { getFluidImageObject } from 'gatsby-transformer-cloudinary/api';

const ManualFluid = () => {
  const [fluid, setFluid] = useState(false);

  useEffect(() => {
    getFluidImageObject({
      public_id: 'gatsby-cloudinary/jason',
      cloudName: 'jlengstorf',
      originalHeight: 3024,
      originalWidth: 4032,
      breakpoints: [200, 400, 600, 800],
      transformations: ['ar_16:10', 'c_fill'],
      chained: ['e_grayscale,e_tint:100:663399:0p:white:100p', 't_lwj'],
    }).then((result) => setFluid(result));
  }, []);

  // Duplicate the query so we can display it on the page.
  const query = `
    import React from 'react';
    import Image from 'gatsby-image';
    import { getFluidImageObject } from 'gatsby-transformer-cloudinary';

    export default () => {
      const [fluid, setFluid] = useState(false);

      useEffect(() => {
        getFluidImageObject({
          public_id: 'gatsby-cloudinary/jason',
          cloudName: 'jlengstorf',
          originalHeight: 3024,
          originalWidth: 4032,
          breakpoints: [200, 400, 600, 800],
          transformations: ['ar_16:10', 'c_fill'],
          chained: ['e_grayscale,e_tint:100:663399:0p:white:100p', 't_lwj'],
        }).then(result => setFluid(result));
      }, []);

      return fluid ? <Image fluid={fluid} alt="Jason" /> : <p>loading...</p>;
    };
  `
    .replace(/^ {4}/gm, '') // Remove the leading indentation (this is a hack).
    .trim();

  return (
    <div className="image-example">
      <h2>Go wild!</h2>
      {fluid ? <Image fluid={fluid} alt="Jason" /> : <p>loading...</p>}
      <pre>{query}</pre>
    </div>
  );
};

export default ManualFluid;
