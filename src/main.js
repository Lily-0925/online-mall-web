// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from "vue-lazyload"
import InfiniteScroll from "vue-infinite-scroll"
import Vuex from 'vuex'

Vue.use(InfiniteScroll);
Vue.use(Vuex);
Vue.config.productionTip = false
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
});

/* eslint-disable no-new */
const store = new Vuex.store({
      state:{
         nickName:'',
         cartCount:0
      },
      mutations:{
        updateUserName(state,nickName){
            state.nickName=nickName;
        },
        updateCartCount(state,cartCount){
          state.cartCount+=cartCount;
        },
        initCartCount(state,cartCount){
          state.cartCount=cartCount;
        }
      }
});

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})




