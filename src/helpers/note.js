const bodyForm = {
  note: [],
  text: '_Tinh đầu: \n_Lực massage: \n_Tình trạng sức khỏe hiện tại: ',
};
const facialForm = {
  note: {
    forehead: {
      humidity: '',
      oil: '',
    },
    cheek: {
      humidity: '',
      oil: '',
    },
    nose: {
      humidity: '',
      oil: '',
    },
    chin: {
      humidity: '',
      oil: '',
    },
  },
  text: '',
};
const otherForm = { note: '', text: '' };
export default {
  bodyForm,
  facialForm,
  otherForm,
};
