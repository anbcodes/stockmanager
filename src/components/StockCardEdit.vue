<template>
  <v-dialog :value="value" @input='$emit("input", arguments[0])' max-width="500">
    <v-card>
      <v-card-title class="title">
        {{stockCopy.name}} ({{stockCopy.ticker}})
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field v-model="stockCopy.name" label="name"/>
          </v-row>
          <v-row>
            <v-text-field v-model="stockCopy.ticker" label="ticker"/>
          </v-row>
          <v-row>
            <v-text-field v-model="stockCopy.count" label="count" type="number"/>
          </v-row>
          <v-row>
            <v-text-field v-model="stockCopy.price" label="price" prefix="$" type="number"/>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-btn block @click="$emit('input', false)" outlined>
                Close
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn block @click="save" outlined color="success">
                {{create ? 'Create' : 'Save'}}
              </v-btn>
            </v-col>
            <v-col cols="4" v-if="!create">
              <v-btn block @click="remove" outlined color="error">
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
    value: Boolean,
    stock: Object,
    create: Boolean,
  },
  data: () => ({
    stockCopy: Object,
  }),
  watch: {
    stock: {
      handler() {
        console.log('STOCK:', this.stock);
        this.stockCopy = JSON.parse(JSON.stringify(this.stock));
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async save() {
      if (this.create) {
        await this.$db.addStock(this.stockCopy);
      } else {
        await this.$db.putStock(this.stockCopy);
      }
      this.$emit('input', false);
      this.$bus.$emit('update');
    },
    async remove() {
      await this.$db.removeStock(this.stockCopy);
      this.$emit('input', false);
      this.$bus.$emit('update');
    },
  },
};
</script>
