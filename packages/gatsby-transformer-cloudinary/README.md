# gatsby-transformer-cloudinary

Provides three ways to use [Cloudinary](https://cloudinary.com) with Gatsby: 1) Upload images in `File` nodes to Cloudinary. 2) Upload remote images by their URL to Cloudinary. 3) Create nodes for images that have already been uploaded to Cloudinary.

Each of the three methods above create `CloudinaryAsset` nodes compatible with [`gatsby-image`](https://www.gatsbyjs.org/packages/gatsby-image/).

You’ll need a [Cloudinary account](https://cloudinary.com) to use this plugin. They have a generous free tier, so for most of us this will stay free for quite a while.

[Live demo](https://gatsby-transformer-cloudinary.netlify.com/) ([source](https://github.com/jlengstorf/gatsby-transformer-cloudinary))

> **DISCLAIMER:** If you try running this demo's source code on your own computer, you might face issues as the demo uses assets and [transformations](https://cloudinary.com/documentation/chained_and_named_transformations#named_transformations) from the author’s Cloudinary account. Before running, please remove them or replace them with images and transformations from your own Cloudinary account.

## Features

- Upload local project media assets to a secure remote CDN
- Upload remote media assets to a secure remote CDN
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

This transformer automatically creates childCloudinaryAsset nodes for `File` nodes created by [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/).

This transformer also allows you to pass URLs directly to Cloudinary to side-step the need to first download files to your development machine. This can be achieved by calling the `createRemoteImageNode` function from an `onCreateNode` function.

Install the plugins using either `npm` or `yarn`.

```sh
npm install --save gatsby-transformer-cloudinary gatsby-source-filesystem
```

```sh
yarn add gatsby-transformer-cloudinary gatsby-source-filesystem
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

> **NOTE:** you’ll also need to set these environment variables in your build system (i.e. Netlify).

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

### Upload remote images

To directly upload images to Cloudinary from remote sources, you can use the `createRemoteImageNode` function:

```js
// gatsby-node.js
import { createRemoteImageNode } from 'gatsby-transformer-cloudinary';

// This example assumes "post" nodes are created in a `sourceNodes` function.
const POST_NODE_TYPE = 'post';

export async function onCreateNode({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
  reporter,
}) {
  // In this example, "post" nodes sometimes have a "cover_photo_url" that's a link to an image.
  if (node.internal.type === POST_NODE_TYPE && node.cover_photo_url) {
    await createRemoteImageNode({
      url: node.cover_photo_url,
      parentNode: node,
      relationshipName: 'coverPhoto',
      createNode,
      createNodeId,
      createContentDigest,
      reporter,
    });
  }
}
```

### Use images already on Cloudinary

To create GraphQL nodes for images that are already uploaded to Cloudinary, you need to create nodes containing data that describe the images on Cloudinary. For example, you might have a `post` node that has a cover photo stored on Cloudinary. The data in the post node should look something like...

```js
{
  title: "How to beat the pandemic blues",
  publishedAt: "2020-07-26T21:55:13.358Z",
  coverPhoto: {
    cloudinaryAssetData: true,
    cloudName: "my-amazing-blog",
    publicId: "blue-blue-blue",
    originalHeight: 360,
    originalWidth: 820,
    defaultBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMXG/8HwAEwAI0Bj1bnwAAAABJRU5ErkJggg==",
  }
}
```

The `coverPhoto` property in the node above will be deleted and replaced by `gatsby-transformer-cloudinary` with a `CloudinaryAsset` node that can be used with [`gatsby-image`](https://www.gatsbyjs.org/packages/gatsby-image/). This transformation will be done for any top-level properties of nodes that have `cloudinaryAssetData: true`, and values `cloudName`, `publicId`, `originalHeight`, and `originalWidth` properties. The top-level property name, `coverPhoto` in the example above, will be the name of the relationship between the parent node and the `CloudinaryAsset` node that will be created.

The property `defaultBase64` in the node above can be used by your CMS/backend API to provide pre-computed or cached base64 URIs for your images. The provided string must comply with [RFC 2397](https://tools.ietf.org/html/rfc2397). This base64 image will be used unless `ignoreDefaultBase64: true` is set in your GraphQL query. In cases where you prefer to have an accurate base64 image with the same transformations applied as you full-size image, you should use `ignoreDefaultBase64: true` in your GraphQL query. When a defaultBase64 property is not supplied or `ignoreDefaultBase64` is true, an API call to Cloudinary will be made when resolving your GraphQL queries to fetch the base64 image.

When providing `defaultBase64` properties, it's recommended that you set the plugin option `alwaysUseDefaultBase64` to true in development. This may result in your base64 images looking different in development and production, but it will also result in much faster development build times as fewer API calls to Cloudinary will be made. The `alwaysUseDefaultBase64` plugin option overrides the `ignoreDefaultBase64` GraphQL query parameter and forces `gatsby-transformer-cloudinary` to always use `defaultBase64` images when they are provided.

### Plugin options

In `gatsby-config.js` the plugin accepts the following options:

| option                         | type      | required | default value | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------ | --------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudName`                    | `String`  | true     | n/a           | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                                                                                                                                      |
| `apiKey`                       | `String`  | true     | n/a           | API Key of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                                                                                                                                         |
| `apiSecret`                    | `String`  | true     | n/a           | API Secret of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                                                                                                                                      |
| `uploadFolder`                 | `String`  | false    | n/a           | An optional folder name where the uploaded assets will be stored on Cloudinary.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `fluidMaxWidth`                | `Int`     | false    | 1000          | The maximum width needed for an image. If specifying a width bigger than the original image, the width of the original image is used instead. Used when calculating breakpoints.                                                                                                                                                                                                                                                                                                             |
| `fluidMinWidth`                | `Int`     | false    | 200           | The minimum width needed for an image. Used when calculating breakpoints.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `createDerived`                | `Boolean` | false    | true          | If `true`, create and keep the derived images of the selected breakpoints during the API call. If false, images generated during the analysis process are thrown away. This option is ignored if `useCloudinaryBreakpoints` is `false`. It's recommended that you enable `createDerived` if `useCloudinaryBreakpoints` is true to store the breakpoint images and prevent them from being recalculated on every build.                                                                       |
| `breakpointsMaxImages`         | `Integer` | false    | 5             | Set maximum number of responsive breakpoint images generated and returned on image upload. If `useCloudinaryBreakpoints` is false, then exactly `breakpointsMaxImages` breakpoints will be created.                                                                                                                                                                                                                                                                                          |
| `useCloudinaryBreakpoints`     | `Boolean` | false    | false         | If `true`, then Cloudinary will be requested to automatically find the best breakpoints for each image. It's recommended that this option be set to `false` in development because this option uses one Cloudinary transformation for every image uploaded to Cloudinary plus one transformation for every derived image created while calculating breakpoints.                                                                                                                              |
| `overwriteExisting`            | `Boolean` | false    | false         | Whether to overwrite existing assets with the same public ID. When set to false, return immediately if an asset with the same Public ID was found. It's recommended that this is set to false in development as each image overwrite costs one Cloudinary transformation.                                                                                                                                                                                                                    |
| `enableDefaultTransformations` | `Boolean` | false    | false           | `true` will add the `q_auto` and `f_auto` transformations to images for quality and format optimizations.                                                                                                                                                                                                                                                                                                                                                                                    |
| `alwaysUseDefaultBase64`       | `Boolean` | false    | false         | When `alwaysUseDefaultBase64` is true, `gatsby-transformer-cloudinary` will always use `defaultBase64` images when they are provided to the GraphQL layer. It's recommended that you set `alwaysUseDefaultBase64` to true in your development environment and provide `defaultBase64` properties for any images already uploaded to Cloudinary. Doing so will result in faster and cheaper builds because no Cloudinary API calls will need to be made when resolving your GraphQL queries. |

> Note: Each derived image created for a breakpoint will consume one Cloudinary transformation. Enable the `useCloudinaryBreakpoints` option with care. If the `createDerived` option is enabled, transformations will only be consumed when the images are first created. However, created images will consume Cloudinary storage space. If `overwriteExisting` is enabled, each image that you upload will consume one transformation each time your Gatsby cache gets cleared and the image gets re-uploaded. For this reason, it's recommended that you keep `overWriteExisting` disabled and instead set the `overwriteExisting` parameter of `createRemoteImageNode` on a per-image basis when you know that an image has actually been updated.

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

### Avoiding stretched images using the fluid type

As mentioned previously, images using the fluid type are stretched to match the container’s width and height. In the case where the image’s width or height is smaller than the available viewport, the image will stretch to match the container, potentially leading to unwanted problems and worsened image quality.

The `CloudinaryAssetFluidLimitPresentationSize` fragment can be used to to `gatsby-image` not to stretch an image larger than its maximum dimensions regardless of the size of its container:

```graphql
query {
  file(name: { eq: "avatar" }) {
    childCloudinaryAsset {
      fluid {
        ...CloudinaryAssetFluid
        ...CloudinaryAssetFluidLimitPresentationSize
      }
    }
  }
}
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

| argument              | type        | required | default                | description                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ----------- | -------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudName`           | `String`    | true     | `n/a`                  | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                          |
| `public_id`           | `String`    | true     | `n/a`                  | Public ID of the image to retrieve from Cloudinary. This can be obtained from your Cloudinary account.                                                                                                                                                                                                                                                                           |
| `transformations`     | `[String!]` | false    | `[]`                   | Array of transformations to be applied to the image.                                                                                                                                                                                                                                                                                                                             |
| `chained`             | `[String!]` | false    | `[]`                   | An array of chained transformations to be applied to the image.                                                                                                                                                                                                                                                                                                                  |
| `defaults`            | `[String!]` | false    | `["f_auto", "q_auto"]` | Default transformation applied to the image                                                                                                                                                                                                                                                                                                                                      |
| `originalHeight`      | `Int`       | true     | `n/a`                  | Height of the image fetched. This is required in gatsby-image to calculate the aspect ratio of the image.                                                                                                                                                                                                                                                                        |
| `originalWidth`       | `Int`       | true     | `n/a`                  | Desired width of the image. This is required in gatsby-image to calculate the aspect ratio.                                                                                                                                                                                                                                                                                      |
| `base64Width`         | `String`    | false    | `30`                   | Base64 width of the image.                                                                                                                                                                                                                                                                                                                                                       |
| `version`             | `Boolean`   | false    | `false`                | Version number of image if applicable, eg. 300124291, 1241983.                                                                                                                                                                                                                                                                                                                   |
| `ignoreDefaultBase64` | `Boolean`   | false    | false                  | If this parameter is set to true, then an API call will be made to Cloudinary when resolving your GraphQL queries to fetch a base64 image regardless of whether a `defaultBase64` image was provided for the image. This parameter can be overridden by the `alwaysUseDefaultBase64` plugin option in environments where build speed and economy of Cloudinary usage is desired. |

### Arguments for `fixed`

| argument | type  | default | description                                                                                    |
| -------- | ----- | ------- | ---------------------------------------------------------------------------------------------- |
| `height` | `Int` | `n/a`   | The height that the image should display at. If `width` is provided, then `height` is ignored. |
| `width`  | `Int` | `400`   | The width that the image should display at.                                                    |

### Arguments for `fluid`

| argument   | type  | default                     | description                         |
| ---------- | ----- | --------------------------- | ----------------------------------- |
| `maxWidth` | `Int` | Original width of the image | The maximum width for fluid images. |

### A note about aspect ratios

You’re able to change the aspect ratio of images by supplying the [aspect ratio parameter](https://cloudinary.com/documentation/image_transformation_reference#aspect_ratio_parameter) in the `transformations` argument.

> **NOTE:** The aspect ratio _must_ be supplied in the `transformations` array. It **will not** be picked up from the `chained` argument.

## Running Tests

Run the tests once:

```
yarn workspace gatsby-transformer-cloudinary test
```

Run the tests in watch mode:

```
yarn workspace gatsby-transformer-cloudinary test:watch
```

## Other Resources

- [Cloudinary image transformation reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Try the gatsby-source-cloudinary plugin to source media files into Gatsby file nodes](https://www.npmjs.com/package/gatsby-source-cloudinary)
- [Using Cloudinary image service for media optimization](https://www.gatsbyjs.org/docs/using-cloudinary-image-service/)
- [Learn how this plugin was built with Jason Lengstorf](https://www.learnwithjason.dev/build-a-gatsby-transformer-plugin-for-cloudinary)

## Contribute

Want to contribute to make this tool even better? Feel free to send in issues and pull requests on feature requests, fixes, bugs, typos, performance lapses or any other challenge faced with using this tool.

## License

MIT
