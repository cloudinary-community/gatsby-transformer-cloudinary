# 🦄 gatsby-transformer-cloudinary

🏗️ Lets you upload local and remote images to [Cloudinary](https://cloudinary.com/) from within your Gatsby project.

🖼️ Lets you add [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) support to those uploaded images and also to sourced data on existing Cloudinary images.

🦄 Automagically serves the most modern image format your user's browser can support on her device. Like AVIF or WebP!


## Upload Images to Cloudinary 🏗️

Upload images to Cloudinary in two ways:

1. Upload images in `File` nodes to Cloudinary
2. Upload remote images by their URL to Cloudinary

A `CloudinaryAsset` node is created for each image.


## 1. Install plugin 🦄

Our plugin automagically creates childCloudinaryAsset nodes for `File` nodes created by [`gatsby-source-filesystem`](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/).

```bash
npm install --save gatsby-transformer-cloudinary gatsby-source-filesystem
```

```bash
yarn add gatsby-transformer-cloudinary gatsby-source-filesystem
```

### 2. Gatsby Plugin Image 🖼️

Install [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/).

```bash
npm install --save gatsby-plugin-image
```

```bash
yarn add --save gatsby-plugin-image
```

### 3. Get your cloudName, apiKey and apiSecret 🤫

Cloudinary offers a generous free tier which is more than enough to bootstrap projects.
Get your cloudName, apiKey and apiSecret from your [cloudinary console](https://cloudinary.com/console/) when you sign up at [Cloudinary.com](https://cloudinary.com).

### 4. Use .env.development 🔑

Create a `.env.development` file in your project's root and add your `cloudName`, `apiKey` and `apiSecret`.


```js
CLOUDINARY_API_KEY=INSERT `apiKey`
CLOUDINARY_API_SECRET=INSERT `apiSecret`
CLOUDINARY_CLOUD_NAME=INSERT `cloudName`
```

Install `dotenv` in your project.

```bash
npm install dotenv
```

```bash
yarn add dotenv
```

In your `gatsby-config.js` file, require and configure `dotenv`.

```js
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});
```

There are several options to configure `dotenv` to use different env files either in development or production. You can find that [here](https://www.npmjs.com/package/dotenv).

Add your `.env.development` file to `.gitignore` so it's not committed.

### 5. Configure your cloudName, apiKey and apiSecret on deployment 🚀

### 6. Include your plugin in `gatsby-config.js` 🦄

In your `gatsby-config.js` set up `gatsby-transformer-cloudinary` with your cloudName, apiKey and apiSecret. Then point `gatsby-source-filesystem` to images in your app.

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

## 7. How to use 💅

### Upload remote images 🏗️

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

### Use images already on Cloudinary 🖼️

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

To add Gatsby Plugin Image support you need to to add the GraphQL Type of `coverPhoto` GraphQL to the `transformTypes` plugin option array.

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

## Example usage 💄

Here's the plugin in action to fetch a fixed asset using the `useStaticQuery` API of Gatsby:

```jsx
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const SingleImage = () => {
  const data = useStaticQuery(graphql`
    query ExampleQuery {
      cloudinaryAsset(publicId: { eq: "gatsby-cloudinary/jason" }) {
        gatsbyImageData(width: 300, layout: FIXED)
      }
    }
  `);

  const image = getImage(data.cloudinaryAsset);

  return (
    <>
      <GatsbyImage image={image} alt="banner" />
    </>
  );
};

export default SingleImage;
```

### Plugin options 🔌

In `gatsby-config.js` the plugin accepts the following options:

| option                                              | type       | required | default value                     | description                                                                                                                                                                                                                                                               |
| --------------------------------------------------- | ---------- | -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudName`                                         | `String`   | false    | n/a                               | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                   |
| `apiKey`                                            | `String`   | false    | n/a                               | API Key of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                      |
| `apiSecret`                                         | `String`   | false    | n/a                               | API Secret of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.                                                                                   |
| `uploadFolder`                                      | `String`   | false    | n/a                               | An optional folder name where the uploaded assets will be stored on Cloudinary.                                                                                                                                                                                           |
| `uploadSourceInstanceNames`                         | `[String]` | false    | n/a                               | An optional array limiting uploads to file nodes with a matching sourceInstanceName.                                                                                                                                                                                      |
| `transformTypes`                                    | `[String]` | false    | `['CloudinaryAsset']`             | An optional array of GraphQL Types needing Gatsby Image support. Adds the resolvers `gatsbyImageData`, `fluid` (deprecated) and `fixed` (deprecated)).                                                                                                                    |
| `overwriteExisting`                                 | `Boolean`  | false    | false                             | Whether to overwrite existing assets with the same public ID. When set to false, return immediately if an asset with the same Public ID was found. It's recommended that this is set to false in development as each image overwrite costs one Cloudinary transformation. |
| `defaultTransformations` (gatsby-plugin-image only) | `[String]` | false    | ` ['c_fill', 'g_auto', 'q_auto']` | The default value for the `gatsbyImageData` resolver argument `transformations`.                                                                                                                                                                                          |

The options `cloudName`, `apiKey`, and `apiSecret` are required if any images will be uploaded to Cloudinary during the build process. If you're solely using images already uploaded to Cloudinary, then these options can be safely omitted.

> Note: Each derived image created for a breakpoint will consume one Cloudinary transformation. Enable the `useCloudinaryBreakpoints` option with care. If the `createDerived` option is enabled, transformations will only be consumed when the images are first created. However, created images will consume Cloudinary storage space. If `overwriteExisting` is enabled, each image that you upload will consume one transformation each time your Gatsby cache gets cleared and the image gets re-uploaded. For this reason, it's recommended that you keep `overWriteExisting` disabled and instead set the `overwriteExisting` parameter of `createRemoteImageNode` on a per-image basis when you know that an image has actually been updated.

## Gatsby Plugin Image API 🖼️

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

## Running Tests 🧪

Run the tests once:

```
yarn workspace gatsby-transformer-cloudinary test
```

Run the tests in watch mode:

```
yarn workspace gatsby-transformer-cloudinary test:watch
```

## Live demo 🎦

[Live demo](https://gatsby-transformer-cloudinary.netlify.com/) ([source](https://github.com/jlengstorf/gatsby-transformer-cloudinary))

> **DISCLAIMER:** If you try running this demo's source code on your own computer, you might face issues as the demo uses assets and [transformations](https://cloudinary.com/documentation/chained_and_named_transformations#named_transformations) from the author’s Cloudinary account. Before running, please remove them or replace them with images and transformations from your own Cloudinary account.

## Features 🦄

- Upload local project media assets to a secure remote CDN
- Upload remote media assets to a secure remote CDN
- Utilize media assets on Cloudinary in gatsby-plugin-image
- Use gatsby-plugin-image `gatsbyImageData` on Cloudinary assets
- Retrieve media files in optimized formats with responsive breakpoints
- Utilize all Cloudinary transformations including chained transformations in gatsby's data layer


## Other Resources 🧐

- [Cloudinary image transformation reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Try the gatsby-source-cloudinary plugin to source media files into Gatsby file nodes](https://www.npmjs.com/package/gatsby-source-cloudinary)
- [Using Cloudinary image service for media optimization](https://www.gatsbyjs.org/docs/using-cloudinary-image-service/)
- [Learn how this plugin was built with Jason Lengstorf](https://www.learnwithjason.dev/build-a-gatsby-transformer-plugin-for-cloudinary)

## Contribute 🏴‍☠️

Want to contribute to make this tool even better? Feel free to send in issues and pull requests on feature requests, fixes, bugs, typos, performance lapses or any other challenge faced with using this tool.

## License 👑

MIT
