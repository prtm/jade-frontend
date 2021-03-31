<template>
  <div>
    <div class="autocomplete form-group has-search">
      <span class="form-control-feedback">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
          />
        </svg>
      </span>
      <input
        type="search"
        :placeholder="placeholder"
        class="form-control mr-2"
        id="inputSearch"
        @input="onChange"
        v-model="search"
        @keyup.down="onArrowDown"
        @keyup.up="onArrowUp"
        @keyup.enter="onEnter"
        :autocomplete="currentInputLength >= 2 ? 'on' : 'off'"
      />
      <div
        class="text-danger text-left"
        v-if="(currentInputLength > 0) & (currentInputLength < 2)"
      >
        Enter atleast 2 characters
      </div>
      <ul
        id="autocomplete-results"
        style="display: grid"
        v-show="isSuggestionsDropdownOpen"
        class="list-group autocomplete-results"
      >
        <li class="loading list-group-item" v-if="isLoading">
          Loading results...
        </li>
        <li
          v-else
          v-for="(result, i) in items"
          :key="i"
          @click="suggestionClick(result)"
          class="list-group-item list-group-item-action"
          :class="{ 'is-active': i === selectedSuggestionIndex }"
        >
          {{ result }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "Search",
  template: "#Search",
  props: {
    items: {
      type: Array,
      required: false,
      default: [],
    },
    placeholder: {
      type: String,
      required: false,
      default: "Search...",
    },
  },

  data() {
    return {
      isSuggestionsDropdownOpen: false,
      search: "",
      isLoading: false,
      selectedSuggestionIndex: -1,
      currentInputLength: 0,
    };
  },

  methods: {
    resetSelectedSuggestionIndex() {
      this.selectedSuggestionIndex = -1;
    },
    setSuggestionsDropdown(isOpened) {
      this.isSuggestionsDropdownOpen = isOpened;
    },
    onChange() {
      this.$emit("onInputChange", this.search);
      this.setSuggestionsDropdown(true);
      this.resetArrowState();
    },
    suggestionClick(result) {
      this.$emit("suggestionClick", result);
      this.resetSelectedSuggestionIndex();
      this.search = result;
      this.setSuggestionsDropdown(false);
    },
    onArrowDown() {
      if (this.selectedSuggestionIndex < this.items.length) {
        this.selectedSuggestionIndex = this.selectedSuggestionIndex + 1;
      }
    },
    onArrowUp() {
      if (this.selectedSuggestionIndex > 0) {
        this.selectedSuggestionIndex = this.selectedSuggestionIndex - 1;
      }
    },
    onEnter() {
      this.setSuggestionsDropdown(false);
      if (this.selectedSuggestionIndex == -1) {
        this.$emit("searchByPrefix", this.search);
      } else {
        this.search = this.items[this.selectedSuggestionIndex];
        this.$emit("suggestionClick", this.search);
      }
      this.resetSelectedSuggestionIndex();
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.setSuggestionsDropdown(false);
        this.resetSelectedSuggestionIndex();
      }
    },
    mounted() {
      document.addEventListener("click", this.handleClickOutside);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  position: absolute;
  text-align: left;
  z-index: 99;
  top: 100%;
  left: 0;
  right: 0;
}

.autocomplete-results li {
  cursor: pointer;
  /* background-color: #fff;  */
}

.is-active,
.autocomplete-result:hover {
  z-index: 1;
  color: #495057;
  text-decoration: none;
  background-color: #f8f9fa;
}
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: searchfield-cancel-button;
}

.has-search .form-control {
  padding-left: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
}
</style>
