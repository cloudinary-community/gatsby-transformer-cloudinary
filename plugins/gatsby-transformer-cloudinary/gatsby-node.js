const axios = require("axios")
const cloudinary = require("cloudinary").v2

const ALLOWED_MEDIA_TYPES = ["image/png", "image/jpeg"]

// 1. Define the schema for the transformed node
exports.createSchemaCustomization = ({ actions, reporter }) => {
  actions.createTypes(`
    type CloudinaryAsset implements Node @dontInfer {
      aspectRatio: Float!
      base64: String!
      sizes: String!
      src(transformations: [String]): String!
      srcSet(sizes: [Int] transformations: [String]): String!
    }
  `)
}

const getImageURL = (
  imageData,
  { cloudName, transformations = [], defaults = ["f_auto", "q_auto"] }
) => {
  const baseURL = "https://res.cloudinary.com/"
  const imagePath = [
    cloudName,
    "/image/upload/",
    transformations.concat(defaults).join(),
    `/v${imageData.version}/`,
    imageData.public_id,
  ]
    .join("")
    .replace("//", "/")

  return baseURL + imagePath
}

exports.createResolvers = ({ createResolvers, reporter }) => {
  const resolvers = {
    CloudinaryAsset: {
      src: {
        type: "String!",
        resolve: (source, { transformations = [] }, context, info) =>
          getImageURL(source.result, {
            cloudName: source.cloudName,
            transformations,
          }),
      },
      srcSet: {
        type: "String!",
        resolve: (
          source,
          { sizes = [160, 320, 640, 1280], transformations = [] }
        ) => {
          console.log("hello?")
          const srcSet = sizes
            .map(size => {
              const url = getImageURL(source.result, {
                cloudName: source.cloudName,
                transformations: transformations.concat(`w_${size}`),
              })

              return `${url} ${size}px`
            })
            .join()
          reporter.info(srcSet)
          return srcSet
        },
      },
    },
  }

  createResolvers(resolvers)
}

// 2. Upload the file to Cloudinary
// 3. Get the URL for the uploaded asset
// 4. Apply transformations for the requested size
// 5. Get a Base64 version of the image at 30px

exports.onCreateNode = async (
  { node, actions, reporter, createNodeId },
  options
) => {
  if (!ALLOWED_MEDIA_TYPES.includes(node.internal.mediaType)) {
    return
  }

  cloudinary.config({
    cloud_name: options.cloudName,
    api_key: options.apiKey,
    api_secret: options.apiSecret,
  })

  const result = await cloudinary.uploader
    .upload(node.absolutePath, {
      folder: options.uploadFolder,
      public_id: node.name,
    })
    .catch(error => {
      reporter.info(JSON.stringify(error))
      reporter.panic(error.message, error)
    })

  const getBase64 = async url => {
    const result = await axios.get(url, { responseType: "arraybuffer" })
    const data = Buffer.from(result.data).toString("base64")

    return `data:image/jpeg;base64,${data}`
  }

  const srcSetWidths = [160, 320, 640, 1280]

  // const base64URL = getImageURL(result, ["w_30"])
  // const base64 = await getBase64(base64URL)

  const imageNode = {
    result,
    cloudName: options.cloudName,
    id: createNodeId(`CloudinaryAsset-${node.id}`),
    aspectRatio: result.width / result.height,
    base64: "boop",
    sizes: `(max-width: ${srcSetWidths.slice(-1)[0]}px) 100vw, ${
      srcSetWidths.slice(-1)[0]
    }px`,
    // src: getImageURL(result),
    // srcSet: srcSetWidths
    //   .map(width => {
    //     const url = getImageURL(result, [`w_${width}`])
    //     return `${url} ${width}w`
    //   })
    //   .join(),
    parent: node.id,
    internal: {
      type: "CloudinaryAsset",
      contentDigest: node.internal.contentDigest,
    },
  }

  actions.createNode(imageNode)
  actions.createParentChildLink({ parent: node, child: imageNode })
}
