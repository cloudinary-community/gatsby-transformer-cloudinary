# gatsby-transformer-cloudinary

The gatsby-transformer-cloudinary lets you upload local and remote assets to [Cloudinary](https://cloudinary.com/) from within your Gatsby project. It also lets you add Gatsby Image support to sourced data on existing Cloudinary assets as well as the uploaded ones.

> Looking to simply leverage Cloudinary's storage and optimized delivery, to fetch existing media files from Cloudinary into your Gatsby project? Checkout [gatsby-source-cloudinary](https://www.npmjs.com/package/gatsby-source-cloudinary) plugin.

## Upload Assets to Cloudinary

Provides two ways to upload images to Cloudinary:

1. Upload images in `File` nodes to Cloudinary
2. Upload remote images by their URL to Cloudinary

A `CloudinaryAsset` node is created for each image.

## Gatsby Image Support

Adds support for `gatsby-plugin-image` and `gatsby-image` (deprecated) by adding the resolvers `gatsbyImageData`, `fluid` (deprecated) and `fixed` (deprecated) to the configured GraphQL Types.

No new nodes are created, the resolvers are added to the configured GraphQL Types. By default the configurable option `transformTypes` is set to `[CloudinaryAsset]`, but you may add any GraphQL Type describing a Cloudinary image you have sourced from a CMS/Database or [gatsby-source-cloudinary](https://www.gatsbyjs.com/plugins/gatsby-source-cloudinary/).

## Live demo

[Live demo](https://gatsby-transformer-cloudinary.netlify.com/) ([source](https://github.com/jlengstorf/gatsby-transformer-cloudinary))

> **DISCLAIMER:** If you try running this demo's source code on your own computer, you might face issues as the demo uses assets and [transformations](https://cloudinary.com/documentation/chained_and_named_transformations#named_transformations) from the author’s Cloudinary account. Before running, please remove them or replace them with images and transformations from your own Cloudinary account.

## Features

- Upload local project media assets to a secure remote CDN
- Upload remote media assets to a secure remote CDN
- Utilize media assets on Cloudinary in gatsby-image
- Use gatsby-image `fluid` and `fixed` formats on Cloudinary assets
  - Deprecated as `gatsby-image` is deprecated
- Use gatsby-plugin-image `gatsbyImageData` on Cloudinary assets
- Retrieve media files in optimized formats with responsive breakpoints
- Utilize all Cloudinary transformations including chained transformations in gatsby's data layer

## Example usage

Here's the plugin in action to fetch a fixed asset using the `useStaticQuery` API of Gatsby:

```jsx
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// Both gatsby-image and gatsby-plugin-image is supported
// gatsby-image is deprecated, use gatsby-plugin-image for new projects
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Image from 'gatsby-image';

const SingleImage = () => {
  const data = useStaticQuery(graphql`
    query ExampleQuery {
      cloudinaryAsset(publicId: { eq: "gatsby-cloudinary/jason" }) {
        fixed(width: 300) {
          ...CloudinaryAssetFixed
        }
        gatsbyImageData(width: 300, layout: FIXED)
      }
    }
  `);

  const image = getImage(data.cloudinaryAsset);

  return (
    <>
      <GatsbyImage image={image} alt="banner" />
      <Image fixed={data.cloudinaryAsset.fixed} alt="banner" />
    </>
  );
};

export default SingleImage;
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
        uploadSourceInstanceNames: ['images'],
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

// This example assumes "Post" nodes are created in a `sourceNodes` function.
const POST_NODE_TYPE = 'Post';

export async function onCreateNode({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
  reporter,
}) {
  // In this example, "Post" nodes sometimes have a "cover_photo_url" that's a link to an image.
  if (node.internal.type === POST_NODE_TYPE && node.coverPhotoUrl) {
    const imageNode = await createRemoteImageNode({
      url: node.coverPhotoUrl,
      parentNode: node,
      createNode,
      createNodeId,
      createContentDigest,
      reporter,
    });

    createNodeField({ node: node, name: 'coverPhoto', value: imageNode.id });
  }
}

exports.createSchemaCustomization = (gatsbyUtils) => {
  const { actions } = gatsbyUtils;

  const PostType = `
      type Post implements Node  {
        coverPhotoUrl: String!
        coverPhoto: CloudinaryAsset @link(from: "fields.coverPhoto" by: "id")
      }
    `;

  actions.createTypes([PostType]);
};
```

### Use images already on Cloudinary

To create GraphQL nodes for images that are already uploaded to Cloudinary, you need to create nodes containing data that describe the asset on Cloudinary.

For example, you may have sourced existing data from Cloudinary using [gatsby-source-cloudinary](https://www.gatsbyjs.com/plugins/gatsby-source-cloudinary/) and have `CloudinaryMedia` nodes that look like...

```js
{
  cloudName: "my-amazing-blog",
  publicId: "blue-blue-blue",
  originalHeight: 360,
  originalWidth: 820,
  originalFormat: "jpg"
}
```

Or you might have a `Post` node with a cover photo already stored on Cloudinary. The data in the Post node should then look something like...

```js
{
  title: "How to beat the pandemic blues",
  publishedAt: "2020-07-26T21:55:13.358Z",
  coverPhoto: {
    cloudName: "my-amazing-blog",
    publicId: "blue-blue-blue",
    originalHeight: 360,
    originalWidth: 820,
    originalFormat: "jpg",
    defaultBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMXG/8HwAEwAI0Bj1bnwAAAABJRU5ErkJggg==",
    defaultTracedSVG: "data:image/svg+xml,%3Csvg%20height%3D%229999%22%20viewBox%3D%220%200%209999%209999%22%20width%3D%229999%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m0%200h9999v9999h-9999z%22%20fill%3D%22%23f9fafb%22%2F%3E%3C%2Fsvg%3E",
  }
}
```

To add Gatsby Image support you need to to add the GraphQL Type of `coverPhoto` GraphQL to the `transformTypes` plugin option array.

For the example above the GraphQL Types are `CloudinaryMedia` and `PostCoverPhoto`.

To find the GraphQL type of the data describing the assets on Cloudinary use the GraphiQL explorer and hover over the asset key, in the second example this would be `coverPhoto`.

If you have used the upload functionality of this plugin, the GraphQL type of the nodes describing the uploaded files is `CloudinaryAsset`.

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        transformTypes: [
          `CloudinaryAsset`,
          `PostCoverPhoto`,
          `CloudinaryMedia`,
        ],
      },
    },
  ],
};
```

The property `defaultBase64` in the node above can be used by your CMS/backend API to provide precomputed or cached base64 URIs for your images. The provided string must comply with [RFC 2397](https://tools.ietf.org/html/rfc2397). This base64 image will be used unless `ignoreDefaultBase64: true` is set in your GraphQL query. In cases where you prefer to have an accurate base64 image with the same transformations applied as you full-size image, you should use `ignoreDefaultBase64: true` in your GraphQL query. When a defaultBase64 property is not supplied or `ignoreDefaultBase64` is true, an API call to Cloudinary will be made when resolving your GraphQL queries to fetch the base64 image.

When providing `defaultBase64` properties, it's recommended that you set the plugin option `alwaysUseDefaultBase64` to true in development. This may result in your base64 images looking different in development and production, but it will also result in much faster development build times as fewer API calls to Cloudinary will be made. The `alwaysUseDefaultBase64` plugin option overrides the `ignoreDefaultBase64` GraphQL query parameter and forces `gatsby-transformer-cloudinary` to always use `defaultBase64` images when they are provided.

No API calls to Cloudinary for base64 images will be made if your GraphQL queries do not request base64 images.

The property `defaultTracedSVG` in the node above can be used by your CMS/backend to provide precomputed or cached SVG placeholders for your images. The provided string must comply with [RFC 2397](https://tools.ietf.org/html/rfc2397). It should also be encoded with something like JavaScript's `encodeURIComponent()`.

### Plugin options

In `gatsby-config.js` the plugin accepts the following options:

| option                                              | type       | required | default value                     | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------- | ---------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudName`                                         | `String`   | false    | n/a                               | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                                                                                                                                     |
| `apiKey`                                            | `String`   | false    | n/a                               | API Key of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                                                                                                                                        |
| `apiSecret`                                         | `String`   | false    | n/a                               | API Secret of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                                                                                                                                                                                                                                     |
| `uploadFolder`                                      | `String`   | false    | n/a                               | An optional folder name where the uploaded assets will be stored on Cloudinary.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `uploadSourceInstanceNames`                         | `[String]` | false    | n/a                               | An optional array limiting uploads to file nodes with a matching sourceInstanceName.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `transformTypes`                                    | `[String]` | false    | `['CloudinaryAsset']`             | An optional array of GraphQL Types needing Gatsby Image support. Adds the resolvers `gatsbyImageData`, `fluid` (deprecated) and `fixed` (deprecated)).                                                                                                                                                                                                                                                                                                                                      |
| `overwriteExisting`                                 | `Boolean`  | false    | false                             | Whether to overwrite existing assets with the same public ID. When set to false, return immediately if an asset with the same Public ID was found. It's recommended that this is set to false in development as each image overwrite costs one Cloudinary transformation.                                                                                                                                                                                                                   |
| `defaultTransformations` (gatsby-plugin-image only) | `[String]` | false    | ` ['c_fill', 'g_auto', 'q_auto']` | The default value for the `gatsbyImageData` resolver argument `transformations`.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `fluidMaxWidth` (gatsby-image only)                 | `Int`      | false    | 1000                              | The maximum width needed for an image. If specifying a width bigger than the original image, the width of the original image is used instead. Used when calculating breakpoints.                                                                                                                                                                                                                                                                                                            |
| `fluidMinWidth` (gatsby-image only)                 | `Int`      | false    | 200                               | The minimum width needed for an image. Used when calculating breakpoints.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `createDerived` (gatsby-image only)                 | `Boolean`  | false    | true                              | If `true`, create and keep the derived images of the selected breakpoints during the API call. If false, images generated during the analysis process are thrown away. This option is ignored if `useCloudinaryBreakpoints` is `false`. It's recommended that you enable `createDerived` if `useCloudinaryBreakpoints` is true to store the breakpoint images and prevent them from being recalculated on every build.                                                                      |
| `breakpointsMaxImages` (gatsby-image only)          | `Integer`  | false    | 5                                 | Set maximum number of responsive breakpoint images generated and returned on image upload. If `useCloudinaryBreakpoints` is false, then exactly `breakpointsMaxImages` breakpoints will be created.                                                                                                                                                                                                                                                                                         |
| `useCloudinaryBreakpoints` (gatsby-image only)      | `Boolean`  | false    | false                             | If `true`, then Cloudinary will be requested to automatically find the best breakpoints for each image. It's recommended that this option be set to `false` in development because this option uses one Cloudinary transformation for every image uploaded to Cloudinary plus one transformation for every derived image created while calculating breakpoints.                                                                                                                             |
| `enableDefaultTransformations` (gatsby-image only)  | `Boolean`  | false    | false                             | `true` will add the `q_auto` and `f_auto` transformations to images for quality and format optimizations.                                                                                                                                                                                                                                                                                                                                                                                   |
| `alwaysUseDefaultBase64` (gatsby-image only)        | `Boolean`  | false    | false                             | When `alwaysUseDefaultBase64` is true, `gatsby-transformer-cloudinary` will always use `defaultBase64` images when they are provided to the GraphQL layer. It's recommended that you set `alwaysUseDefaultBase64` to true in your development environment and provide `defaultBase64` properties for any images already uploaded to Cloudinary. Doing so will result in faster and cheaper builds because no Cloudinary API calls will need to be made when resolving your GraphQL queries. |

