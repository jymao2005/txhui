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
        curGroup:{}
       // progressTS:0,
    //    prevProgressTS:0,
      //  server:"chip.jymao.com:9300" // this is server that serve the site page
     },
     getters:{
        curGroupId(state){ return state.curGroup._id;} 
     },
     mutations:{
        curGroup(state, group){
            state.curGroup = group
        }
        , setCurGroupMember(state, members){
            $$vm.$set(state.curGroup, "members", members);
        }
    }
})