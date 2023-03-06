import Vue from "vue";
import PopPicker from "./PopPicker.vue";

let PickerConstructor = Vue.extend(PopPicker);

let instance;
let seed = 1;
const Picker = function (options) {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  const config = {
    layer: options.layer || 1,
    value: false,
    selectParam: options.selectParam || [],
  };
  let id = "picker_" + seed++;
  instance = new PickerConstructor({
    propsData: config,
  });
  instance.id = id;
  instance.$mount();
  document.body.appendChild(instance.$el);
  return instance;
};
export default Picker;
