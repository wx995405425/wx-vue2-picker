<template>
  <div id="app">
    <div style="margin-top: 60px">
      <button @click="openPicker(1)">单列选择</button>
      <button @click="openPicker(2)">双列选择</button>
      <button @click="openPicker(3)">级联选择</button>
      <button @click="openPicker(4)">Date选择</button>
      <button @click="openPicker(5)">Time选择</button>
    </div>
    <p>单列选择结果</p>
    <div class="result">{{ result1 }}</div>
    <p>双列选择结果</p>
    <div class="result">{{ result2 }}</div>
    <p>级联选择结果</p>
    <div class="result">{{ result3 }}</div>
    <p>Date选择结果</p>
    <div class="result">{{ result4 }}</div>
    <p>Time选择结果</p>
    <div class="result">{{ result5 }}</div>
  </div>
</template>

<script>
import cityData3 from "./city.data";

export default {
  name: "App",
  data() {
    return {
      options0: ["Tom", "James", "Jim"],
      value0: [2],
      options1: [
        { value: 1, name: "Tom" },
        { value: 2, name: "James" },
        { value: 3, name: "Jim" },
      ],
      options2: [
        [
          { value: 1, name: "一月" },
          { value: 2, name: "二月" },
          { value: 3, name: "三月" },
        ],
        [
          { value: 11, name: "11日" },
          { value: 12, name: "12日" },
          { value: 13, name: "13日" },
        ],
      ],
      value2: [1, 13],
      options3: cityData3,
      showPicker1: false,
      showPicker2: false,
      showPicker3: false,
      value3: [
        { name: "内蒙古", value: "150000", text: "内蒙古" },
        { name: "呼和浩特市", value: "150100", text: "呼和浩特市" },
        { name: "回民区", value: "150103", text: "回民区" },
      ],
      result2: "",
      result1: "",
      result3: "",
      result4: "",
      result5: "",
    };
  },
  methods: {
    openPicker(type) {
      if (type === 1) {
        let picker = new this.$PopPicker({
          selectParam: this.value0,
        });
        picker.setData(this.options1);
        picker.show((data) => {
          console.log(data);
          this.result1 = data;
        });
      }
      if (type === 2) {
        let picker = new this.$PopPicker({
          selectParam: this.value2,
          layer: 2,
        });
        picker.setData(this.options2);
        picker.show((data) => {
          console.log(data);
          this.result2 = data;
        });
      }
      if (type === 3) {
        let picker = new this.$PopPicker({
          selectParam: this.value3,
          layer: 3,
        });
        picker.setData(this.options3);
        picker.show((data) => {
          console.log(data);
          this.result3 = data;
        });
      }
      if (type === 4) {
        let picker = new this.$DtPicker({
          type: "datetime",
        });
        picker.show((data) => {
          console.log(data);
          this.result4 = data;
        });
      }
      if (type === 5) {
        let picker = new this.$DtPicker({
          type: "hour",
          labels: ["年", "月", "日", "时段", "分"],
          customData: {
            h: [
              { value: "am", text: "上午" },
              { value: "pm", text: "下午" },
            ],
          },
        });
        picker.show((data) => {
          console.log(data);
          this.result5 = data;
        });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.result {
  margin: 10px;
  padding: 10px;
  border: solid 1px #ccc;
  min-height: 60px;
  box-sizing: border-box;
}
</style>
