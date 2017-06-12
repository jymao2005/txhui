import Vue from "vue";

import Vuex from "vuex"
Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        progressTS:0,
        prevProgressTS:0
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