# [4.3.0](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v4.2.0...v4.3.0) (2022-12-21)

### Features

- add Gatsby as a peer dependency ([#220](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/220)) ([890193e](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/890193e82dbdafb9054d6bfe861a655777a5226c)), closes [#219](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/219)

# [4.2.0](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v4.1.0...v4.2.0) (2022-12-20)

### Bug Fixes

- gatsbyImageData generates http urls, not https ([#210](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/210)) ([3508cd3](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/3508cd336d3075c88d8e1498893cfc4ff2c4f5ae)), closes [#209](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/209)
- peer dependency (gatsby-plugin-image) ([#212](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/212)) ([3f40130](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/3f4013082328d57fcbefdea93f813a3a932090f1))

### Features

- allow invalid source data by making gatsbyImageData nullable ([#218](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/218)) ([acf28f9](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/acf28f932a39ed3f864cf44aeb836e401c865692)), closes [#214](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/214)

# [4.1.0](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v4.0.1...v4.1.0) (2022-10-26)

### Features

- validation of plugin options ([#199](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/199)) ([ea27988](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/ea279885a873ab5d212b47e233376ec09a9b27e8))

## [4.0.1](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v4.0.0...v4.0.1) (2022-10-10)

### Performance Improvements

- remove upload code only needed by gatsby-image ([#197](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/197)) ([576f30f](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/576f30f7f04545e8fc614cfeeb50784045d3037b)), closes [#188](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/188)

# [4.0.0](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v3.0.0...v4.0.0) (2022-10-10)

### Features

- remove support for gatsby-image - deprecated Gatsby plugin ([#195](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/195)) ([d451b8e](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/d451b8e17d4bf271bc1f602fadab75d1d67adb87))

### BREAKING CHANGES

- Removed support for gatsby-image (ie. `fixed` and `fluid`), use gatsby-plugin-image (ie. `gatsbyImageData` instead.

# [3.1.0](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v3.0.1...v3.1.0) (2022-12-20)

### Features

- allow invalid source data by making gatsbyImageData nullable ([#218](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/218)) ([acf28f9](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/acf28f932a39ed3f864cf44aeb836e401c865692)), closes [#214](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/214)

## [3.0.1](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/compare/v3.0.0...v3.0.1) (2022-11-30)

### Bug Fixes

- gatsbyImageData generates http urls, not https ([#210](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/210)) ([3508cd3](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/3508cd336d3075c88d8e1498893cfc4ff2c4f5ae)), closes [#209](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/209)
- peer dependency (gatsby-plugin-image) ([#212](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/212)) ([3f40130](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/commit/3f4013082328d57fcbefdea93f813a3a932090f1))
  > > > > > > > main

# Version 3.0.0

Fixes:

- Remove direct mutation of nodes [#156](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/156)

BREAKING CHANGES:

- `CloudinaryAsset` nodes are not added for existing assets described by a content node
- When uploading remote images the relationship between parent and child node must must be handled manually
- `gatsbyImageData`, `fluid` and `fixed` resolvers are only added to GraphQL Types configured using the `transformTypes`

# Version 2.3.0

Additions:

- Support for `gatsby-plugin-image` (adds the `gatsbyImageData` resolver)[#90](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/90)

Improvements:

- `publicId`, `cloudName` and `version` available on CloudinaryAsset nodes [#89](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/89)
- Limit files to upload by utilizing the added `uploadSourceInstanceNames` plugin option [#71](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/71) and [#103](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/103)

# Version 2.2.4

Fixes:

- API key & secret is no longer required when using the plugin for only remote images.

# Version 2.2.1

Additions:

- Added types for `fixedImageObject` and `fluidImageObject`.

Fixes:

- `fixedImageObject` and `fluidImageObject` uses default plugin options properly in runtime.
- Moved `fixedImageObject` and `fluidImageObject` APIs to `/api`. Fixes `fs` error when importing from `index.js`.
- Set default value for `fieldsToSelect` in `fixedImageObject` and `fluidImageObject` to empty array.

# Version 2.2.0

Improvements:

- Only throw an error on missing Cloudinary credentials if those credentials are actually needed to upload an image to Cloudinary.
- base64 images are no longer generated unless a query requesting them is run.
- defaultTracedSVG values are now passed along as tracedSVG values.
- Improved base64 caching so that if a second request for the same base64 image is made before the first response is received, only one request is made.

# Version 2.1.1

Additions:

- Added logging for each time we have to fetch a base64 image from Cloudinary to explain long query steps in the Gatsby build process.

Fixes:

- Fluid images use defaultBase64 images when they are provided.

# Version 2.1.0

Additions:

- Added the ability to use both width and height parameters simultaneously for fixed queries.
- Added the ability to use precomputed base64 images. When precomputed base64 images are used, build times should improve and Cloudinary usage should decrease.

Fixes:

- Deeply nested asset data is now transformed into CloudinaryAsset nodes.

# Version 2.0.0

Changes:

- This is a major version bump to call attention to the change in default behavior introduced in version 1.1.1. (`f_auto` and `q_auto` are no longer added to image URLs by default.)

Fixes:

- Images uploaded using the `createRemoteImageNode` function respect the `overwriteExisting` argument when provided and fall back to using the `overwriteExisting` plugin option.

# Version 1.1.3

Fixes:

- Typo fix.

# Version 1.1.2

Fixes:

- Local images uploaded to Cloudinary now respect the `overwriteExisting` plugin option.

# Version 1.1.1

Changes:

- Added `enableDefaultTransformations` plugin option. When set to true, `f_auto` and `q_auto` are added to all source URLs automatically. Previously, this was on by default. This behavior is now opt-in.

# Version 1.1.0

Additions:

- Added ability to use existing Cloudinary images by marking nodes with `cloudinaryAssetData: true` and providing `cloudName`, `publicId`, `originalHeight`, and `originalWidth` properties.
- Added an optional `height` argument to `fixed` queries.

Improvements:

- Cache base64 images when running queries to prevent duplicate network requests.

Fixes:

- Changed the public_id to be the relative path of files without the extension instead of just the file's name. This fixes an [issue with childrenCloudinaryAsset nodes](https://github.com/cloudinary-devs/gatsby-transformer-cloudinary/issues/42) being created instead of childCloudinaryAsset nodes.

# Version 1.0.1

Additions:

- Added CloudinaryAssetFluidLimitPresentationSize fragment.
- Added presentationHeight and presentationWidth to CloudinaryAssetFluid.

# Version 1.0.0

Breaking changes:

- The default for `fluidMinWidth` has been decreased from 200 to 50 to match Cloudinary defaults.
- The default for `createDerived` has been changed to false.
- The default for `breakpointsMaxImages` has been increased from 5 to 20 to match Cloudinary defaults.
- Breakpoint calculations are no longer requested by default when uploading an image. (This is controlled by the new `useCloudinaryBreakpoints` option.)
- Image uploads no longer overwrite images with the same public ID by default. (This is controlled by the new `overwriteExisting` option.)

Other changes:

- Added `createRemoteImageNode` to allow uploading remote images directly to Cloudinary without downloading them locally first.
- Added Jest tests.
- Added the ability to calculate breakpoints locally to avoid consuming Cloudinary transformation credits while developing.
- Increased the timeout when uploading images to Cloudinary from 60 seconds to 5 minutes.

# Version 0.3.5

- Beginning of changelog.
