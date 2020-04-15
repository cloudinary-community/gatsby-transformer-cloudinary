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
        uploadFolder: 'gatsby-cloudinary',
        
      },
    },
  ],
};
```

### Plugin options
In `gatsby-config.js` the plugin accepts the following options:

| option                 | type    | required | default value | description                                                                                                                                                                             |
|------------------------|---------|----------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cloudName`            | string  | true     | n/a           | Cloud name of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable. |
| `apiKey`               | string  | true     | n/a           | API Key of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable.    |
| `apiSecret`            | string  | true     | n/a           | API Secret of your Cloudinary account, can be obtained from your [Cloudinary console](https://cloudinary.com/console/). This should be stored and retrieved as an environment variable. |
| `uploadFolder`         | string  | false    | n/a           | This is the name of the folder the images will be uploaded to on Cloudinary. It will be created on Cloudinary if it is not specified.                                                   |
| `fluidMaxWidth`        | integer | false    | 1000          | Max width set for responsive breakpoints images generated and returned on image upload.                                                                                                 |
| `fluidMinWidth`        | integer | false    | 200           | Min width set for responsive breakpoints images generated and returned on image upload.                                                                                                 |
| `createDerived`        | boolean | false    | true          | This option is specifies the creation of derived images using the specified fluidMinWidth and fluidMaxWidth dimensions specified.                                                       |
| `breakpointsMaxImages` | integer | false    | 5             | Set maximum number of responsive breakpoint images generated and returned on image upload.                                                                                              |

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

## Other Resources
- [Cloudinary image transformation reference](https://cloudinary.com/documentation/image_transformation_reference)
- [Try the gatsby-source-cloudinary plugin to source media files into Gatsby file nodes](https://www.npmjs.com/package/gatsby-source-cloudinary)
- [Using Cloudinary image service for media optimization](https://www.gatsbyjs.org/docs/using-cloudinary-image-service/)
- [Learn how this plugin was built with Jason Lengstorf](https://www.learnwithjason.dev/build-a-gatsby-transformer-plugin-for-cloudinary)

## Contribute
Want to contribute to make this tool even better? Feel free to send in issues and pull requests on feature requests, fixes, bugs, typos, performance lapses or any other challenge faced with using this tool.

## License
MIT 
