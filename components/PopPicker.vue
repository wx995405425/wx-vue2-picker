<template>
  <p-container @hide="containerHide" v-model="pickerShow">
    <btn-group
      @click="containerHide"
      :confirmText="confirmText"
      :cancelText="cancelText"
      :confirmColor="confirmColor"
      :cancelColor="cancelColor"
      :bottomColor="bottomColor"
    ></btn-group>
    <transition name="fade">
      <scroll-picker-group class="flex" v-if="pickerShow">
        <template v-if="this.conLen === 1">
          <scroll-picker v-model="localValue[0]" :options="localList" />
        </template>
        <template v-else-if="isNoRelationColumns">
          <scroll-picker
            v-for="(item, index) in localList"
            :key="index"
            v-model="localValue[index]"
            :options="item"
          />
        </template>
        <template v-else-if="isCascadeColumns">
          <scroll-picker
            v-for="(item, index) in localList"
            :key="index"
            v-model="localValue[index]"
            @input="(val) => handlePickerInput(index, val)"
            :options="item"
          />
        </template>
      </scroll-picker-group>
    </transition>
  </p-container>
</template>

<script>
import "vue-scroll-picker/dist/style.css";
import pContainer from "./Container.vue";
import btnGroup from "./Toolbar.vue";
import { ScrollPicker, ScrollPickerGroup } from "vue-scroll-picker";

