<template>
  <v-select
    multiple
    chips
    clearable
    v-model="selectedWeekDays"
    :item-disabled="handleDisableWeekDays"
    :items="weekDays"
    :rules="rules"
    :label="label"
  ></v-select>
</template>

<script>
export default {
  props: ["label", "onSelect", "defaultDisabled", "defaultSelected"],
  watch: {
    selectedWeekDays: function(newValues) {
      this.onSelect(newValues);
    },
  },
  data: (instance) => {
    return {
      selectedWeekDays: instance.defaultSelected || [],
      weekDays: [
        { text: "Monday", value: "monday" },
        { text: "Tuesday", value: "tuesday" },
        { text: "Wednesday", value: "wednesday" },
        { text: "Thursday", value: "thursday" },
        { text: "Friday", value: "friday" },
        { text: "Saturday", value: "saturday" },
        { text: "Sunday", value: "sunday" },
      ],
      rules: [(v) => !!v.length || "Week days are required"],
    };
  },
  methods: {
    handleDisableWeekDays(item) {
      return (this.defaultDisabled || []).includes(item.value);
    },
  },
};
</script>
<style></style>
