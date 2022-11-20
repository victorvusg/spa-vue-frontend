/* eslint-disable camelcase */
export const groupVariantsByServiceCategory = (
  variants = [],
  serviceCategories = [],
) => {
  const groupedCategory = serviceCategories.reduce((accum, category) => {
    if (!accum[category.name]) {
      accum[category.name] = {
        descriptions: category.descriptions,
        id: category.id,
        name: category.name,
        services: [],
      };
    }
    return accum;
  }, {});
  return variants.reduce((accum, variant) => {
    const category = variant.service.service_category.name;
    if (accum[category]) {
      const { service } = variant;
      const foundIndex = accum[category].services.findIndex(
        (s) => s.id === service.id,
      );
      if (foundIndex !== -1) {
        accum[category].services[foundIndex].variants.push(variant);
      } else {
        accum[category].services.push({
          combo_ratio: service.combo_ratio,
          descriptions: service.descriptions,
          id: service.id,
          is_active: service.is_active,
          is_combo_sold: service.is_combo_sold,
          name: service.name,
          variants: [variant],
        });
      }
    }
    return accum;
  }, groupedCategory);
};
export const a = 1;
