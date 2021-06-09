<template>
  <Loading :loading="loading"></Loading>
</template>

<script>
import { authMixin } from "../../mixins/auth";

export default {
  mixins: [authMixin],
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  created() {
    this.signOut();
  },
};
</script>
