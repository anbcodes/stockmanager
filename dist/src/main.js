import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Database from './utils/database';

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();

Vue.prototype.$db = new Database('local');
new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app');
