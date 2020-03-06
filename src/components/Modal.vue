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
  props: ["visible", "dark", "fullscreen", "width", "onClose"],
  watch: {
    visible: function(newVisible) {
      this.dialog = newVisible;

      if (!newVisible) this.onClose();
    },
    dialog: function(newDialog) {
      if (!newDialog) this.onClose();
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
