<template>
  <v-dialog :value="value" @input="$emit(arguments[0])">
    <v-card>
      <v-card-title>
        {{cardCopy.name}} ({{cardCopy.stock}})
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field label="name" v-model="cardCopy.name"/>
          </v-row>
          <v-row>
            <v-autocomplete label="stock" v-model="cardCopy.stock" :items="stocks"/>
          </v-row>
          <v-row>
            <v-text-field label="link" v-model="cardCopy.link"/>
          </v-row>
          <v-row>
            <v-date-picker v-model="cardCopy.date"/>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col cols="2">
              <v-btn @click="$emit('input', false)">
                Close
              </v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn @click="save">
                {{create ? 'Create' : 'Save'}}
              </v-btn>
            </v-col>
            <v-col cols="2" v-if="!create">
              <v-btn @click="remove">
                Delete
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    create: Boolean,
    card: Object,
    value: Boolean,
  },
  async mounted() {
    await this.getStocks();
    this.$bus.$on('update', async () => {
      await this.getStocks();
    });
  },
  data: () => ({
    cardCopy: {},
    stocks: [],
  }),
  watch: {
    card: {
      handler() {
        console.log('CARD:', this.card);
        this.cardCopy = JSON.parse(JSON.stringify(this.card));
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async getStocks() {
      const stocks = await this.$db.getStocks();
      this.stocks = stocks.map(s => s.name);
    },
    async save() {
      if (this.create) {
        await this.$db.addNewsCard(this.cardCopy);
      } else {
        await this.$db.putNewsCard(this.cardCopy);
      }
      this.$emit('input', false);
      this.$bus.$emit('update');
    },
    async remove() {
      await this.$db.removeNewsCard(this.cardCopy);
      this.$emit('input', false);
      this.$bus.$emit('update');
    },
  },
};
</script>
