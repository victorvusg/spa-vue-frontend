import { groupVariantsByServiceCategory } from '@/helpers/variants';

export default {
  getGroupedVariants: (state) => {
    const { variants, serviceCategories } = state;
    const grouped = groupVariantsByServiceCategory(variants, serviceCategories);
    return grouped;
  },
};
