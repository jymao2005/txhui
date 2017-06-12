<template>
  <div id="app1" @click.capture.self='onClick1("parent")'>
    <TranstionTest></TranstionTest>
    <keep-alive>
      <component :is="currentPage">
        
      </component>
    </keep-alive>
    
    <editor v-model="cnt">
      <template slot="title-input" scope="fromChildProps" >
        <input   :value ="fromChildProps.text" type="text" class="title-input"></input>
      </template>
    </editor> 
    <p v-html="cnt"></p>
    <p>data.a in parent: {{data.b}}</p>
    <input type="checkbox" name="" value="true" :true-value="todos" false-value="iamFalse" v-model="checked"/>
    <span>{{checked}}</span>
    
    <todos>
      <template slot='todo-item' scope="props">
        <li >{{'xxxx'+props.todo}}</li>
      </template>
    </todos>
  
    <ul>
      <template v-for="(todo, key, idx) in todos">
        <li>{{idx}}-{{key}}-{{todo}}</li>
        <li class="divider"></li>
      </template>
    </ul>
    <transition name="fade">
      <h1 v-if="false" :title="msg | upperCase('arg2')">{{msg}}</h1>
      <h1  :title="msg" v-else>{{msg}}</h1>
    </transition>
    <button @click.stop.prevent.self.capture="onClick1($event)">button</button>
    <hello :item="reverseMsg" :sharedData="data">
      <p>{{todo}}</p>
    </hello>
  </div>
</template>

<style type="text/css" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>

<script>
import Hello from './components/Hello.vue'
import Todos from './components/Todos.vue'
import Editor from "./components/Editor.vue"
import Home from "./components/Home.vue"
//import Group from "./components/Group.vue"
import TranstionTest from "./components/TransitionTest.vue"

export default {
  name: 'app',
  components: {
    Hello,
    Todos,
    Editor,
    Home,
    TranstionTest
  //  Group
  },
  methods:{
    onClick1(event){
     // alert("clicked")  
     console.log(this)
    }
  },
  beforeCreate(){
    this.$options.components.Group = require("./components/Group.vue")
  },
  filters:{
    upperCase(str, arg2){
      return str.toUpperCase();
    }
  },
  computed:{
    reverseMsg(){
      return this.msg.split('').reverse().join('');
    }  
  },
  watch:{
    msg(){
      this.reverseMsg2 = this.msg.split('').reverse().join('');
    }  
  },
  data() {
    var data = {msg:"App.vue"+Math.random()*100
              , seen:false, todos:{A:"a", B:"b"}
              , msg2:""
              , checked:"true", data:{a:1}
              , cnt:""
              , currentPage:"Home"
    };
    setInterval(()=>{
    //  data.msg = "App.vue"+Math.random()*100;
    //  data.seen = !data.seen;
        //data.currentPage = data.currentPage ==="Home"?"Group":"Home";
    //    console.log(this.todos);

     //   this.todos.D = "c"+Math.random();
        
    },1000)
    return data;
  },
  beforeMount(){
    console.log("beforeMount")
  },
  beforeUpdate(){
   // console.log("beforeUpdate")
  },
  updated(){
    console.log("updated")
  },
  mounted(){
    if(this.todos.D){
      alert("already set todos.D")
    }
  }
  
}
</script>
