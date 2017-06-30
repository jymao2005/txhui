import "babel-polyfill"

import Vue from 'vue'

import store from "./store";

window.$store = store;

//console.log("store:", store);

import iView  from "./iView.js"
Vue.use(iView)

import App from './App.vue'

import vueSA from "vue-superagent";
Vue.use(vueSA, {
  baseUrl:"http://chip.jymao.com:8101/ds"
})

import withCredentials from "./superagent-with-credentials.js"
Vue.superagent.use(withCredentials(["qiniu.com"]));

//import mgr from "./manager";
//Vue.use(mgr, {$store:store, $http:Vue.superagent});

import router from "./router/router.js";

Vue.directive("focus", {
      inserted(el){
        el.focus();
      }
})

import utils from "./utils";
Vue.prototype.$utils = utils;

var vm = new Vue({ // eslint-disable-line no-new
  store,
  router,
  el: '#app',
  render: (h) => h(App),
  data:{
    message:"i am msg from main",
    obj:{
      a:1
    }
  },
  methods:{
  }
  ,beforeCreate(){
    window.$$vm = this;
    console.log("create event")
  }
})
console.log("vm created")
window.$$vm = vm;
