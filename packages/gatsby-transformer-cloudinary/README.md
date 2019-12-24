# gatsby-transformer-cloudinary

Creates `CloudinaryAsset` nodes from compatible `File` nodes. The `File` nodes are uploaded to [Cloudinary](https://cloudinary.com), and the `CloudinaryAsset` responses are made up of Cloudinary URLs to transformed images in a format that‘s compatible with [`gatsby-image`](https://www.gatsbyjs.org/packages/gatsby-image/).

You’ll need a [Cloudinary account](https://cloudinary.com) to use this plugin. They have a generous free tier, so for most of us this will stay free for quite a while.

[Live demo](https://gatsby-transformer-cloudinary.netlify.com/) ([source](https://github.com/jlengstorf/gatsby-transformer-cloudinary))

> **DISCLAIMER:** If you try running this demo's source code on your own computer, you might face issues as the demo uses assets and [transformations](https://cloudinary.com/documentation/chained_and_named_transformations#named_transformations) from the author’s Cloudinary account. Before running, please remove them or replace them with images and transformations from your own Cloudinary account.

## Install

This transformer only works if there are `File` nodes, which are created by [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/)

```sh
npm install --save gatsby-transformer-cloudinary gatsby-source-filesystem
```

## How to use

### Set up environment variables

Add the data that shouldn’t be committed to Git into `.env.development`:

```sh
# Find this at https://cloudinary.com/console/settings/account
CLOUDINARY_CLOUD_NAME=<your cloud name>

# Generate an API key pair at https://cloudinary.com/console/settings/security
CLOUDINARY_API_KEY=<your API key>
CLOUDINARY_API_SECRET=<your API secret>
```

> **NOTE:** you’ll also need to set these env vars in your build system (i.e. Netlify).

### Configure the plugin

In your `gatsby-config.js`, point `gatsby-source-filesystem` to images in your app, then set up `gatsby-transformer-cloudinary` with your credentials.

```js
// Load the environment variables.
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,

        // This folder will be created if it doesn’t exist.
        uploadFolder: 'gatsby-cloudinary',
      },
    },
  ],
};
```

### Query for images

Assuming you have an image called “avatar.jpg” in your `src/images/` directory, you can use it in a component like this:

```jsx
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

export default () => {
  const data = useStaticQuery(graphql`
    query {
      file(name: { eq: "avatar" }) {
        childCloudinaryAsset {
          fluid {
            ...CloudinaryAssetFluid
          }
        }
      }
    }
  `);

  return <Image fluid={data.file.childCloudinaryAsset.fluid} alt="avatar" />;
};
```

## API

This plugin can support both the `fixed` and `fluid` formats for `gatsby-image`.

Both `fixed` and `fluid` accept arguments. All arguments are optional.

### Arguments for both `fixed` and `fluid`

| argument          | type        | default                | description                                                                                                                                                                                                                                                                    |
| ----------------- | ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `transformations` | `[String!]` | `[]`                   | Transformations to apply to the image. Pass these as an array (e.g. `["e_grayscale", "ar_16:9"]`)                                                                                                                                                                              |
| `chained`         | `[String!]` | `[]`                   | For complex transformations, you may need to [chain transformations](https://cloudinary.com/documentation/chained_and_named_transformations). These are supplied as an array, with each link in the chain as an array item (e.g. `["e_grayscale", "l_overlay,g_center,o_60"]`) |
| `defaults`        | `[String!]` | `["f_auto", "q_auto"]` | By default, this transformer will set the format and quality parameters to “auto”, which is a Good Idea™ from a performance standpoint. If you want to change these defaults, you can set this argument explicitly.                                                            |
| `base64Width`     | `Int`       | `30`                   | If you want to change the width of the placeholder image shown while the full-resolution image is loading, you can change this value.                                                                                                                                          |

### Arguments for `fixed`

| argument | type  | default | description                                 |
| -------- | ----- | ------- | ------------------------------------------- |
| `width`  | `Int` | `400`   | The width that the image should display at. |

### Arguments for `fluid`

| argument   | type  | default | description                         |
| ---------- | ----- | ------- | ----------------------------------- |
| `maxWidth` | `Int` | `650`   | The maximum width for fluid images. |

### A note about aspect ratios

You’re able to change the aspect ratio of images by supplying the [aspect ratio parameter](https://cloudinary.com/documentation/image_transformation_reference#aspect_ratio_parameter) in the `transformations` argument.

> **NOTE:** The aspect ratio _must_ be supplied in the `transformations` array. It **will not** be picked up from the `chained` argument.

## Manual Usage

It’s also possible to manually create `gatsby-image`-friendly `fixed` and `fluid` objects by importing helper functions from the transformer.

This is an advanced use case — if possible, try not to do this when Gatsby’s data layer is an option. This is intended for cases where assets are already on Cloudinary and moving them to the Gatsby project would be too time-intensive to be reasonable.

> **NOTE:** This approach is async, which means you’ll end up with content jumping unless you manually account for the image area. You’ve been warned.

### Manually creating fluid images

```js
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
```

### Manually creating fixed images

```js
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
```
