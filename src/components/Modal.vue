<template>
  <v-row justify="center">
    <v-dialog :value="visible" :dark="dark" :fullscreen="fullscreen" :max-width="width || 290" @click:outside="onClose">
      <slot></slot>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["visible", "dark", "fullscreen", "width", "onClose"],
};
</script>