The options `cloudName`, `apiKey`, and `apiSecret` are required if any images will be uploaded to Cloudinary during the build process. If you're solely using images already uploaded to Cloudinary, then these options can be safely omitted.

> Note: Each derived image created for a breakpoint will consume one Cloudinary transformation. Enable the `useCloudinaryBreakpoints` option with care. If the `createDerived` option is enabled, transformations will only be consumed when the images are first created. However, created images will consume Cloudinary storage space. If `overwriteExisting` is enabled, each image that you upload will consume one transformation each time your Gatsby cache gets cleared and the image gets re-uploaded. For this reason, it's recommended that you keep `overWriteExisting` disabled and instead set the `overwriteExisting` parameter of `createRemoteImageNode` on a per-image basis when you know that an image has actually been updated.

## Gatsby Plugin Image API

The plugin supports [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) by adding a `gatsbyImageData` resolver to the configured GraphQL types.

### Arguments for `gatsbyImageData`

#### `transformations`

An array of "raw" cloudinary transformations added to the initial transformation together with the width and height.

**Type:** `[String]`  
**Default:**`["c_fill", "g_auto", "q_auto"]` or the configured `defaultTransformations`  
**Example:** `["c_crop", "x_300"]`

> **WARNING:** Changing the sizing using transformations will mess with the Gatsby Image Component

