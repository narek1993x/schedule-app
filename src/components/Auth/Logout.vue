<template>
  <div />
</template>

<script>
import { authMixin } from "../../mixins/auth";

export default {
  mixins: [authMixin],
  created() {
    this.signOut();
  },
};
</script>
