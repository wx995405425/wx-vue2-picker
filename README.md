# wx-vue2-picker

A vue2.x based development, similar to the ios wheel style selection mobile plug-in, currently support time selection, single choice, multiple choice.

Based on the secondary packaging of the [wan2land/vue-scroll-picker](https://github.com/wan2land/vue-scroll-picker/tree/0.x-vue2) component, the [PopPicker](https://www.dcloud.io/hellomui/examples/picker.html) and [DtPicker](https://www.dcloud.io/hellomui/examples/dtpicker.html) components of mui are implemented, and the usage is consistent with the mui component.


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
### build lib
```
yarn build:lib
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Usage
#### How to use as mui
1、import css and js in main.js
```
import { PopPicker, DtPicker } from "wx-vue2-picker/dist/wx-vue2-picker.umd";
import "wx-vue2-picker/dist/wx-vue2-picker.css";
```

2、Register the component globally in main.js
```
Vue.prototype.$PopPicker = PopPicker;
Vue.prototype.$DtPicker = DtPicker;
```

3、This is how it is used in the specific vue file
```
let value = [{ value: 3, text: "Jim" }]
let options = [
  { value: 1, text: "Tom" },
  { value: 2, text: "James" },
  { value: 3, text: "Jim" },
]
let picker = new this.$PopPicker({
  selectParam: value, // default value
});
picker.setData(options);
picker.show((data) => {
  console.log(data);
});
```
For other parameters, please check [mui official documentation](https://dev.dcloud.net.cn/mui/ui/#picker)