export default {
  name: "pop-picker",
  components: {
    pContainer,
    ScrollPicker,
    ScrollPickerGroup,
    btnGroup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    selectParam: {
      type: Array,
      default: () => [],
    },
    // 实际业务字段，用来兼容vue-scroll-picker组件
    valueKey: {
      type: String,
      default: "value",
    },
    // 展示到界面的字段，用来兼容vue-scroll-picker组件
    showKey: {
      type: String,
      default: "text",
    },
    // 有多少列,最多3列表
    layer: {
      type: Number,
      default: 1,
      validator: function (value) {
        if (typeof value === "number") {
          return value >= 1 && value <= 3;
        }
        return false;
      },
    },
    options: {
      type: Array,
      default: () => [],
    },
    // 按钮配置
    confirmText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmColor: {
      type: String,
      default: "#3db0fc",
    },
    cancelColor: {
      type: String,
      default: "#888",
    },
    bottomColor: {
      type: String,
      default: "#ddd",
    },
  },
  data() {
    return {
      onClose: null, // 兼容仿mui PopPicker 组件的函数式调用
      conLen: 1, // 展示的列数
      rawList: [], // 缓存处理之后的options
      localList: [],
      localValue: [],
      pickerShow: false,
      cascadeShowPath: [], // 级联选择器的展示路径, 只需要记录第2、3级
      isCascadeColumns: false, // 是否为级联选择器，如：省市区选择等树状结构数据
      isNoRelationColumns: false, // 是否为无强关联关系的多列选项，最多可设置3列
    };
  },
  beforeMount() {
    if (this.value) this.pickerShow = this.value;
    if (this.pickerShow) this.initData(this.options);
  },
  watch: {
    value(newVal) {
      this.pickerShow = newVal;
      if (this.pickerShow) this.initData(this.options);
    },
  },
  methods: {
    processSelectParam() {
      if (!this.selectParam) return;

      if (
        typeof this.selectParam === "string" ||
        typeof this.selectParam === "number"
      ) {
        this.localValue = [this.selectParam];
      }
      if (typeof this.selectParam === "object") {
        if (this.selectParam instanceof Array) {
          this.localValue = this.selectParam.map((x) => {
            if (typeof x === "object") {
              return x[this.valueKey];
            } else {
              return x;
            }
          });
        } else {
          let val = this.selectParam[this.valueKey] ?? null;
          this.localValue = [val];
        }
      }
    },
    // 处理树状结构数据
    processTreeOption(arr) {
      if (!arr || !(arr instanceof Array)) {
        return [];
      }
      let temArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (!!arr[i] && typeof arr[i] === "object") {
          let item = arr[i];
          // 用来兼容vue-scroll-picker组件
          item.value = item.value || item[this.valueKey];
          item.name = item.name || item[this.showKey];
          if (item.children) {
            item.children = this.processTreeOption(arr[i].children);
          }
          temArr.push(item);
        }
      }
      return temArr;
    },
    // 处理无强关联关系的多列选项
    processNoRelationOptions(arr) {
      if (!arr || !arr.length) return [];
      this.isNoRelationColumns =
        arr.length > 1 && arr.every((item) => item instanceof Array);
      if (this.isNoRelationColumns) {
        this.conLen = arr.length >= 1 && arr.length <= 3 ? arr.length : 3;
        let tmpArr = [];
        for (let i = 0; i < arr.length; i++) {
          let copyArr = arr[i].map((item) => {
            // 用来兼容vue-scroll-picker组件
            if (!!item && typeof item === "object") {
              return Object.assign({}, item, {
                value: item.value || item[this.valueKey],
                name: item.name || item[this.showKey],
              });
            }
            return item;
          });
          tmpArr.push(copyArr);
        }
        return tmpArr;
      }
      return arr.map((item) => {
        // 用来兼容vue-scroll-picker组件
        if (!!item && typeof item === "object") {
          return Object.assign({}, item, {
            value: item.value || item[this.valueKey],
            name: item.name || item[this.showKey],
          });
        }
        return item;
      });
    },
    processOption(options) {
      this.isCascadeColumns = options.some(
        (x) => !!x.children && x.children instanceof Array
      );
      // 级联选择，如：省市区选择等树状结构数据
      if (this.isCascadeColumns) {
        this.conLen = this.layer > 1 && this.layer <= 3 ? this.layer : 3;
        this.rawList = this.processTreeOption(options);
      } else {
        // 单列、双列（无关联关系，两列组合）
        this.rawList = this.processNoRelationOptions(options);
      }
    },
    // 把树状结构展开为3个独立数组用于展示，并选中默认值
    getCascadeLocalList(defaultValue, treeData) {
      if (
        defaultValue &&
        defaultValue instanceof Array &&
        defaultValue.length > 0
      ) {
        const obj = {
          0: treeData ?? [],
        };
        for (let i = 0; i < this.conLen; i++) {
          const val = defaultValue[i];
          if (val === null || val === undefined || val === "") {
            break;
          }
          obj[i].findIndex((item) => {
            if ((typeof val === "string" || typeof val === "number") && !!val) {
              if (item[this.valueKey] === val) {
                obj[i + 1] = item.children ?? [];
                return true;
              }
              return false;
            }
            if (typeof val === "object" && !!val) {
              if (
                item[this.valueKey] === val[this.valueKey] &&
                item[this.showKey] === val[this.showKey]
              ) {
                obj[i + 1] = item.children ?? [];
                return true;
              }
              return false;
            }
          });
        }
        this.localList = Object.assign([], obj).slice(0, this.conLen);
      } else {
        const obj2 = {
          0: treeData,
          1:
            !!treeData[0].children && treeData[0].children instanceof Array
              ? treeData[0].children
              : [],
          2:
            !!treeData[0].children &&
            treeData[0].children[0] &&
            treeData[0].children[0].children instanceof Array
              ? treeData[0].children[0].children
              : [],
        };
        this.localList = Object.assign([], obj2).slice(0, this.conLen);
      }
    },
    setLocalList() {
      // 级联选择
      if (this.isCascadeColumns) {
        this.getCascadeLocalList(this.localValue, this.rawList);
      } else {
        // 单列、双列（无关联关系，两列组合）
        this.localList = this.rawList;
      }
    },
    setData(options) {
      this.localList = [];
      this.processSelectParam(); // 处理使用者传入的默认值
      this.processOption(options); // 处理使用者传入的选项, 并缓存到rawList中
      this.setLocalList(); // 设置localList, 它是给
    },
    initData(options) {
      try {
        this.setData(options);
      } catch (e) {
        console.error(e);
      }
    },
    handlePickerInput(cascadeIndex, value) {
      console.log(cascadeIndex, value);
      const valueIndex = this.localList[cascadeIndex].findIndex(
        (x) => x[this.valueKey] === value
      );
      const selectedItem = this.localList[cascadeIndex][valueIndex];

      if (cascadeIndex === 0) {
        // 第1列改变，更新第2、3列
        this.$set(
          this.localList,
          cascadeIndex + 1,
          selectedItem.children || []
        );
        if (this.conLen === 3) {
          let level3 =
            this.localList[1][0] && this.localList[1][0].children
              ? this.localList[1][0].children || []
              : [];
          this.$set(this.localList, cascadeIndex + 2, level3);
        }
      }
      if (cascadeIndex === 1 && this.conLen === 3) {
        // 第2列改变，更新第3列
        this.$set(
          this.localList,
          cascadeIndex + 1,
          selectedItem.children || []
        );
      }
    },
    getResult() {
      let result = [];
      if (!this.isCascadeColumns && !this.isNoRelationColumns) {
        result = this.localList.filter((x) => {
          let val = this.localValue[0];
          if (!val) {
            return false;
          }
          if (typeof x === "string" || typeof x === "number") {
            return x === val;
          }
          if (typeof x === "object") {
            return x[this.valueKey] === val;
          }
        });
      }
      if (this.isCascadeColumns || this.isNoRelationColumns) {
        result = this.localList.map((arr, index) => {
          if (!arr || arr.length === 0) {
            return null;
          }
          let val = this.localValue[index];
          if (val) {
            let inx = arr.findIndex((x) => {
              if (typeof x === "string" || typeof x === "number") {
                return x === val;
              }
              if (typeof x === "object") {
                return x[this.valueKey] === val;
              }
            });
            if (inx > -1) {
              return arr[inx];
            }
            return arr[0];
          }
          return arr[0];
        });
      }
      if (result && result.length > 0) {
        result = result.map((x) => {
          if (typeof x === "string" || typeof x === "number") {
            return x;
          }
          if (typeof x === "object") {
            return {
              [this.valueKey]: x.value,
              [this.showKey]: x.name,
            };
          }
        });
      }
      return result;
    },
    containerHide(type) {
      this.pickerShow = false;
      this.$emit("input", this.pickerShow);
      if (type && type === "confirm") {
        let result = this.getResult();
        this.$emit("change", result);
        if (this.onClose && typeof this.onClose === "function") {
          this.onClose(result);
        }
      }
    },
    //兼容mui PopPicker组件的函数式调用
    dispose() {
      this.pickerShow = false;
    },
    show(cb) {
      this.pickerShow = true;
      this.onClose = cb;
    },
  },
};
</script>

<style scoped>
.row {
  display: -webkit-flex; /*新版本语法：chrome 21+*/
  display: flex; /*新版本语法:opera 12.1,Firefox 22+*/
  display: -webkit-box; /*老版本语法：Safari,iOS,Android browser,old Webkit browser*/
  display: -moz-box; /*老版本语法：Firefox(buggy)*/
  display: -ms-flexbox; /*混合版本语法：IE 10*/
}

.row .col {
  -webkit-flex: 1; /*Chrome*/
  -ms-flex: 1; /*IE 10*/
  flex: 1; /* NEW ,Spec - Opera 12.1,Firefox 20+*/
  -webkit-box-flex: 1; /*OLD -iOS 6-,Safari 3.1-6*/
  -moz-box-flex: 1; /*OLD - Firefox 19-*/
}
.text-center {
  text-align: center;
}
</style>
