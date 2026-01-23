import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Create default admin user with specific email if it doesn't exist
    const defaultAdminEmail = "admin@sixthgearmoto.com";
    const defaultPassword = "SixthGear2025!";

    const existingAdmin = await strapi.query("admin::user").findOne({
      where: { email: defaultAdminEmail },
    });

    if (!existingAdmin) {
      const adminRole = await strapi.query("admin::role").findOne({
        where: { code: "strapi-super-admin" },
      });

      if (adminRole) {
        // Use Strapi's admin service to create user with properly hashed password
        const hashedPassword = await strapi.service("admin::auth").hashPassword(defaultPassword);

        await strapi.query("admin::user").create({
          data: {
            username: "admin",
            email: defaultAdminEmail,
            firstname: "Admin",
            lastname: "SixthGear",
            password: hashedPassword,
            isActive: true,
            roles: [adminRole.id],
            registrationToken: null,
          },
        });

        console.log("");
        console.log("========================================");
        console.log("✅ Default admin user created!");
        console.log("========================================");
        console.log("Email:    admin@sixthgearmoto.com");
        console.log("Password: SixthGear2025!");
        console.log("========================================");
        console.log("⚠️  Please change this password after first login!");
        console.log("========================================");
        console.log("");
      }
    } else {
      console.log("");
      console.log("========================================");
      console.log("ℹ️  Admin user already exists");
      console.log("========================================");
      console.log("Email: admin@sixthgearmoto.com");
      console.log("========================================");
      console.log("");
    }
  },
};
