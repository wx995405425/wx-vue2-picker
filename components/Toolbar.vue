<template>
  <div
    class="row picker-toolbar align-center"
    :style="{ borderBottomColor: bottomColor }"
  >
    <div class="col text-left">
      <div
        class="btn cancel"
        @click="btnHandle($event, 'cancel')"
        :style="{ color: cancelColor }"
      >
        {{ cancelText }}
      </div>
    </div>
    <div class="col text-right">
      <div
        class="btn confirm"
        @click="btnHandle($event, 'confirm')"
        :style="{ color: confirmColor, borderColor: confirmColor }"
      >
        {{ confirmText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  props: {
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
  beforeMount() {
    this.initConfirmBtnStyle();
  },
  methods: {
    btnHandle(ev, type) {
      ev.stopPropagation();
      this.$emit("click", type);
    },
    initConfirmBtnStyle() {
      const activeDOM = document.getElementById("pickerBtnActive");
      if (activeDOM) activeDOM.remove();
      const style = document.createElement("style");
      style.id = "pickerBtnActive";
      const css =
        ".picker-toolbar .btn.confirm:active { background: " +
        this.confirmColor +
        " !important; }";

      document.body.appendChild(style);
      style.type = "text/css";
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
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

.picker-toolbar {
  height: 46px !important;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box !important;
  font-size: 13px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}

.picker-toolbar .btn {
  display: inline-block;
  padding: 4px 8px;
}
.picker-toolbar .btn.confirm {
  border: 1px solid #ddd;
  font-size: 12px;
  border-radius: 3px;
}

.picker-toolbar .btn.confirm:active {
  color: white !important;
  background: #3db0fc;
  border: 0px;
}

.picker-toolbar .btn.cancel {
  color: #888;
}

.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}

.align-center {
  align-items: center !important;
}
</style>
