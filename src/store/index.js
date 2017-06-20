import Vue from "vue";

import Vuex from "vuex"
Vue.use(Vuex);

import user from "./user.js";
import group from "./group.js";

export default new Vuex.Store({
    modules:{
        user,
        group
    },
    state:{
        progressTS:0,
        prevProgressTS:0,
      //  server:"chip.jymao.com:9300" // this is server that serve the site page
     },
    mutations:{
        incrProgressTS(state){
            state.progressTS++;
        }
        , setProgressTS(state, ts){
            state.progressTS = ts;
        }
    }
})