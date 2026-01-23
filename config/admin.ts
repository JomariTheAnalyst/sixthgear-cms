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
    enabled: env.bool("PREVIEW_ENABLED", true),
    config: {
      // CRITICAL: Allow iframe from /ph path (not just root)
      allowedOrigins: [
        env("CLIENT_URL", "http://localhost:8000"),
        `${env("CLIENT_URL", "http://localhost:8000")}/ph`,
        `${env("CLIENT_URL", "http://localhost:8000")}/us`,
        `${env("CLIENT_URL", "http://localhost:8000")}/sg`,
        `${env("CLIENT_URL", "http://localhost:8000")}/my`,
      ],
      async handler(uid, { documentId, locale, status }) {
        // Get environment variables with fallbacks for local development
        let previewUrl = env("PREVIEW_URL") || env("CLIENT_URL", "http://localhost:8000")
        const previewSecret = env("PREVIEW_SECRET")

        // CRITICAL: Ensure preview URL is absolute (starts with http:// or https://)
        if (previewUrl && !previewUrl.startsWith("http://") && !previewUrl.startsWith("https://")) {
          previewUrl = `https://${previewUrl}`
        }

        // Default locale if not provided
        const countryCode = locale || "ph"

        // Log configuration for debugging
        console.log("[Preview] Configuration:", {
          previewUrl,
          hasSecret: !!previewSecret,
          uid,
          documentId,
          status,
          locale,
          countryCode,
        })

        if (!previewUrl || !previewSecret) {
          console.error(
            "[Preview] ERROR: Missing required environment variables!",
            {
              PREVIEW_URL: !!previewUrl,
              PREVIEW_SECRET: !!previewSecret,
            }
          )
          return null
        }

        // Build ABSOLUTE preview URL with all necessary parameters
        // CRITICAL: Must be absolute URL (https://...) not relative (/api/preview)
        const url = new URL(`${previewUrl}/api/preview`)
        url.searchParams.set("secret", previewSecret)
        url.searchParams.set("uid", uid)
        url.searchParams.set("documentId", documentId)
        url.searchParams.set("status", status)
        url.searchParams.set("locale", countryCode) // Always set locale

        const absoluteUrl = url.toString()
        console.log(`[Preview] ✅ Generated ABSOLUTE preview URL for ${uid}:`, absoluteUrl)

        // Verify it's absolute
        if (!absoluteUrl.startsWith("http://") && !absoluteUrl.startsWith("https://")) {
          console.error("[Preview] ERROR: Generated URL is not absolute!", absoluteUrl)
          return null
        }

        return absoluteUrl
      },
    },
  },
});
