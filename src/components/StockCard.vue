<template>
  <div>
    <v-card>
      <v-card-title class="title">
        {{stock.name}} ({{stock.ticker}})
        <v-spacer />
        <v-btn icon @click='editOpen = !editOpen'>
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
          price: {{stock.price}} <br>
          count: {{stock.count}} <br>
          <v-switch label="show" :input-value="stock.show" @change="updateShow"/>
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
  methods: {
    async updateShow(v) {
      console.log('UPDATING SHOW:', v);
      this.stock.show = v;
      await this.$db.putStock(this.stock);
      this.$bus.$emit('update');
    },
  },
};
</script>
