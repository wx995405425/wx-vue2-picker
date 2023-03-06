import Vue from "vue";
import App from "./App.vue";
import { PopPicker, DtPicker } from "../dist/wx-vue2-picker.umd";
import "../dist/wx-vue2-picker.css";
Vue.config.productionTip = false;
Vue.prototype.$PopPicker = PopPicker;
Vue.prototype.$DtPicker = DtPicker;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
