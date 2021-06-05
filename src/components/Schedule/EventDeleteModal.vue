<template>
  <Modal v-if="showModal" :width="400" :dark="dark" :visible="showModal" :onClose="onClose">
    <v-card>
      <v-card-title class="headline">Delete Event</v-card-title>
      <v-card-text>
        Are you sure you want to permanently delete this event?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="onClose">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text :disabled="loading" @click="onDelete">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </Modal>
</template>

<script>
export default {
  props: ["dark", "showModal", "loading", "onClose", "onDelete"],
};
</script>

<style></style>
