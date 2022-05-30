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