#### `chained`

An array of "raw" cloudinary transformations added after the initial transformations above.

**Type:** `[String]`  
**Default:** `[]`  
**Example:** `["e_grayscale","e_pixelate_faces,e_tint:100:663399:0p:white:100p"]`

> **WARNING:** Changing the sizing using chained transformations will mess with the Gatsby Image Component

#### `placeholder`

The style of the temporary image shown while the larger image is loaded.

**Type:** `NONE`, `BLURRED` or `TRACED_SVG`  
**Default:** `NONE`  
**Example:** `BLURRED`

> **NOTE:** `DOMINANT_COLOR` is not supported

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#placeholder) for more information.

#### `secure`

When set to `false` uses `http` instead of `https` for the image urls.

**Type:** `Boolean`
**Default:** `true`

#### `height` / `width`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#widthheight) for information on `height` / `width`.

#### `aspectRatio`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#aspectratio) for information on `aspectRatio`.

#### `layout`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#layout) for information on `layout`.

#### `backgroundColor`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#all-options) for information on `backgroundColor`.

#### `breakpoints`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#all-options) for information on `breakpoints`.

#### `outputPixelDensities`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#all-options) for information on `outputPixelDensities`.

#### `sizes`

Go to the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#all-options) for information on `sizes`.

## Gatsby Image API (Deprecated)

