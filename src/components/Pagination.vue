<template>
  <div>
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-sm btn-pagination"
        :disabled="startPage - perPageItems <= 1"
        @click="onButtonClick(startPage - perPageItems)"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-pagination"
        :disabled="startPage <= 1"
        @click="onButtonClick(startPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-pagination"
        v-for="page in pages"
        :class="{ 'text-secondary': page == currentPage }"
        :key="page"
        @click="onButtonClick(page)"
      >
        {{ page }}
      </button>
      <button
        type="button"
        @click="onButtonClick(endPage + 1)"
        :disabled="endPage >= totalPages"
        class="btn btn-sm btn-pagination"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
      <button
        type="button"
        @click="onButtonClick(endPage + perPageItems)"
        :disabled="endPage + perPageItems >= totalPages"
        class="btn btn-sm btn-pagination"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>
    <div class="text-secondary mt-3">
      Showing {{ ((currentPage - 1) * perPageItems).toLocaleString() }} to
      {{ Math.min(currentPage * perPageItems, totalItems).toLocaleString() }} of
      {{ totalItems.toLocaleString() }} records
    </div>
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
    perPageItems: {
      type: Number,
      default: 15,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      startPage: 0,
      endPage: 0,
      pages: [],
      totalPages: 0,
    };
  },
  mounted() {
    this.setStartPage();
    this.setEndPage();
    this.setTotalPages();
    this.setPages();
  },
  methods: {
    setTotalPages() {
      this.totalPages = Math.ceil(this.totalItems / this.perPageItems);
    },
    setPages() {
      this.pages = Array.from(
        Array(this.endPage + 1 - this.startPage).keys()
      ).map((i) => this.startPage + i);
    },
    onButtonClick(page) {
      this.$emit("onButtonClick", page);
    },
    setStartPage() {
      this.startPage =
        Math.floor((this.currentPage - 1) / this.perPageItems) *
          this.perPageItems +
        1;
    },
    setEndPage() {
      this.endPage = Math.min(
        this.startPage + this.perPageItems - 1,
        this.totalItems
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-pagination {
  color: darkorange;
  border-color: darkorange;
}
</style>
