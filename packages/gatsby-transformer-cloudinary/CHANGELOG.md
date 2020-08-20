# Version Next

Additions:

- Added ability to use existing Cloudinary images by marking nodes with `cloudinaryAssetData: true` and providing `cloudName`, `publicId`, `originalHeight`, and `originalWidth` properties.

Improvements:

- Cached base64 images when running queries to prevent duplicate network requests.


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
