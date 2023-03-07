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
    <div class="row">
      <div v-for="(label, index) in localLabel" :key="label" class="col label">
        {{ labels[index] }}
      </div>
    </div>
    <transition name="fade">
      <scroll-picker-group class="flex" v-if="pickerShow">
        <scroll-picker
          v-for="(label, index) in localLabel"
          :key="index"
          :ref="
            (dom) => {
              $refs[label] = dom;
            }
          "
          v-model="localValue[label]"
          @input="(val) => handlePickerInput(label, val)"
          :options="localList[label]"
        />
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
  name: "dt-picker",
  components: {
    pContainer,
    ScrollPicker,
    ScrollPickerGroup,
    btnGroup,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectParam: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "datetime",
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ["datetime", "date", "time", "month", "hour"].includes(value);
      },
    },
    customData: {
      type: Object,
      default: () => ({}),
    },
    labels: {
      type: Array,
      default: () => ["年", "月", "日", "时", "分"],
    },
    beginYear: {
      type: Number,
      default: () => new Date().getFullYear() - 5,
    },
    endYear: {
      type: Number,
      default: () => new Date().getFullYear() + 5,
    },
    beginDate: {
      type: Date,
      default: () => null,
    },
    endDate: {
      type: Date,
      default: () => null,
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
      localList: {},
      localValue: {},
      pickerShow: false,
    };
  },
  computed: {
    localLabel: function () {
      let arr = ["y", "m", "d", "h", "i"];
      if (this.type === "hour") arr = ["y", "m", "d", "h"];
      if (this.type === "month") arr = ["y", "m"];
      if (this.type === "time") arr = ["h", "i"];
      if (this.type === "date") arr = ["y", "m", "d"];
      return arr;
    },
  },
  beforeMount() {
    if (this.visible) this.pickerShow = this.visible;
    if (this.pickerShow) this.initData();
  },
  watch: {
    visible(newVal) {
      this.pickerShow = newVal;
      if (this.pickerShow) this.initData();
    },
  },
  methods: {
    isLeapYear: function (year) {
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    },
    _inArray: function (array, item) {
      for (let index in array) {
        let _item = array[index];
        if (_item === item) return true;
      }
      return false;
    },
    getDayNum: function (year, month) {
      if (this._inArray([1, 3, 5, 7, 8, 10, 12], month)) {
        return 31;
      } else if (this._inArray([4, 6, 9, 11], month)) {
        return 30;
      } else if (this.isLeapYear(year)) {
        return 29;
      } else {
        return 28;
      }
    },
    //生成
    _fill: function (num) {
      num = num.toString();
      if (num.length < 2) {
        num = 0 + num;
      }
      return num;
    },
    createYear() {
      let yArray = [];
      if (this.customData.y) {
        yArray = this.customData.y;
      } else {
        let yBegin = this.beginYear;
        let yEnd = this.endYear;
        for (let y = yBegin; y <= yEnd; y++) {
          yArray.push({
            text: y + "",
            name: y + "",
            value: y,
          });
        }
      }
      return yArray;
    },
    createMonth() {
      //生成月列表
      let mArray = [];
      if (this.customData.m) {
        mArray = this.customData.m;
      } else {
        for (let m = 1; m <= 12; m++) {
          let val = this._fill(m);
          mArray.push({
            text: val,
            name: val,
            value: val,
          });
        }
      }

      return mArray;
    },
    createDay() {
      //生成日列表
      let dArray = [];
      if (this.customData.d) {
        dArray = this.customData.d;
      } else {
        let now = new Date();
        let year =
          this.$refs.y && !!this.$refs.y.innerValue
            ? this.$refs.y.innerValue
            : now.getFullYear();
        let month =
          this.$refs.m && !!this.$refs.m.innerValue
            ? this.$refs.m.innerValue
            : now.getMonth() + 1;
        let maxDay = this.getDayNum(parseInt(year), parseInt(month));
        for (let d = 1; d <= maxDay; d++) {
          let val = this._fill(d);
          dArray.push({
            text: val,
            name: val,
            value: val,
          });
        }
      }
      return dArray;
    },
    createHours() {
      //生成时列表
      let hArray = [];
      if (this.customData.h) {
        hArray = this.customData.h;
      } else {
        for (let h = 0; h <= 23; h++) {
          let val = this._fill(h);
          hArray.push({
            text: val,
            name: val,
            value: val,
          });
        }
      }
      return hArray;
    },
    createMinutes() {
      //生成分列表
      let iArray = [];
      if (this.customData.i) {
        iArray = this.customData.i;
      } else {
        for (let i = 0; i <= 59; i++) {
          let val = this._fill(i);
          iArray.push({
            text: val,
            name: val,
            value: val,
          });
        }
      }
      return iArray;
    },

    _parseValue: function (value) {
      let rs = {};
      if (value) {
        let parts = value.replace(":", "-").replace(" ", "-").split("-");
        rs.y = parts[0];
        rs.m = parts[1];
        rs.d = parts[2];
        rs.h = parts[3];
        rs.i = parts[4];
      } else {
        let now = new Date();
        rs.y = now.getFullYear();
        rs.m = now.getMonth() + 1;
        rs.d = now.getDate();
        rs.h = now.getHours();
        rs.i = now.getMinutes();
      }
      return rs;
    },
    setSelectedValue: function (value) {
      this.localValue = this._parseValue(value);
    },
    getSelected: function () {
      let type = this.type;
      let selected = {
        type: type,
        toString: function () {
          return this.value;
        },
      };
      this.localLabel.forEach((x) => {
        let val = this.$refs[x].innerValue;
        let tmp = this.localList[x].filter((y) => y.value === val)[0] || {};
        let text = tmp.text || "";
        selected[x] = {
          text: text,
          name: text,
          value: val,
        };
      });
      switch (type) {
        case "datetime":
          selected.value =
            selected.y.value +
            "-" +
            selected.m.value +
            "-" +
            selected.d.value +
            " " +
            selected.h.value +
            ":" +
            selected.i.value;
          selected.text =
            selected.y.text +
            "-" +
            selected.m.text +
            "-" +
            selected.d.text +
            " " +
            selected.h.text +
            ":" +
            selected.i.text;
          break;
        case "date":
          selected.value =
            selected.y.value + "-" + selected.m.value + "-" + selected.d.value;
          selected.text =
            selected.y.text + "-" + selected.m.text + "-" + selected.d.text;
          break;
        case "time":
          selected.value = selected.h.value + ":" + selected.i.value;
          selected.text = selected.h.text + ":" + selected.i.text;
          break;
        case "month":
          selected.value = selected.y.value + "-" + selected.m.value;
          selected.text = selected.y.text + "-" + selected.m.text;
          break;
        case "hour":
          selected.value =
            selected.y.value +
            "-" +
            selected.m.value +
            "-" +
            selected.d.value +
            " " +
            selected.h.value;
          selected.text =
            selected.y.text +
            "-" +
            selected.m.text +
            "-" +
            selected.d.text +
            " " +
            selected.h.text;
          break;
      }
      return selected;
    },
    ////////////////
    setLocalList() {
      const obj = {
        y: this.createYear(),
        m: this.createMonth(),
        d: this.createDay(),
        h: this.createHours(),
        i: this.createMinutes(),
      };
      if (this.customData) {
        Object.keys(this.customData).forEach((key) => {
          if (!!this.customData[key] && this.customData[key] instanceof Array) {
            obj[key] = this.customData[key].map((x) => {
              return Object.assign({}, x, {name: x.text})
            });
          }
        });
      }
      this.localList = obj;
    },
    setData() {
      this.localList = {};
      this.setSelectedValue(this.selectParam); // 处理使用者传入的默认值
      this.setLocalList(); // 设置localList, 它是给
    },
    initData() {
      try {
        this.setData();
      } catch (e) {
        console.error(e);
      }
    },
    handlePickerInput(label) {
      if (label === "y") {
        // 更新日选择器
        let aArr = this.createDay();
        this.$set(this.localList, "d", aArr);
      }
      if (label === "m") {
        // 更新日选择器
        let aArr = this.createDay();
        this.$set(this.localList, "d", aArr);
      }
    },
    containerHide(type) {
      this.pickerShow = false;
      this.$emit("input", this.pickerShow);
      if (type && type === "confirm") {
        let result = this.getSelected();
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
      this.initData();
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
.label {
  padding: 4px 0;
  text-align: center;
  font-size: 14px;
  color: #8f8f94;
  background-color: #f0f0f0;
  border-bottom: solid 1px #ccc;
}
</style>
