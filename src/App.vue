<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline">
        <span>Stock Manager</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row height="100">
          <v-col cols="3" v-for="stock in stocks" :key='stock.id'>
            <stock-card :stock="stock" />
          </v-col>
          <v-col cols="1">
            <v-btn icon large @click="addStock">
              <v-icon large>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
         <v-row>
          <v-col cols="4" v-for="card in cards" :key='card.id'>
            <news-card :newsCard="card" />
          </v-col>
          <v-col cols="1">
            <v-btn icon large @click="addCard">
              <v-icon large>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <stock-card-edit v-model='stockEditOpen' create :stock='currentCreateStock' />
      <news-card-edit v-model='newsEditOpen' create :card='currentCreateCard' />
    </v-content>
  </v-app>
</template>

<script>
import NewsCard from './components/NewsCard.vue';
import NewsCardEdit from './components/NewsCardEdit.vue';
import StockCardEdit from './components/StockCardEdit.vue';
import StockCard from './components/StockCard.vue';

export default {
  async mounted() {
    await this.getCards();
    await this.getStocks();
    this.$bus.$on('update', async () => {
      await this.getCards();
      await this.getStocks();
    });
  },
  name: 'App',
  components: {
    NewsCard,
    NewsCardEdit,
    StockCard,
    StockCardEdit,
  },
  data: () => ({
    cards: [],
    stocks: [],
    stockEditOpen: false,
    newsEditOpen: false,
    currentCreateStock: {},
    currentCreateCard: {},
  }),
  methods: {
    async getCards() {
      const cards = await this.$db.getNewsCards();
      this.cards = cards.sort((e1, e2) => new Date(e1) - new Date(e2));
    },
    async getStocks() {
      const stocks = await this.$db.getStocks();
      this.stocks = stocks;
    },
    addStock() {
      this.currentCreateStock = {
        name: 'New Stock',
        ticker: 'EXAMPLE',
        count: 0,
        price: 0,
      };
      this.stockEditOpen = true;
    },
    addCard() {
      this.currentCreateCard = {
        name: 'New News Card',
        date: new Date().toISOString().split('T')[0],
        link: 'example.com',
        stock: 'pick a stock',
      };
      this.newsEditOpen = true;
    },
  },
};
</script>
