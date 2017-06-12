import Vue from 'vue'

import store from "./store";


import iView  from "./iView.js"
Vue.use(iView)

import App from './App.vue'


import vueSA from "vue-superagent";
Vue.use(vueSA, {
  baseUrl:"http://chip.jymao.com:8101/ds"
})



import router from "./router.js";

Vue.directive("focus", {
      inserted(el){
        el.focus();
      }
})
  

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
    test(){
      
    }
  }
})

global.vm = vm;