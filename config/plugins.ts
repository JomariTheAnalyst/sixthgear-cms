export default ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env("R2_ACCESS_KEY_ID"),
            secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
          },
          region: env("R2_REGION", "auto"),
          endpoint: env("R2_ENDPOINT"),
          params: {
            Bucket: env("R2_BUCKET"),
          },
          forcePathStyle: true,
        },
        baseUrl: env("R2_PUBLIC_URL"),
        rootPath: env("R2_PREFIX"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
