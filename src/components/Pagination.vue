<template>
  <button
    type="button"
    class="btn btn-sm btn-outline-secondary"
    v-if="currentPage != 1"
    @click="updatePage(currentPage - 1)"
  >
    prev
  </button>
  <button
    type="button"
    class="btn btn-sm btn-outline-secondary"
    v-for="pageNumber in pages.slice(currentPage - 1, currentPage + 10)"
    :class="pageNumber == currentPage ? 'text-primary' : 'text-secondary'"
    :key="pageNumber"
    @click="updatePage(pageNumber)"
  >
    {{ pageNumber }}
  </button>
  <button
    type="button"
    @click="updatePage(currentPage + 1)"
    v-if="currentPage < pages.length"
    class="btn btn-sm btn-outline-secondary"
  >
    next
  </button>
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

  data() {
    return {};
  },

  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
