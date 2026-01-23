export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  secrets: {
    encryptionKey: env("ENCRYPTION_KEY"),
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
  // Preview button configuration
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env("CLIENT_URL"),
      async handler(uid, { documentId, locale, status }) {
        const previewUrl = env("PREVIEW_URL")
        const previewSecret = env("PREVIEW_SECRET")

        if (!previewUrl || !previewSecret) {
          console.warn(
            "[Preview] Missing PREVIEW_URL or PREVIEW_SECRET environment variables"
          )
          return null
        }

        // Map content types to their preview URLs
        const contentTypeMap: Record<string, string> = {
          "api::home.home": "/ph", // Home page (with country code)
          // Add more content types as needed:
          // "api::page.page": `/ph/pages/${documentId}`,
          // "api::blog-post.blog-post": `/ph/blog/${documentId}`,
        }

        // Get the preview path for this content type
        const previewPath = contentTypeMap[uid]

        if (!previewPath) {
          // Content type not configured for preview
          console.log(`[Preview] No preview configured for content type: ${uid}`)
          return null
        }

        // Build preview URL with all necessary parameters
        const url = new URL(`${previewUrl}/api/preview`)
        url.searchParams.set("secret", previewSecret)
        url.searchParams.set("uid", uid)
        url.searchParams.set("documentId", documentId)
        url.searchParams.set("status", status)
        if (locale) {
          url.searchParams.set("locale", locale)
        }

        console.log(`[Preview] Generated preview URL for ${uid}:`, url.toString())

        return url.toString()
      },
    },
  },
});
