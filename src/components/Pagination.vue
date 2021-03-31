<template>
  <div class="btn-group">
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      v-if="currentPage != 1"
      @click="onButtonClick(currentPage - 1)"
    >
      prev
    </button>
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      v-for="page in pages.slice(currentPage - 1, currentPage + 10)"
      :class="page == currentPage ? 'text-primary' : 'text-secondary'"
      :key="page"
      @click="onButtonClick(page)"
    >
      {{ page }}
    </button>
    <button
      type="button"
      @click="onButtonClick(currentPage + 1)"
      v-if="currentPage < pages.length"
      class="btn btn-sm btn-outline-secondary"
    >
      next
    </button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "pagination",
  template: "#pagination",
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pages: Array,
  },
  methods: {
    onButtonClick(page) {
      this.$emit("onButtonClick", page);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-primary {
  color: darkorange !important;
}
</style>
