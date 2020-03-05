<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      :dark="dark"
      :fullscreen="fullscreen"
      :max-width="width || 290"
    >
      <slot></slot>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["visible", "dark", "fullscreen", "width"],
  watch: {
    visible: function(newVisible) {
      this.dialog = newVisible;
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    handleCancle() {
      this.dialog = false;
      this.onClose();
    },
    handleConfirm() {
      this.dialog = false;
      this.onConfirm();
    }
  }
};
</script>
