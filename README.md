# Gatsby Transformer Cloudinary

With `gatsby-transformer-cloudinary` you may:

- 🖼️ Add [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) support to any GraphQL Types describing a Cloudinary assets.
- 📤 Upload local and remote images to [Cloudinary](https://cloudinary.com/) from within your Gatsby project.

📥 But if you want to pull data from your Cloudinary account into the Gatsby data layer use our other plugin, [gatsby-source-cloudinary](https://www.github.com/cloudinary-devs/gatsby-source-cloudinary/)

**This is a community library supported by the Cloudinary Developer Experience team.**

## 📖 Table of Contents

- [🖼️ Add Gatsby Image Support to Existing Cloudinary Assets](#🖼️-add-gatsby-image-support-to-existing-cloudinary-assets)
  - [Install Packages](#install-packages)
  - [Configure Plugins](#configure-plugins)
  - [Example usage](#example-usage)
  - [Sanity.io Configuration](#sanityio-configuration)
  - [Contentful Configuration](#contentful-configuration)
- [📤 Upload local images and add Gatsby Image Support](#📤-upload-local-images-and-add-gatsby-image-support)
  - [Install Packages](#install-packages-1)
  - [Configure Plugins](#configure-plugins-1)
  - [Example usage](#example-usage-1)
- [📤 Upload remote images and add Gatsby Image Support](#📤-upload-remote-images-and-add-gatsby-image-support)
  - [Install Packages](#install-packages-2)
  - [Configure Plugins](#configure-plugins-2)
  - [Example Usage](#example-usage-2)
- [🔌 Pugin Options](#🔌-plugin-options)
- [🖼️ Gatsby Image API](#🖼️-gatsby-plugin-image-gatsbyimagedata-api)
- [📚 Other Resources](#📚-other-resources)
- [🏴‍☠️ Contribute](#🏴‍☠️-contribute)

&nbsp;

## 🖼️ Add Gatsby Image Support to Existing Cloudinary Assets

Information about Existing Cloudinary Assets is sourced into the Gatsby data layer using a plugin like [gatsby-source-contentful](https://www.gatsbyjs.com/plugins/gatsby-source-contentful/), [gatsby-source-sanity](https://www.gatsbyjs.com/plugins/gatsby-source-sanity/) etc. or a custom source plugin.

- The plugin adds the `gatsbyImageData` resolver to the sourced GraphQL Types configured.

The GraphQL Type must describe an existing Cloudinary asset and [contain the following data](#transform-type-requierments).

### Install Packages

```bash
npm install gatsby-transformer-cloudinary gatsby-plugin-image
```

or

```bash
yarn add gatsby-transformer-cloudinary gatsby-plugin-image
```

### Configure Plugins

```js
// File: ./gatsby-config.js

module.exports = {
  plugins: [
    // Some source plugin creating a GraphQL Type named `BlogPostHeroImage`
    {
      resolve: `gatsby-transformer-cloudinary`,
      options: {
        transformTypes: [
          // Assumes a GraphQL Type named `BlogPostHeroImage`
          // Could be a `BlogPost` node with a `heroImage` field
          // with the required data shape
          `BlogPostHeroImage`,
        ],
        // Optional transformation option
        defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
      },
    },
    `gatsby-plugin-image`,
  ],
};
```

### Example Usage

```jsx
// File: ./pages/{BlogPost.slug}.js

import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const BlogPost = ({ data }) => {
  const { blogPost } = data;
  const gatsbyImage = getImage(blogPost.heroImage);
  return (
    <article>
      <h1>{blogPost.title}</h1>
      <GatsbyImage image={gatsbyImage} aria-hidden="true" alt="Hero Image" />
      {/* ... */}
    </article>
  );
};

export const query = graphql`
  query BlogPostById($id: String!) {
    blogPost(id: { eq: $id }) {
      title
      heroImage {
        gatsbyImageData(
          height: 300
          aspectRatio: 2
          placeholder: TRACED_SVG
          transformations: ["c_fill", "e_grayscale"]
        )
      }
    }
  }
`;

export default BlogPost;
```

### Transform Type Requirements

Gatsby Image support may be added to any GraphQL Type describing a Cloudinary asset with the following data:

```js
{
  // Required
  cloud_name: "my-amazing-blog",
  public_id: "blue-blue-blue",
  // Optional: Saves a network request for size/format data per image queried if all are added
  heigh: 360,
  width: 820,
  format: "jpg",
  // Optional: Saves a Cloudinary transformation per image queried with `placeholder=BLURRED` as this value will be used instead
  base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMXG/8HwAEwAI0Bj1bnwAAAABJRU5ErkJggg==",
  // Optional: Saves a Cloudinary transformation per image queried with `placeholder=TRACED_SVG` as this value will be used instead
  tracedSVG: "data:image/svg+xml,%3Csvg%20height%3D%229999%22%20viewBox%3D%220%200%209999%209999%22%20width%3D%229999%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m0%200h9999v9999h-9999z%22%20fill%3D%22%23f9fafb%22%2F%3E%3C%2Fsvg%3E",
}
```

If the GraphQL Type does not have the required data shape, you may configure how to resolve the data using the `transformTypes` configuration option:

```js
// File: ./gatsby-config.js

module.exports = {
  plugins: [
    // Some source plugin creating a GraphQL Type named `BlogPostHeroImage`
    {
      resolve: `gatsby-transformer-cloudinary`,
      options: {
        transformTypes: [
          {
            type: `CustomType`,
            // Use a static value
            cloudName: 'my-cloud',
            // Resolve a value using a function
            height: (data) => data.metadata?.height,
          },
        ],
        // Optional transformation option
        defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
      },
    },
    `gatsby-plugin-image`,
  ],
};
```

To find the GraphQL Type describing your Cloudinary assets use the built-in [GraphiQL exlorer](https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/)](https://www.gatsbyjs.com/docs/how-to/querying-data/running-queries-with-graphiql/). Either hover over the field describing the asset or look in the "Documentation Explorer".

`defaultBase64` and `defaultTracedSVG` is the base64 URI of the placeholder image, it must comply with [RFC 2397](https://tools.ietf.org/html/rfc2397).

### Sanity.io Configuration

If you are using [Sanity.io](https://www.sanity.io/) and the [gatsby-source-sanity](https://www.gatsbyjs.com/plugins/gatsby-source-sanity/) plugin use the following configuration to add the `gatsbyImageData` resolver to the sourced Sanity Cloudinary assets:

```js
// File: ./gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-sanity`,
      options: {
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        token: process.env.SANITY_TOKEN,
      },
    },
    {
      resolve: `gatsby-transformer-cloudinary`,
      options: {
        transformTypes: [
          {
            type: 'SanityCloudinaryAsset',
            mapping: {
              // Dynamically get the cloud name
              // from SanityCloudinaryAsset.url
              cloudName: (data) => {
                const findCloudName = new RegExp(
                  '(cloudinary.com/)([^/]+)',
                  'i'
                );
                const result = data.url.match(findCloudName);
                return result[1];
              },
              // Or set it statically if all assets are from the same cloud
              // cloudName: "my-cloud",
            },
          },
        ],
      },
    },
    `gatsby-plugin-image`,
  ],
};
```

### Contentful Configuration

If you are using [Contentful](https://www.contentful.com/) and the [gatsby-source-contentful](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-contentful) plugin use the following configuration to add the `gatsbyImageData` resolver to the sourced Cloudinary assets:

```js
// File: ./gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-transformer-cloudinary`,
      options: {
        transformTypes: [
          {
            // ❗❕ Replace `contentfulBlogPostFeaturedImageJsonNode`
            // with the name of the GraphQL Type describing your Cloudinary assets
            // will always start with `contentful` and end with `JsonNode`
            type: 'contentfulBlogPostFeaturedImageJsonNode',
            mapping: {
              // Dynamically get the cloud name
              // from SanityCloudinaryAsset.url
              cloudName: (data) => {
                const findCloudName = new RegExp(
                  '(cloudinary.com/)([^/]+)',
                  'i'
                );
                const result = data.url.match(findCloudName);
                return result[1];
              },
              // Or set it statically if all assets are from the same cloud
              // cloudName: "my-cloud",
            },
          },
        ],
      },
    },
    `gatsby-plugin-image`,
  ],
};
```

&nbsp;

## 📤 Upload Local Images and Add Gatsby Image Support

If you upload local images to Cloudinary and skip the gatsby-transformer-sharp you speed up your build process and enjoy Cloudinary's transformations:

- The plugin creates a `CloudinaryAsset` node for each image.
- The plugin adds a `gatsbyImageData` resolver to each node by default.

This configuration and example assumes you have your images folder in the root of your project.

### Install packages

```bash
npm install gatsby-transformer-cloudinary gatsby-source-filesystem gatsby-plugin-image
```

or

```bash
yarn add gatsby-transformer-cloudinary gatsby-source-filesystem gatsby-plugin-image
```

### Configure plugins

```js
// File: ./gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `gallery`,
        path: `${__dirname}/gallery`,
      },
    },
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        // Required for uploading
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        // Optional uploading options
        uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER,
        uploadSourceInstanceNames: ['gallery'],
        overwriteExisting: process.env.NODE_ENV === 'production' ? true : false,
        // Optional transformation options
        transformTypes: ['CloudinaryAsset'],
        defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
      },
    },
  ],
};
```

`process.env` ⁉️ Read about [env variables in the Gatsby docs](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

### Example Usage

Example of the plugin fetching an asset using the `useStaticQuery` API of Gatsby:

```jsx
// File ./components/local-upload.js

import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const LocalUploadExample = () => {
  // Using gatsby-transformer-sharp
  // commented out for comparison

  // const data = useStaticQuery(graphql`
  //   query {
  //     file(name: { eq: "sergey-semin-unsplash" }) {
  //       childImageSharp {
  //         gatsbyImageData(height: 300, layout: FIXED)
  //       }
  //     }
  //   }
  // `);

  const data = useStaticQuery(graphql`
    query {
      file(name: { eq: "sergey-semin-unsplash" }) {
        childCloudinaryAsset {
          gatsbyImageData(height: 300, layout: FIXED)
        }
      }
    }
  `);

  // const gatsbyImage = getImage(data.file.childImageSharp);
  const gatsbyImage = getImage(data.file.childCloudinaryAsset);

  return (
    <GatsbyImage
      image={gatsbyImage}
      alt="Pirate photo by Sergey Semin from Unsplash."
    />
  );
};

export default LocalUploadExample;
```

&nbsp;

## 📤 Upload Remote Images and add Gatsby Image Support

Upload remote images referenced in any node to Cloudinary and enjoy Cloudinary's transformations:

- The plugin creates a `CloudinaryAsset` node for each image.
- The plugin adds the `gatsbyImageData` resolver to each node by default.

Uploading remote image requires you to write some custom code. We'd like to make it configurable instead, let us know if you'd benefit by [joining the discussion](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/discussions/207).

This configuration and example assumes your Gatsby Data Layer has at least one node of type `Project` with a `coverImageUrl` field containg a url pointing to a publically available image file.

### Install Packages

```bash
npm install gatsby-transformer-cloudinary gatsby-plugin-image
```

or

```bash
yarn add gatsby-transformer-cloudinary gatsby-plugin-image
```

### Configure Plugins

```js
// File: ./gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        // Required for uploading
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        // Optional uploading options
        uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER,
        overwriteExisting: process.env.NODE_ENV === 'production' ? true : false,
        // Optional transformation options
        transformTypes: ['CloudinaryAsset'],
        defaultTransformations: ['c_fill', 'g_auto', 'q_auto'],
      },
    },
  ],
};
```

`process.env` ⁉️ Read about [env variables in the Gatsby docs](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

### Example Usage

```js
// File: ./gatsby-node.js

import { createRemoteImageNode } from 'gatsby-transformer-cloudinary';

export async function onCreateNode({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
  reporter,
}) {
  if (node.internal.type === 'Project' && node.coverImageUrl) {
    // Upload the image to Cloudinary
    const imageNode = await createRemoteImageNode({
      url: node.coverImageUrl,
      parentNode: node,
      createNode,
      createNodeId,
      createContentDigest,
      reporter,
    });

    // Add node field to be used by "createSchemaCustomization"
    createNodeField({ node: node, name: 'coverImage', value: imageNode.id });
  }
}

exports.createSchemaCustomization = (gatsbyUtils) => {
  const { actions } = gatsbyUtils;

  // Connect the node to the CloudinaryAsset using @link
  const ProjectType = `
      type Project implements Node  {
        coverImageUrl: String!
        coverImage: CloudinaryAsset @link(from: "fields.coverImage" by: "id")
      }
    `;

  actions.createTypes([ProjectType]);
};
```

```jsx
// File: ./pages/{Article.slug}.js

import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const Project = ({ data }) => {
  const { project } = data;
  const gatsbyImage = getImage(project.coverImage);
  return (
    <article>
      <h1>{project.name}</h1>
      <GatsbyImage image={gatsbyImage} aria-hidden="true" alt="Cover Image" />
      {/* ... */}
    </article>
  );
};

export const query = graphql`
  query ProjectById($id: String!) {
    project(id: { eq: $id }) {
      name
      coverImage {
        gatsbyImageData(
          height: 300
          aspectRatio: 2
          placeholder: TRACED_SVG
          transformations: ["c_fill", "g_auto:subject", "q_auto"]
        )
      }
    }
  }
`;

export default Project;
```

&nbsp;

## 🔌 Plugin Options

In `gatsby-config.js` the plugin accepts the following options:

### `cloudName` (required for upload functionality)

You'll find your Cloudinary account's `cloudName` in your [Cloudinary console](https://cloudinary.com/console/).

**Type:** `String`\
**Default:** n/a\
**Note:** Store and retrieve your `cloudName` as [an environment variable](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

### `apiKey` (required for upload functionality)

You'll find your Cloudinary API Key in the [Cloudinary console](https://cloudinary.com/console/).

**Type:** `String`\
**Default:** n/a\
**Note:** Store and retrieve your `apiKey` as [an environment variable](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

### `apiSecret` (required for upload functionality)

You'll find your Cloudinary API Secret in your [Cloudinary console](https://cloudinary.com/console/).

#### `secure`

When set to `false` uses `http` instead of `https` for the image urls.

**Type:** `Boolean`
**Default:** `true`

#### `height` / `width`

**Type:** `String`\
**Default:** n/a\
**Note:** Store and retrieve your `apiSecret` as [an environment variable](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/).

### `uploadFolder`

An optional folder name where the uploaded assets will be stored on Cloudinary.

**Type:** `String`\
**Default:** n/a\

### `uploadSourceInstanceNames`

An optional array limiting uploads to file nodes with a matching `sourceInstanceName`.

**Type:** `[String]`\
**Default:** n/a\

### `transformTypes`

An optional array of GraphQL Types to add the `gatsbyImageData` resolver for Gatsby Image support.

**Type:** `[String] | [Object]`\
**Default:** `['CloudinaryAsset']`

### `overwriteExisting`

Whether to overwrite existing assets with the same public ID. When set to false, return immediately if an asset with the same Public ID was found. It's recommended that this is set to false in development as each image overwrite costs one Cloudinary transformation.

**Type:** `Boolean`\
**Default:** `false`

### `defaultTransformations`

The default value for the `gatsbyImageData` resolver argument `transformations`.

**Type:** `[String]`\
**Default:** `['c_fill', 'g_auto', 'q_auto']`

&nbsp;

## 🖼️ Gatsby Plugin Image (`gatsbyImageData`) API

The plugin supports [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) by adding a `gatsbyImageData` resolver to the configured GraphQL types.

### Arguments for `gatsbyImageData`

#### `transformations`

An array of "raw" cloudinary transformations added to the initial transformation together with the `width` and `height`.

**Type:** `[String]`\
**Default:**`["c_fill", "g_auto", "q_auto"]` or the configured `defaultTransformations`\
**Example:** `["c_crop", "x_300"]`

> **WARNING:** Changing the sizing using transformations will mess with the Gatsby Image Component

#### `chained`

An array of "raw" cloudinary transformations added after the initial transformations above.

**Type:** `[String]`\
**Default:** `[]`\
**Example:** `["e_grayscale","e_pixelate_faces,e_tint:100:663399:0p:white:100p"]`

> **WARNING:** Changing the sizing using chained transformations will mess with the Gatsby Image Component

#### `placeholder`

The style of the temporary image shown while the larger image is loaded.

**Type:** `NONE`, `BLURRED` or `TRACED_SVG`\
**Default:** `NONE`\
**Example:** `BLURRED`

> **NOTE:** `DOMINANT_COLOR` is not supported

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#placeholder) for more information.

#### `height` / `width`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#widthheight) on `height` / `width`.

#### `aspectRatio`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#aspectratio) on `aspectRatio`.

#### `layout`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#layout) on `layout`.

#### `backgroundColor`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#all-options) on `backgroundColor`.

#### `breakpoints`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#all-options) on `breakpoints`.

#### `outputPixelDensities`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image#all-options) on `outputPixelDensities`.

#### `sizes`

Read the [Gatsby Plugin Image Docs](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-plugin-image/#all-options) on `sizes`.

### `secure`

When set to `false` use non-secure URLs (`http`) instead of secure URLs(`https`) for the image URLs.

**Type:** `Boolean`\
**Default:** `true`

### `secureDistribution`

The custom domain name (CNAME) to use for building secure URLs (`https`).

Relevant only for users on the Advanced plan or higher that have a custom CNAME. For details, see [Private CDNs and CNAMEs](https://cloudinary.com/documentation/advanced_url_delivery_options#private_cdns_and_cnames).

**Type:** `String`\
**Default:** n/a

### `cname`

The custom domain name (CNAME) to use for building non-secure URLs (`http`), remember to set `secure` to `false` when using `cname`.

Relevant only for users on the Advanced plan or higher that have a custom CNAME. For details, see [Private CDNs and CNAMEs](https://cloudinary.com/documentation/advanced_url_delivery_options#private_cdns_and_cnames).

**Type:** `String`\
**Default:** n/a

### `privateCdn`

Relevant only for users on the Advanced plan or higher that have private CDN distribution. For details, see [Private CDNs and CNAMEs](https://cloudinary.com/documentation/advanced_url_delivery_options#private_cdns_and_cnames).

**Type:** `Boolean`\
**Default:** `false`

&nbsp;

## 📚 Other Resources

- [Cloudinary image transformation reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Try the gatsby-source-cloudinary plugin to source media files into Gatsby file nodes](https://www.npmjs.com/package/gatsby-source-cloudinary)
- [Using Cloudinary image service for media optimization](https://www.gatsbyjs.org/docs/using-cloudinary-image-service/)
- [Watch Jason Lengstorf build this plugin's first version](https://www.learnwithjason.dev/build-a-gatsby-transformer-plugin-for-cloudinary)

&nbsp;

## 🏴‍☠️ Contribute

You may improve the documentation, help fellow users, report bugs, suggest enhancements, contribute code and more.

Get started by reading the [contribution docs](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/blob/main/CONTRIBUTING.md).
