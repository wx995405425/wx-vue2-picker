import Vue from "vue";
import DtPickerVue from "./DtPicker.vue";

let DtPickerConstructor = Vue.extend(DtPickerVue);

let instance;
let seed = 1;
const DtPicker = function (options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  let id = "dtPicker_" + seed++;
  instance = new DtPickerConstructor({
    propsData: options,
  });
  instance.id = id;
  instance.$mount();
  document.body.appendChild(instance.$el);
  // instance.pickerShow = true;
  return instance;
};
export default DtPicker;
