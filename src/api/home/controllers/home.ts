/**
 * home controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::home.home",
  ({ strapi }) => ({
    async find(ctx) {
      // Call the default core action
      const { data, meta } = await super.find(ctx);

      // Manually populate images in nested components
      if (data?.blocks) {
        for (const block of data.blocks) {
          // Populate coffee images in coffee-showcase block
          if (
            block.__component === "sections.coffee-showcase" &&
            block.coffees
          ) {
            for (let i = 0; i < block.coffees.length; i++) {
              const coffeeId = block.coffees[i].id;

              try {
                const imageLink = await strapi.db.connection
                  .select("file_id")
                  .from("files_related_mph")
                  .where({
                    related_id: coffeeId,
                    related_type: "shared.coffees",
                    field: "coffee_image",
                  })
                  .first();

                if (imageLink && imageLink.file_id) {
                  const image = await strapi.entityService.findOne(
                    "plugin::upload.file",
                    imageLink.file_id,
                  );

                  if (image) {
                    block.coffees[i].coffee_image = image;
                  }
                }
              } catch (error) {
                strapi.log.error("Error populating coffee image:", error);
              }
            }
          }

          // Populate service images in moto-services block
          if (
            block.__component === "sections.moto-services" &&
            block.services
          ) {
            for (let i = 0; i < block.services.length; i++) {
              const serviceId = block.services[i].id;

              try {
                const imageLink = await strapi.db.connection
                  .select("file_id")
                  .from("files_related_mph")
                  .where({
                    related_id: serviceId,
                    related_type: "shared.service-cards",
                    field: "services_image",
                  })
                  .first();

                if (imageLink && imageLink.file_id) {
                  const image = await strapi.entityService.findOne(
                    "plugin::upload.file",
                    imageLink.file_id,
                  );

                  if (image) {
                    block.services[i].services_image = image;
                  }
                }
              } catch (error) {
                strapi.log.error("Error populating service image:", error);
              }
            }
          }

          // Populate brand images in shop-by-brands block
          if (block.__component === "sections.shop-by-brands" && block.brands) {
            for (let i = 0; i < block.brands.length; i++) {
              const brandId = block.brands[i].id;

              try {
                // brand_image is Multiple Media, so fetch all linked images
                const imageLinks = await strapi.db.connection
                  .select("file_id", "order")
                  .from("files_related_mph")
                  .where({
                    related_id: brandId,
                    related_type: "shared.partner-brands",
                    field: "brand_image",
                  })
                  .orderBy("order", "asc");

                if (imageLinks && imageLinks.length > 0) {
                  const images = [];
                  for (const link of imageLinks) {
                    const image = await strapi.entityService.findOne(
                      "plugin::upload.file",
                      link.file_id,
                    );
                    if (image) {
                      images.push(image);
                    }
                  }

                  if (images.length > 0) {
                    block.brands[i].brand_image = images;
                  }
                }
              } catch (error) {
                strapi.log.error("Error populating brand images:", error);
              }
            }
          }

          // Populate experience images in space-and-experience block
          if (
            block.__component === "sections.our-space-and-experience-section" &&
            block.experience
          ) {
            for (let i = 0; i < block.experience.length; i++) {
              const experienceId = block.experience[i].id;

              try {
                // experience_image is Multiple Media, so fetch all linked images
                const imageLinks = await strapi.db.connection
                  .select("file_id", "order")
                  .from("files_related_mph")
                  .where({
                    related_id: experienceId,
                    related_type: "shared.space-and-experience",
                    field: "experience_image",
                  })
                  .orderBy("order", "asc");

                if (imageLinks && imageLinks.length > 0) {
                  const images = [];
                  for (const link of imageLinks) {
                    const image = await strapi.entityService.findOne(
                      "plugin::upload.file",
                      link.file_id,
                    );
                    if (image) {
                      images.push(image);
                    }
                  }

                  if (images.length > 0) {
                    block.experience[i].experience_image = images;
                  }
                }
              } catch (error) {
                strapi.log.error("Error populating experience images:", error);
              }
            }
          }

          // Populate customer images in satisfied-customers block (Row 1)
          if (
            block.__component === "sections.satisfied-customers-section" &&
            block.customers
          ) {
            for (let i = 0; i < block.customers.length; i++) {
              const customerId = block.customers[i].id;

              try {
                // customer_image is Multiple Media, so fetch all linked images
                const imageLinks = await strapi.db.connection
                  .select("file_id", "order")
                  .from("files_related_mph")
                  .where({
                    related_id: customerId,
                    related_type: "shared.satisfied-customers",
                    field: "customer_image",
                  })
                  .orderBy("order", "asc");

                if (imageLinks && imageLinks.length > 0) {
                  const images = [];
                  for (const link of imageLinks) {
                    const image = await strapi.entityService.findOne(
                      "plugin::upload.file",
                      link.file_id,
                    );
                    if (image) {
                      images.push(image);
                    }
                  }

                  if (images.length > 0) {
                    block.customers[i].customer_image = images;
                  }
                }
              } catch (error) {
                strapi.log.error(
                  "Error populating customer images (row1):",
                  error,
                );
              }
            }
          }

          // Populate customer images in satisfied-customers block (Row 2)
          if (
            block.__component === "sections.satisfied-customers-section" &&
            block.row2_customers
          ) {
            for (let i = 0; i < block.row2_customers.length; i++) {
              const customerId = block.row2_customers[i].id;

              try {
                // customer_image is Multiple Media, so fetch all linked images
                const imageLinks = await strapi.db.connection
                  .select("file_id", "order")
                  .from("files_related_mph")
                  .where({
                    related_id: customerId,
                    related_type: "shared.satisfied-customers-row-2",
                    field: "customer_image",
                  })
                  .orderBy("order", "asc");

                if (imageLinks && imageLinks.length > 0) {
                  const images = [];
                  for (const link of imageLinks) {
                    const image = await strapi.entityService.findOne(
                      "plugin::upload.file",
                      link.file_id,
                    );
                    if (image) {
                      images.push(image);
                    }
                  }

                  if (images.length > 0) {
                    block.row2_customers[i].customer_image = images;
                  }
                }
              } catch (error) {
                strapi.log.error(
                  "Error populating customer images (row2):",
                  error,
                );
              }
            }
          }

          // Populate story images in rider-stories-section block
          if (
            block.__component === "sections.rider-stories-section" &&
            block.rider_stories
          ) {
            for (let i = 0; i < block.rider_stories.length; i++) {
              const storyId = block.rider_stories[i].id;

              try {
                // image is Multiple Media, so fetch all linked images
                const imageLinks = await strapi.db.connection
                  .select("file_id", "order")
                  .from("files_related_mph")
                  .where({
                    related_id: storyId,
                    related_type: "shared.rider-stories",
                    field: "image",
                  })
                  .orderBy("order", "asc");

                if (imageLinks && imageLinks.length > 0) {
                  const images = [];
                  for (const link of imageLinks) {
                    const image = await strapi.entityService.findOne(
                      "plugin::upload.file",
                      link.file_id,
                    );
                    if (image) {
                      images.push(image);
                    }
                  }

                  if (images.length > 0) {
                    block.rider_stories[i].image = images;
                  }
                }
              } catch (error) {
                strapi.log.error("Error populating story images:", error);
              }
            }
          }

          // Populate team images in our-team-section block
          if (
            block.__component === "sections.our-team-section" &&
            block.our_team
          ) {
            for (let i = 0; i < block.our_team.length; i++) {
              const teamId = block.our_team[i].id;

              try {
                // team_image is Multiple Media, so fetch all linked images
                const imageLinks = await strapi.db.connection
                  .select("file_id", "order")
                  .from("files_related_mph")
                  .where({
                    related_id: teamId,
                    related_type: "shared.our-team",
                    field: "team_image",
                  })
                  .orderBy("order", "asc");

                if (imageLinks && imageLinks.length > 0) {
                  const images = [];
                  for (const link of imageLinks) {
                    const image = await strapi.entityService.findOne(
                      "plugin::upload.file",
                      link.file_id,
                    );
                    if (image) {
                      images.push(image);
                    }
                  }

                  if (images.length > 0) {
                    block.our_team[i].team_image = images;
                  }
                }
              } catch (error) {
                strapi.log.error("Error populating team images:", error);
              }
            }
          }

          // Populate background image in cta-banner-layout block
          if (block.__component === "sections.cta-banner-layout") {
            try {
              // background_image is Single Media
              if (block.background_image) {
                const imageId =
                  typeof block.background_image === "object"
                    ? block.background_image.id
                    : block.background_image;

                if (imageId) {
                  const image = await strapi.entityService.findOne(
                    "plugin::upload.file",
                    imageId,
                  );
                  if (image) {
                    block.background_image = image;
                  }
                }
              }
            } catch (error) {
              strapi.log.error(
                "Error populating CTA banner background image:",
                error,
              );
            }
          }
        }
      }

      return { data, meta };
    },
  }),
);
