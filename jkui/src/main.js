import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import Vue from 'vue';
import './cube-ui';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
Vue.config.productionTip = false
window.Hls = require('hls.js');
import VueTouch from 'vue-touch';

VueTouch.registerCustomEvent('doubletap', {
    type: 'tap',
    taps: 2
});
Vue.use(VueTouch, {name: 'v-touch'});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
