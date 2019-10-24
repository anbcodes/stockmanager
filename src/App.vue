<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline">
        <span>Stock Manager</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row>
          <span class="title">
            Stocks:
          </span>
        </v-row>
        <v-row>
          <v-simple-table style="width: 100%">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Ticker</th>
                  <th class="text-left">Count</th>
                  <th class="text-left">Price</th>
                  <th class="text-left">Show</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="stock in stocks"
                  :key="stock.id"
                  @click="createStockCard = false; currentCreateStock = stock; stockEditOpen = true"
                >
                  <td>{{ stock.name }}</td>
                  <td>{{ stock.ticker }}</td>
                  <td>{{ stock.count }}</td>
                  <td>{{ stock.price }}</td>
                  <td>
                    <v-switch
                      :input-value="stock.show"
                      @click.stop="updateShow(stock, !stock.show)"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
        <v-row>
          <v-col cols="1">
            <v-btn icon large @click="addStock">
              <v-icon large>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="formatedShownStocks">
          <span class="title">
            Sites<span> for {{formatedShownStocks}}</span>:
          </span>
        </v-row>
        <v-row v-else>
          <span class="title">
            Add Site:
          </span>
        </v-row>
        <v-row>
          <v-simple-table style="width: 100%">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Stock</th>
                  <th class="text-left">Link</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="card in cards"
                  :key="card.id"
                  @click="viewCard = true; currentNewsCard = card"
                >
                  <td>{{ card.name }}</td>
                  <td>{{ card.stock }}</td>
                  <td><a :href="card.link">{{ card.link }}</a></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
        <v-row>
          <v-btn icon large @click="addCard">
            <v-icon large>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-row>
      </v-container>
      <stock-card-edit
        v-model='stockEditOpen'
        :create="createStockCard"
        :stock='currentCreateStock'
      />
      <news-card v-model="viewCard" :newsCard="currentNewsCard" />
      <news-card-edit v-model='newsEditOpen' create :card='currentCreateCard' />
    </v-content>
  </v-app>
</template>

<script>
import NewsCard from './components/NewsCard.vue';
import NewsCardEdit from './components/NewsCardEdit.vue';
import StockCardEdit from './components/StockCardEdit.vue';

export default {
  async mounted() {
    await this.getStocks();
    await this.getCards();
    this.$bus.$on('update', async () => {
      await this.getStocks();
      await this.getCards();
    });
  },
  name: 'App',
  components: {
    NewsCard,
    NewsCardEdit,
    StockCardEdit,
  },
  data: () => ({
    cards: [],
    stocks: [],
    stockEditOpen: false,
    newsEditOpen: false,
    currentCreateStock: {},
    currentCreateCard: {},
    createStockCard: true,
    currentNewsCard: {},
    viewCard: false,
  }),
  methods: {
    async getCards() {
      const cards = await this.$db.getNewsCards();
      this.cards = cards.sort((e1, e2) => new Date(e1) - new Date(e2));
      const shownStocks = this.stocks
        .filter(v => v.show)
        .map(v => v.name);
      this.cards = this.cards.filter(v => shownStocks.includes(v.stock));
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
        show: false,
      };
      this.createStockCard = true;
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
    async updateShow(stock, show) {
      /* eslint-disable-next-line */
      stock.show = show;
      await this.$db.putStock(stock);
      this.$bus.$emit('update');
    },
  },
  computed: {
    formatedShownStocks() {
      const stockNames = this.stocks
        .filter(v => v.show)
        .map(v => v.name);
      return stockNames.length <= 1
        ? stockNames.join(', ')
        : stockNames
          .slice(0, -1)
          .join(', ')
          .concat(', and ')
          .concat(
            stockNames.slice(-1)[0],
          );
    },
  },
};
</script>
