/**
 * home controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::home.home', ({ strapi }) => ({
  async find(ctx) {
    // Call the default core action
    const { data, meta } = await super.find(ctx);
    
    // Manually populate images in nested components
    if (data?.blocks) {
      for (const block of data.blocks) {
        // Populate coffee images in coffee-showcase block
        if (block.__component === 'sections.coffee-showcase' && block.coffees) {
          for (let i = 0; i < block.coffees.length; i++) {
            const coffeeId = block.coffees[i].id;
            
            try {
              const imageLink = await strapi.db.connection
                .select('file_id')
                .from('files_related_mph')
                .where({
                  related_id: coffeeId,
                  related_type: 'shared.coffees',
                  field: 'coffee_image'
                })
                .first();
              
              if (imageLink && imageLink.file_id) {
                const image = await strapi.entityService.findOne(
                  'plugin::upload.file',
                  imageLink.file_id
                );
                
                if (image) {
                  block.coffees[i].coffee_image = image;
                }
              }
            } catch (error) {
              strapi.log.error('Error populating coffee image:', error);
            }
          }
        }
        
        // Populate service images in moto-services block
        if (block.__component === 'sections.moto-services' && block.services) {
          for (let i = 0; i < block.services.length; i++) {
            const serviceId = block.services[i].id;
            
            try {
              const imageLink = await strapi.db.connection
                .select('file_id')
                .from('files_related_mph')
                .where({
                  related_id: serviceId,
                  related_type: 'shared.service-cards',
                  field: 'services_image'
                })
                .first();
              
              if (imageLink && imageLink.file_id) {
                const image = await strapi.entityService.findOne(
                  'plugin::upload.file',
                  imageLink.file_id
                );
                
                if (image) {
                  block.services[i].services_image = image;
                }
              }
            } catch (error) {
              strapi.log.error('Error populating service image:', error);
            }
          }
        }
      }
    }
    
    return { data, meta };
  },
}));
