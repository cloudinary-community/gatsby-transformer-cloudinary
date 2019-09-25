const fs = require('fs-extra');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

const ALLOWED_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
const DEFAULT_FLUID_WIDTHS = [200, 400, 800, 1200, 1600];
const DEFAULT_FIXED_WIDTH = 400;

const getImageURL = (
  imageData,
  {
    cloudName,
    transformations = [],
    chained = [],
    defaults = ['f_auto', 'q_auto'],
  },
) => {
  const baseURL = 'https://res.cloudinary.com/';
  const allTransformations = [transformations.concat(defaults).join()]
    .concat(chained)
    .join('/');

  const imagePath = [
    cloudName,
    '/image/upload/',
    allTransformations,
    `/v${imageData.version}/`,
    imageData.public_id,
  ]
    .join('')
    .replace('//', '/');

  return baseURL + imagePath;
};

const getBase64 = async url => {
  const result = await axios.get(url, { responseType: 'arraybuffer' });
  const data = Buffer.from(result.data).toString('base64');

  return `data:image/jpeg;base64,${data}`;
};

const getAspectRatio = (transformations, originalAspectRatio) => {
  const arTransform = transformations.find(t => t.startsWith('ar_'));
  if (!arTransform) {
    return originalAspectRatio;
  }

  const newAspectRatio = arTransform.replace('ar_', '');
  if (newAspectRatio.indexOf(':') === -1) {
    return Number(newAspectRatio);
  }

  const [w, h] = newAspectRatio.split(':').map(Number);

  return w / h;
};

exports.onPreExtractQueries = async ({ store, getNodesByType }) => {
  const program = store.getState().program;

  // Check if there are any ImageSharp nodes. If so add fragments for ImageSharp.
  // The fragment will cause an error if there are no ImageSharp nodes.
  if (getNodesByType(`CloudinaryAsset`).length == 0) {
    return;
  }

  // We have CloudinaryAsset nodes so let’s add our fragments to .cache/fragments.
  await fs.copy(
    require.resolve(`./fragments.js`),
    `${program.directory}/.cache/fragments/cloudinary-asset-fragments.js`,
  );
};

exports.createSchemaCustomization = ({ actions, reporter }) => {
  actions.createTypes(`
    type CloudinaryAsset implements Node @dontInfer {
      fixed(
        base64Width: Int
        chained: [String!]
        transformations: [String!]
        width: Int
      ): CloudinaryAssetFixed!
      fluid(
        base64Width: Int
        chained: [String!]
        maxWidth: Int
        transformations: [String!]
      ): CloudinaryAssetFluid!
    }

    type CloudinaryAssetFixed {
      aspectRatio: Float
      base64: String!
      height: Float
      originalName: String
      src: String
      srcSet: String
      width: Float
    }

    type CloudinaryAssetFluid {
      aspectRatio: Float!
      base64: String!
      sizes: String!
      src: String!
      srcSet: String!
    }
  `);
};

