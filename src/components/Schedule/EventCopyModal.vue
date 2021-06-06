<template>
  <Modal :width="500" :dark="dark" :visible="show" :onClose="handleClose">
    <v-card>
      <v-card-title class="headline">Duplicate Event</v-card-title>
      <v-card-text>
        <v-form @submit.prevent ref="copyform" v-model="formValid">
          <WeekSelect
            :defaultDisabled="defaultDisabled"
            :onSelect="weekSelectHandler"
            label="Select week days to duplicate event*"
          ></WeekSelect>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="handleClose">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text :disabled="!formValid || loading" @click="handleDuplicate">
          Duplicate
        </v-btn>
      </v-card-actions>
    </v-card>
  </Modal>
</template>

<script>
import WeekSelect from "../WeekSelect";

export default {
  components: {
    WeekSelect,
  },
  props: ["show", "dark", "loading", "defaultSelected", "onClose", "onDuplicate"],
  computed: {
    defaultDisabled() {
      return this.defaultSelected.map((d) => d.week);
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  data: () => {
    return {
      formValid: false,
      selected: [],
    };
  },
  methods: {
    weekSelectHandler(value) {
      this.selected = value;
    },
    handleClose(isCallOnClose = true) {
      this.selected = [];
      this.$refs.copyform.reset();

      if (isCallOnClose) {
        this.onClose();
      }
    },
    handleDuplicate() {
      if (this.$refs.copyform.validate()) {
        this.onDuplicate(this.selected);
        this.handleClose(false);
      }
    },
  },
};
</script>

<style></style>