This plugin can support both the `fixed` and `fluid` formats for `gatsby-image`.

Both `fixed` and `fluid` accept arguments. All arguments are optional.

> **WARNING:** Support for `gatsby-image` will be removed in the near future, please upgrade to `gatsby-plugin-image`.

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

| argument | type  | default | description                                  |
| -------- | ----- | ------- | -------------------------------------------- |
| `height` | `Int` | `n/a`   | The height that the image should display at. |
| `width`  | `Int` | `400`   | The width that the image should display at.  |

### Arguments for `fluid`

| argument   | type  | default                     | description                         |
| ---------- | ----- | --------------------------- | ----------------------------------- |
| `maxWidth` | `Int` | Original width of the image | The maximum width for fluid images. |

### A note about aspect ratios

You’re able to change the aspect ratio of images by supplying the [aspect ratio parameter](https://cloudinary.com/documentation/image_transformation_reference#aspect_ratio_parameter) in the `transformations` argument.

> **NOTE:** The aspect ratio _must_ be supplied in the `transformations` array. It **will not** be picked up from the `chained` argument.

### Gatsby Image Fragments

The fragments below can be used when querying your Cloudinary assets:

- `CloudinaryAssetFluid`
- `CloudinaryAssetFluid_noBase64`
- `CloudinaryAssetFluid_tracedSVG`
- `CloudinaryAssetFixed`
- `CloudinaryAssetFixed_noBase64`
- `CloudinaryAssetFixed_tracedSVG`

## Avoiding stretched images using the fluid type

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

## Manual Usage (gatsby-image only)

It’s also possible to manually create `gatsby-image`-friendly `fixed` and `fluid` objects by importing helper functions from the transformer.

This is an advanced use case — if possible, try not to do this when Gatsby’s data layer is an option. This is intended for cases where assets are already on Cloudinary and moving them to the Gatsby project would be too time-intensive to be reasonable.

> **NOTE:** This approach is async, which means you’ll end up with content jumping unless you manually account for the image area. You’ve been warned.

### Manually creating fluid images

```js
import React from 'react';
import Image from 'gatsby-image';
import { getFluidImageObject } from 'gatsby-transformer-cloudinary/api';

export default () => {
  const [fluid, setFluid] = useState(undefined);

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

  return fluid ? <Image fluid={fluid} alt="Jason" /> : <p>loading...</p>;
};
```

### Manually creating fixed images

```js
import React from 'react';
import Image from 'gatsby-image';
import { getFixedImageObject } from 'gatsby-transformer-cloudinary/api';

export default () => {
  const [fixed, setFixed] = useState(undefined);

  useEffect(() => {
    getFixedImageObject({
      public_id: 'gatsby-cloudinary/jason',
      cloudName: 'jlengstorf',
      originalHeight: 3024,
      originalWidth: 4032,
    }).then((result) => setFixed(result));
  }, []);

  return fixed ? <Image fixed={fixed} alt="Jason" /> : <p>loading...</p>;
};
```

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
