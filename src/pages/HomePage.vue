<template>
  <div class="container-fluid h-100 pl-4 pr-4">
    <div class="row h-100">
      <div class="col-md-3 pt-2 pb-2 side-bar">
        <Search
          placeholder="Search Name"
          @suggestionClick="getDetailsbyName"
          class="mr-2"
          :items="searchSuggestions"
          @onInputChange="onInputChange"
        />
        <div class="text-left font-weight-bold mb-2 mt-2 side-bar-header">
          A BSE bhav browser for the activity that has taken place in the market
        </div>
        <div
          :class="[
            searchedName != '' ? 'visible' : 'invisible',
            'text-left',
            'mt-2',
          ]"
          style="font-size: 0.95rem"
        >
          Search Results For <strong>{{ searchedName }}</strong>
        </div>
        <div
          v-if="lastUpdated != ''"
          class="mt-3 ml-1 d-flex justify-content-left"
        >
          Last Updated: <strong>{{ lastUpdated }}</strong>
        </div>
        <div class="mt-2 ml-1 d-flex justify-content-left">
          <button
            class="btn btn-primary mt-2"
            @click="download_table_as_csv('data-table')"
          >
            Download CSV
          </button>
        </div>
      </div>
      <div class="col-md-9 mt-2">
        <div class="h-75">
          <table id="data-table" class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th class="text-left" v-for="(row, i) in header_names" :key="i">
                  {{ row }}
                </th>
              </tr>
            </thead>
            <tbody v-if="!isLoading">
              <tr v-for="(row, i) in displayedData" :key="i">
                <td class="text-left" v-for="(key, j) in header_names" :key="j">
                  {{ row[key] }}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="isLoading"
            class="mt-2 mb-2 h-100 d-flex align-items-center justify-content-center"
          >
            <Loader />
          </div>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="clearfix btn-group" v-if="displayedData.length >= 10">
            <Pagination :currentPage="currentPage" :pages="pages" />
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

export default {
  name: "HomePage",
  props: {
    msg: String,
  },
  data() {
    return {
      isLoading: false,
      searchSuggestions: [],
      value: "",
      lastUpdated: "",
      bhavData: [],
      totalCount: 0,
      header_names: ["SC_NAME", "SC_CODE", "OPEN", "CLOSE", "LOW", "HIGH"],
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
    displayedData() {
      return this.paginate(this.bhavData);
    },
  },
  components: { Search, Loader, Pagination },
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
    download_table_as_csv(table_id, separator = ",") {
      var rows = document.querySelectorAll("table#" + table_id + " tr");
      var csv = [];
      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) {
          var data = cols[j].innerText
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace(/(\s\s)/gm, " ");
          data = data.replace(/"/g, '""');
          row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
      }
      var csv_string = csv.join("\n");
      var filename =
        "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
      var link = document.createElement("a");
      link.style.display = "none";
      link.setAttribute("target", "_blank");
      link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
      );
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    getDetailsbyName(value) {
      // on click of suggestion
      this.isLoading = true;
      this.lastSearchInputLength = value.length;
      const url = `market/search?q=${value}`;
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
    getInitialBhavData() {
      const url = `market/`;
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
      if (q.length >= 3) {
        const url = `market/search-suggestions/?q=${q}`;
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
      // const totalPage = Math.ceil(this.totalCount / this.perPage);
      const start = this.perPage * (newPageValue - 1);
      const stop = this.perPage * newPageValue;
      const url = `market/?start=${start}=&stop=${stop}`;
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.side-bar {
  background-color: #e5e5e5;
}
.side-bar-header {
  font-size: 1.3rem;
}
</style>