exports.createResolvers = ({ createResolvers, reporter }) => {
  const commonResolvers = {
    base64: {
      type: 'String!',
      resolve: async source => {
        const {
          transformations = [],
          chained = [],
          base64Width = 30,
        } = source.args;
        const base64URL = getImageURL(source.result, {
          cloudName: source.cloudName,
          transformations: transformations.concat(`w_${base64Width}`),
          chained,
        });
        const base64 = await getBase64(base64URL);

        return base64;
      },
    },
    src: {
      type: 'String!',
      resolve: source =>
        getImageURL(source.result, {
          cloudName: source.cloudName,
          transformations: source.args.transformations || [],
          chained: source.args.chained || [],
        }),
    },
  };

  const resolvers = {
    CloudinaryAsset: {
      fixed: {
        type: 'CloudinaryAssetFixed!',
        resolve: (
          source,
          {
            base64Width = 30,
            width = DEFAULT_FIXED_WIDTH,
            transformations = [],
            chained = [],
          },
        ) => {
          const aspectRatio = getAspectRatio(
            transformations,
            source.fixed.aspectRatio,
          );

          return {
            ...source.fixed,
            args: { base64Width, width, transformations, chained },
            result: source.result,
            cloudName: source.cloudName,
            height: width / aspectRatio,
            aspectRatio,
            width,
          };
        },
      },
      fluid: {
        type: 'CloudinaryAssetFluid!',
        resolve: (
          source,
          {
            base64Width = 30,
            maxWidth = 650,
            transformations = [],
            chained = [],
          },
        ) => {
          const aspectRatio = getAspectRatio(
            transformations,
            source.fluid.aspectRatio,
          );

          return {
            ...source.fluid,
            args: { base64Width, maxWidth, transformations, chained },
            result: source.result,
            cloudName: source.cloudName,
            aspectRatio,
          };
        },
      },
    },
    CloudinaryAssetFixed: {
      ...commonResolvers,
      srcSet: {
        type: 'String!',
        resolve: source => {
          const { transformations, chained, width } = source.args;
          const originalWidth = source.result.width;

          // Go up to 3x resolution just in case.
          const sizes = [1, 1.5, 2, 3].map(s => ({
            resolution: s,
            width: width * s,
          }));

          return sizes
            .filter(size => size.width <= originalWidth)
            .map(size => {
              // Get URL for each image including user-defined transformations.
              const url = getImageURL(source.result, {
                cloudName: source.cloudName,
                // Add the size at the end to override width for srcSet support.
                transformations: transformations.concat(`w_${size.width}`),
                chained,
              });

              return `${url} ${size.resolution}x`;
            })
            .join();
        },
      },
    },
    CloudinaryAssetFluid: {
      ...commonResolvers,
      srcSet: {
        type: 'String!',
        resolve: source => {
          const { transformations, chained } = source.args;

          // TODO should we handle multiple breakpoint options? How?
          const [{ breakpoints }] = source.result.responsive_breakpoints;

          return breakpoints
            .map(res => res.width) // We only need the widths.
            .map(size => {
              // Get URL for each image including user-defined transformations.
              const url = getImageURL(source.result, {
                cloudName: source.cloudName,
                // Add the size at the end to override width for srcSet support.
                transformations: transformations.concat(`w_${size}`),
                chained,
              });

              return `${url} ${size}w`;
            })
            .join();
        },
      },
    },
  };

  createResolvers(resolvers);
};

exports.onCreateNode = async (
  { node, actions, reporter, createNodeId },
  options,
) => {
  if (!ALLOWED_MEDIA_TYPES.includes(node.internal.mediaType)) {
    return;
  }

  cloudinary.config({
    cloud_name: options.cloudName,
    api_key: options.apiKey,
    api_secret: options.apiSecret,
  });

  const result = await cloudinary.uploader
    .upload(node.absolutePath, {
      folder: options.uploadFolder,
      public_id: node.name,
      responsive_breakpoints: [
        {
          create_derived: true,
          bytes_step: 20000,
          min_width: Math.min(DEFAULT_FLUID_WIDTHS),
          max_width: Math.max(DEFAULT_FLUID_WIDTHS),
          max_images: 20,
        },
      ],
    })
    .catch(error => {
      reporter.panic(error.message, error);
    });

  const maxWidth = Math.min(Math.max(...DEFAULT_FLUID_WIDTHS), result.width);
  const aspectRatio = result.width / result.height;

  const imageNode = {
    // These helper fields are only here so the resolvers have access to them.
    // They will *not* be available via Gatsby’s data layer.
    result,
    cloudName: options.cloudName,

    // The actual data we want to send back lives in `fixed` and `fluid`. Note
    // that some of the fields aren’t present here; they’re processed in the
    // `createResolvers` API hook so we have access to the query arguments.
    fixed: {
      aspectRatio,
    },
    fluid: {
      aspectRatio,
      presentationHeight: maxWidth / aspectRatio,
      presentationWidth: maxWidth,
      sizes: `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`,
    },

    // Add the required internal Gatsby node fields.
    id: createNodeId(`CloudinaryAsset-${node.id}`),
    parent: node.id,
    internal: {
      type: 'CloudinaryAsset',
      // Gatsby uses the content digest to decide when to reprocess a given
      // node. We can use the parent file’s digest to avoid doing extra work.
      contentDigest: node.internal.contentDigest,
    },
  };

  // Add the new node to Gatsby’s data layer.
  actions.createNode(imageNode);

  // Tell Gatsby to add `childCloudinaryAsset` to the parent `File` node.
  actions.createParentChildLink({ parent: node, child: imageNode });
};
