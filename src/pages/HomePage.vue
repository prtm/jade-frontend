<template>
  <nav class="navbar navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <svg height="24" width="60" xmlns:xlink="http://www.w3.org/1999/xlink">
          <a xlink:href="https://www.w3schools.com/graphics/" target="_blank">
            <text x="0" y="15" fill="orange">Jade</text>
          </a>
        </svg>
      </a>
    </div>
  </nav>
  <div class="container-fluid h-100 pl-4 pr-4">
    <div class="row h-100">
      <div class="col-md-3 pt-2 pb-2 side-bar">
        <Search
          placeholder="Search Name"
          @searchByPrefix="searchDetailsbyNamePrefix"
          @suggestionClick="searchDetailsbyExactName"
          class="mr-2"
          :items="searchSuggestions"
          @onInputChange="onInputChange"
        />
        <div class="text-start font-weight-bold mb-2 mt-3 side-bar-header">
          A BSE bhav browser for the activity that has taken place in the market
        </div>
        <div
          :class="[
            searchedName != '' ? 'visible' : 'invisible',
            'mt-2',
            'text-start',
          ]"
          style="font-size: 0.95rem"
        >
          Search Results For <strong>{{ searchedName }}</strong>
        </div>
        <div v-if="lastUpdated != ''" class="mt-3 ml-1 text-start">
          Last Updated: <strong>{{ lastUpdated }}</strong>
        </div>
        <div class="mt-2 mb-3 ml-1 d-flex justify-content-left">
          <a
            class="btn btn-download mt-2"
            tabindex="-1"
            role="button"
            aria-disabled="true"
            :href="`${baseURL}/market/download-bhav-data/?q=${searchedName}`"
          >
            Download CSV
          </a>
        </div>
      </div>
      <div class="col-md-9 mt-2 pb-4 table-scroll">
        <Table
          :headerList="headerList"
          :bodyData="tableDisplayData"
          :isBodyShown="!isLoading"
        />
        <div v-if="isLoading" class="mt-5 mb-2 h-100">
          <Loader />
        </div>
        <div class="row">
          <div v-if="!isLoading & (totalCount > perPage)">
            <Pagination
              @onButtonClick="updatePage"
              :currentPage="currentPage"
              :pages="pages"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiCall } from "@/utils/api";
import Search from "../components/Search";
import Loader from "../components/Loader.vue";
import Pagination from "../components/Pagination.vue";
import Table from "../components/Table.vue";

export default {
  name: "HomePage",

  data() {
    return {
      baseURL: process.env.VUE_APP_SERVER_URL,
      isLoading: false,
      searchSuggestions: [],
      value: "",
      lastUpdated: "",
      bhavData: [],
      totalCount: 0,
      headerList: ["SC_NAME", "SC_CODE", "OPEN", "CLOSE", "LOW", "HIGH"],
      currentPage: 1,
      perPage: 15,
      pages: [],
      lastSearchInputLength: 0,
      searchedName: "",
    };
  },
  mounted() {
    this.getInitialBhavData();
  },
  watch: {
    totalCount() {
      this.setPages();
    },
  },
  computed: {
    tableDisplayData() {
      return this.paginate(this.bhavData);
    },
  },
  components: {
    Search,
    Loader,
    Pagination,
    Table,
  },
  methods: {
    paginate(data) {
      let currentPage = this.currentPage;
      let perPage = this.perPage;
      let from = currentPage * perPage - perPage;
      let to = currentPage * perPage;
      return data.slice(from, to);
    },
    setPages() {
      console.log(this.totalCount);
      let numberOfPages = Math.ceil(this.totalCount / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    // on suggestion select
    searchDetailsbyExactName(value) {
      if (value.length < 2) {
        return;
      }
      this.isLoading = true;
      this.lastSearchInputLength = value.length;
      const url = `/market/search-by-extract-name/?q=${value}`;
      apiCall({ url, method: "get" })
        .then((response) => {
          console.log(response);
          this.bhavData = [response.results];
          this.totalCount = 1;
          this.searchedName = value;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
    // on search without suggestion
    searchDetailsbyNamePrefix(value) {
      if (value.length < 2) {
        return;
      }
      this.isLoading = true;
      this.lastSearchInputLength = value.length;
      const url = `/market/search/?q=${value}`;
      apiCall({ url, method: "get" })
        .then((response) => {
          console.log(response);
          this.bhavData = response.results;
          this.totalCount = response.results.length;
          this.searchedName = value;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
    getInitialBhavData() {
      const url = `/market/`;
      this.isLoading = true;
      apiCall({ url, method: "get" })
        .then((response) => {
          console.log(response);
          this.bhavData = response.results;
          this.totalCount = response.count;
          this.lastUpdated = response["last_updated"];
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
    onInputChange(q) {
      if (q.length >= 2) {
        const url = `/market/search-suggestions/?q=${q}`;
        apiCall({ url, method: "get" })
          .then((response) => {
            console.log(response);
            this.searchSuggestions = response.results;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        if (this.lastSearchInputLength > q.length) {
          this.getInitialBhavData();
        }
        this.searchedName = "";
        this.searchSuggestions = [];
      }
      this.lastSearchInputLength = q.length;
    },
    updatePage(newPageValue) {
      if (this.currentPage == newPageValue) {
        return;
      }
      this.currentPage = newPageValue;
      const start = this.perPage * (newPageValue - 1);
      const stop = this.perPage * newPageValue;
      const url = `/market/?start=${start}=&stop=${stop}`;
      this.isLoading = true;
      apiCall({ url, method: "get" })
        .then((response) => {
          console.log(response);
          this.bhavData = response.results;
          this.totalCount = response.count;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.side-bar {
  background-color: #e5e5e5;
}
.side-bar-header {
  font-size: 1.3rem;
}

.btn-download {
  color: white;
  background-color: darkorange;
  border-color: orange;
}

.table-scroll {
  overflow-x: auto;
}
</style>
