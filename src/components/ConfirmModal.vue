<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" :max-width="width || 290">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="handleConfirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["visible", "title", "width", "content", "onConfirm", "onClose"],
  watch: {
    visible: function(newVisible) {
      if (newVisible) {
        this.dialog = newVisible;
      }
    },
    dialog: function(newDialog) {
      if (!newDialog) this.handleCancle();
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
