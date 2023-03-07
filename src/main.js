import Vue from "vue";
import App from "./App.vue";
import { PopPicker, DtPicker } from "../index";
Vue.config.productionTip = false;
Vue.prototype.$PopPicker = PopPicker;
Vue.prototype.$DtPicker = DtPicker;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
