<template>
  <v-select
    :dark="dark"
    v-model="color"
    :items="colors"
    label="Color"
    class="color-select"
    :menu-props="{ contentClass: 'color-select-content' }"
  >
    <template v-slot:selection="{ item }">
      <div class="color-item" :class="item.value"></div>
    </template>

    <template v-slot:item="{ item, attrs, on }">
      <v-list-item v-on="on" v-bind="attrs">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs" class="color-item" :class="item.value"></div>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </v-list-item>
    </template></v-select
  >
</template>

<script>
export default {
  props: ["dark", "defaultColor", "onSelect"],
  watch: {
    color: function(newColor) {
      this.onSelect(newColor);
    },
  },
  data(instance) {
    return {
      color: instance.defaultColor || "blue",
      colors: [
        { value: "red darken-2", text: "Tomato" },
        { value: "red lighten-2", text: "Flamingo" },
        { value: "deep-orange darken-1", text: "Tangerine" },
        { value: "yellow darken-2", text: "Banana" },
        { value: "green darken-2", text: "Sage" },
        { value: "green darken-4", text: "Basil" },
        { value: "indigo lighten-2", text: "Peacock" },
        { value: "blue", text: "Blueberry" },
        { value: "indigo", text: "Lavender" },
        { value: "purple darken-1", text: "Grape" },
        { value: "grey darken-2", text: "Graphite" },
      ],
    };
  },
};
</script>

<style lang="scss">
.color-select {
  width: 64px;

  .v-input {
    &__append-inner {
      width: 20px;
      padding-left: 0px !important;
    }

    &__slot {
      padding: 0 8px !important;
    }
  }
}

.color-select-content {
  .v-list {
    display: flex;
    max-width: 64px;
    flex-wrap: wrap;

    .v-list-item {
      padding: 0;
      margin: 6px 3px;
      min-height: 18px;
      flex: 1 1 calc(50% - 6px);
    }
  }
}

.color-item {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  margin: 3px;
  cursor: pointer;
}
</style>
