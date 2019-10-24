<template>
  <div>
    <v-card>
      <v-card-title class="title">
        {{stock.name}} ({{stock.ticker}})
        <v-btn icon @click='editOpen = !editOpen'>
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        price: {{stock.price}} <br>
        count: {{stock.count}}
      </v-card-text>
    </v-card>
    <stock-card-edit v-model="editOpen" :stock="stock"/>
  </div>
</template>
<script>

import StockCardEdit from './StockCardEdit.vue';

export default {
  components: {
    'stock-card-edit': StockCardEdit,
  },
  props: {
    stock: Object,
  },
  data: () => ({
    editOpen: false,
  }),
};
</script>
