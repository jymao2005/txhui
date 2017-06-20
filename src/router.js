import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Welcome from "./components/Welcome.vue";
import Group from "./components/group/index.vue";
import Home from "./components/Home.vue";
import User from "./components/User.vue";
import ShortNotes from "./components/group/ShortNotes.vue";
import Questions from "./components/group/Questions.vue";
import Combined from "./components/group/Combined.vue";
import NoteTree from "./components/group/NoteTree.vue";

var router = new VueRouter({
    routes:[
        {path:"/welcome", component:Welcome},
        {
            path:"/group/:groupId"
            , component:Group
            , children:[
                {
                    path:"",
                    redirect:"combined"
                },
                {
                    path:"s-notes",
                    name:"s-notes",
                    component:ShortNotes
                },
                {
                    path:"questions",
                    name:"questions",
                    component:Questions
                }
                , {
                    path:"combined",
                    name:"combined",
                    component:Combined
                }
                , {
                    path:"note-tree",
                    name:"note-tree",
                    component:NoteTree
                }

                ]
        },
        {path:"/home", component:Home},
        {path:"/u/:userId", component:User},
        {path:"/", redirect(){
            if(localStorage.getItem("userInfo")){
                return "/welcome"
            }
            else {
                return "/welcome"
            }
        }}
    ]
})

export default router;
