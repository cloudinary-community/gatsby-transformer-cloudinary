# gatsby-transformer-cloudinary

Creates `CloudinaryAsset` nodes from compatible `File` nodes. The `File` nodes are uploaded to [Cloudinary](https://cloudinary.com), and the `CloudinaryAsset` responses are made up of Cloudinary URLs to transformed images in a format that‘s compatible with [`gatsby-image`](https://www.gatsbyjs.org/packages/gatsby-image/).

You’ll need a [Cloudinary account](https://cloudinary.com) to use this plugin. They have a generous free tier, so for most of us this will stay free for quite a while.

[Live demo](https://gatsby-transformer-cloudinary.netlify.com/) ([source](https://github.com/jlengstorf/gatsby-transformer-cloudinary))

> **DISCLAIMER:** If you try running this demo's source code on your own computer, you might face issues as the demo uses assets and [transformations](https://cloudinary.com/documentation/chained_and_named_transformations#named_transformations) from the author’s Cloudinary account. Before running, please remove them or replace them with images and transformations from your own Cloudinary account.

## Features

- Upload local project media assets to a secure remote CDN
- Utilize media assets on Cloudinary in gatsby-image
- Use gatsby-image `fluid` and `fixed` formats on Cloudinary assets
- Retrieve media files in optimized formats with responsive breakpoints
- Utilize all Cloudinary transformations including chained transformations in gatsby's data layer

## Example usage

Here's the plugin in action to fetch a fixed asset using the `useStaticQuery` API of gatsby:

```jsx harmony
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

export default () => {
  const data = useStaticQuery(graphql`
    query {
      file(name: { eq: "marketplace-banner" }) {
        childCloudinaryAsset {
          fixed {
            ...CloudinaryAssetFixed
          }
        }
      }
    }
  `);

  return (
    <div>
      <h2>Here goes something</h2>
      <Image fixed={data.file.childCloudinaryAsset.fixed} alt="banner" />
    </div>
  );
};
```

## Installation

This transformer only works if there are `File` nodes, which are created by [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/).
Install the plugins using either `npm` or `yarn`.

```sh
npm install --save gatsby-transformer-cloudinary gatsby-source-filesystem
```

## How to use

### Set up environment variables

Add the data that shouldn’t be committed to Git into `.env.development`:

```sh
# Find these values at https://cloudinary.com/console/
CLOUDINARY_CLOUD_NAME=<your cloud name>
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
        uploadFolder: 'gatsby-cloudinary',
      },
    },
  ],
};
```

### Plugin options

In `gatsby-config.js` the plugin accepts the following options:

| option                     | type      | required | default value | description                                                                                                                                                                                                                                                               |
| -------------------------- | --------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudName`                | `String`  | true     | n/a           | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                   |
| `apiKey`                   | `String`  | true     | n/a           | API Key of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                      |
| `apiSecret`                | `String`  | true     | n/a           | API Secret of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                   |
| `uploadFolder`             | `String`  | false    | n/a           | An optional folder name where the uploaded assets will be stored on Cloudinary.                                                                                                                                                                                           |
| `fluidMaxWidth`            | `Int`     | false    | 1000          | The maximum width needed for an image. If specifying a width bigger than the original image, the width of the original image is used instead. Used when calculating breakpoints.                                                                                          |
| `fluidMinWidth`            | `Int`     | false    | 50            | The minimum width needed for an image. Used when calculating breakpoints.                                                                                                                                                                                                 |
| `createDerived`            | `Boolean` | false    | true          | If `true`, create and keep the derived images of the selected breakpoints during the API call. If false, images generated during the analysis process are thrown away. This option is ignored if `useCloudinaryBreakpoints` is `false`.                                   |
| `breakpointsMaxImages`     | `Integer` | false    | 20            | Set maximum number of responsive breakpoint images generated and returned on image upload. If `useCloudinaryBreakpoints` is false, then exactly `breakpointsMaxImages` breakpoints will be created.                                                                       |
| `useCloudinaryBreakpoints` | `Boolean` | false    | true          | If `true`, then Cloudinary will be requested to automatically find the best breakpoints for each image. It's recommended that this option be set to `false` in development because this option uses one Cloudinary transformation for every image uploaded to Cloudinary. |
| `overwriteExisting`        | `Boolean` | false    | true          | Whether to overwrite existing assets with the same public ID. When set to false, return immediately if an asset with the same Public ID was found.                                                                                                                        |

> Note: Setting a high max width such as 5000 will lead to the generation of a lot of derived images, between the max and min widths breakpoints on image upload. Use this option with care.

### Query for images

Assuming you have an image called “avatar.jpg” in your `src/images/` directory, you can use it in a component like this:

```jsx harmony
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

## API

This plugin can support both the `fixed` and `fluid` formats for `gatsby-image`.

Both `fixed` and `fluid` accept arguments. All arguments are optional.

### Arguments for both `fixed` and `fluid`

| argument          | type        | required | default                | description                                                                                                                                                                             |
| ----------------- | ----------- | -------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudName`       | `String`    | true     | `n/a`                  | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable. |
| `public_id`       | `String`    | true     | `n/a`                  | Public ID of the image to retrieve from Cloudinary. This can be obtained from your Cloudinary account.                                                                                  |
| `transformations` | `[String!]` | false    | `[]`                   | Array of transformations to be applied to the image.                                                                                                                                    |
| `chained`         | `[String!]` | false    | `[]`                   | An array of chained transformations to be applied to the image.                                                                                                                         |
| `defaults`        | `[String!]` | false    | `["f_auto", "q_auto"]` | Default transformation applied to the image                                                                                                                                             |
| `originalHeight`  | `Int`       | true     | `n/a`                  | Height of the image fetched. This is required in gatsby-image to calculate the aspect ratio of the image.                                                                               |
| `originalWidth`   | `Int`       | true     | `n/a`                  | Desired width of the image. This is required in gatsby-image to calculate the aspect ratio.                                                                                             |
| `base64Width`     | `String`    | false    | `30`                   | Base64 width of the image.                                                                                                                                                              |
| `version`         | `Boolean`   | false    | `false`                | Version number of image if applicable, eg. 300124291, 1241983.                                                                                                                          |

### Arguments for `fixed`

| argument | type  | default | description                                 |
| -------- | ----- | ------- | ------------------------------------------- |
| `width`  | `Int` | `400`   | The width that the image should display at. |

### Arguments for `fluid`

| argument   | type  | default                     | description                         |
| ---------- | ----- | --------------------------- | ----------------------------------- |
| `maxWidth` | `Int` | Original width of the image | The maximum width for fluid images. |

### A note about aspect ratios

You’re able to change the aspect ratio of images by supplying the [aspect ratio parameter](https://cloudinary.com/documentation/image_transformation_reference#aspect_ratio_parameter) in the `transformations` argument.

> **NOTE:** The aspect ratio _must_ be supplied in the `transformations` array. It **will not** be picked up from the `chained` argument.

## Other Resources

- [Cloudinary image transformation reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Try the gatsby-source-cloudinary plugin to source media files into Gatsby file nodes](https://www.npmjs.com/package/gatsby-source-cloudinary)
- [Using Cloudinary image service for media optimization](https://www.gatsbyjs.org/docs/using-cloudinary-image-service/)
- [Learn how this plugin was built with Jason Lengstorf](https://www.learnwithjason.dev/build-a-gatsby-transformer-plugin-for-cloudinary)

## Contribute

Want to contribute to make this tool even better? Feel free to send in issues and pull requests on feature requests, fixes, bugs, typos, performance lapses or any other challenge faced with using this tool.

## License

MIT
