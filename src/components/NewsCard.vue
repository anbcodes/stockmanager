<template>
  <v-dialog :value="value" @input="$emit('input', arguments[0])" max-width="400">
    <v-card>
      <v-img v-if="ogData.ogImage" :src="ogData.ogImage.url">
      </v-img>
      <v-card-title class="title">
        {{newsCard.name}} ({{newsCard.stock}})
      </v-card-title>
      <v-card-subtitle>
        {{ogData.ogTitle || "(No title)"}}
      </v-card-subtitle>
      <v-card-text>
        {{ogData.ogDescription || "(No description)"}}
      </v-card-text>
      <v-card-actions>
        <v-btn @click.stop="toLink">
          Open
        </v-btn>
        <v-btn @click.stop="editOpen = !editOpen">
          Edit
        </v-btn>
        <v-btn @click.stop="$emit('input', false)">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
    <news-card-edit :card="newsCard" v-model="editOpen"/>
  </v-dialog>
</template>
<script>
import openGraph from 'open-graph-scraper';
import NewsCardEdit from './NewsCardEdit.vue';

export default {
  props: {
    newsCard: Object,
    value: Boolean,
  },
  components: {
    NewsCardEdit,
  },
  data: () => ({
    editOpen: false,
    ogData: {},
  }),
  watch: {
    newsCard: {
      handler() {
        this.getOpenGraph();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    toLink() {
      window.open(this.newsCard.link, '_blank');
    },
    getOpenGraph() {
      const options = { url: this.newsCard.link };
      openGraph(options, (error, results) => {
        this.ogData = results.data || {};
      });
    },
  },
};
</script>
