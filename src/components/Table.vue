<template>
  <table id="data-table" class="table table-striped table-responsive">
    <thead class="thead-dark">
      <tr>
        <th class="text-left" v-for="(row, i) in headerList" :key="i">
          {{ row }}
        </th>
      </tr>
    </thead>
    <tbody v-if="isBodyShown">
      <tr v-for="(row, i) in bodyData" :key="i">
        <td class="text-left" v-for="(key, j) in headerList" :key="j">
          {{ row[key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
/* eslint-disable */
export default {
  name: "table",
  template: "#table",
  props: {
    headerList: {
      type: Array,
      default: [],
    },
    bodyData: {
      type: Array,
      default: [],
    },
    isBodyShown: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
