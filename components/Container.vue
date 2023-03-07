<template>
  <div class="wx-vue2-picker-container" v-if="containerShow">
    <div class="mask"></div>
    <div class="box" @click="clickMask">
      <transition name="picker-modal">
        <div class="bottom-wrap" v-if="modalShow">
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "Container",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalShow: false,
      containerShow: false,
      toModal: null,
      toContainerHide: null,
    };
  },
  beforeMount() {
    const me = this;
    this.clearTo();
    this.containerShow = this.value;
    if (this.containerShow) {
      this.toModal = setTimeout(function () {
        me.modalShow = true;
      }, 50);
    }
  },
  watch: {
    value(newVal) {
      this.clearTo();
      const me = this;
      if (newVal) {
        this.containerShow = newVal;
        this.toModal = setTimeout(function () {
          me.modalShow = true;
        }, 50);
      } else {
        me.modalShow = false;
        me.toContainerHide = setTimeout(function () {
          me.containerShow = false;
        }, 500);
      }
    },
  },
  beforeDestroy() {
    this.clearTo();
  },
  methods: {
    clickMask() {
      console.log("click mask");
      this.$emit("hide");
    },
    clearTo() {
      if (this.toModal) clearTimeout(this.toModal);
      if (this.toContainerHide) clearTimeout(this.toContainerHide);
    },
  },
};
</script>
<style>
.wx-vue2-picker-container .vue-scroll-picker-item {
  height: 2em !important;
  line-height: 2em !important;
}
.wx-vue2-picker-container .vue-scroll-picker-group {
  height: 220px !important;
}
.wx-vue2-picker-container .vue-scroll-picker {
  height: 14em !important;
}
</style>
<style scoped>
.wx-vue2-picker-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 8999;
}

.wx-vue2-picker-container .mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  background-color: #000;
  opacity: 0.4;
}

.wx-vue2-picker-container .box {
  position: relative;
  height: 100vh;
  width: 100vw;
  z-index: 10;
  overflow: hidden;
}

.wx-vue2-picker-container .box > .bottom-wrap {
  position: absolute;
  box-sizing: border-box;
  background: #fff;
  min-height: 50px;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 11;
}

.picker-modal-enter-active {
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.picker-modal-leave-active {
  transition: all 0.3s ease-out;
}

.picker-modal-enter,
.picker-modal-leave-to {
  transform: translateY(220px);

  /* transform: scale(2); */
  opacity: 0.5;
}
</style>
