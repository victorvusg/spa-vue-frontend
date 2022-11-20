import noteTemplate from '@helpers/note';
import { cloneDeep } from 'lodash';

export default {
  data() {
    return {};
  },
  methods: {
    generateNote(type = 'service', variantCategory) {
      const note = {};
      if (type === 'combo') {
        note.signature = null;
      }
      switch (variantCategory) {
        case 'body':
          return cloneDeep({ type: 'body', ...noteTemplate.bodyForm, ...note });
        case 'facials':
          return cloneDeep({
            type: 'facial',
            ...noteTemplate.facialForm,
            ...note,
          });
        default:
          return cloneDeep({
            type: 'other',
            ...noteTemplate.otherForm,
            ...note,
          });
      }
    },
    updateOrders(payload, type) {
      const orders = [...this.orders];
      switch (type) {
        case 'promotion':
          orders.push(...payload);
          break;
        case 'service':
        default:
          orders.push(payload);
      }
      this.$emit('update:orders', orders);
    },
  },
};
