export default {
  setValue(state, data) {
    state[data.key] = data.value;
  },
  setValues(state, data) {
    data.forEach((prop) => {
      state[prop.key] = prop.value;
    });
  },
  addOrder(state, data) {
    state.intake.orders.push(data);
  },
  changeIntakePaymentType(state, data) {
    state.intake.payment_type = data;
  },
  removeOrder(state, data) {
    state.intake.orders.splice(data, 1);
  },
  saveOrder(state, { order, index }) {
    Object.keys(order).forEach((key) => {
      state.intake.orders[index][key] = order[key];
    });
  },
};
