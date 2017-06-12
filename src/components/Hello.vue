<template>
  <div id="hello">
    <div>{{obj.b}}</div>
    <p>{{sharedData.b}}</p>
    <img src="http://vuejs.org/images/logo.png">
    <input  v-focus/>
    <h1>{{msg}}</h1>
    <h1>test{{ item }}</h1>
    <h2>{{message}}</h2>
    <h2 :style="[fontStyle]" :class="[fontClass]">Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="https://github.com/vuejs/vueify" target="_blank">vueify</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props:["item", "sharedData"],
  data () {
    return {
      msg: 'Welcome to try2',
      fontStyle:{
        fontWeight:"bold"
      },
      fontClass:"active",
      obj:{
        a:1
      }
    }
  },
  beforeUpdate(){
    console.log("before hello update", Date.now()-this.createdAt)  
    
  },
  updated(){
    console.log("hello updated", Date.now()-this.createdAt)  
  },
  created(){
    this.createdAt = Date.now();
    console.log("created:", this.createdAt)
   // alert("mounted")
    //this.$set(this.obj, "b",3);
    this.obj.b=5;
    console.log("hello is created");
    setTimeout(()=>this.$set(this.$props.sharedData, "b",2),1000)
  }  
}
</script>

<style scoped>
#hello {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.active {
  color:orange;
}
</style>
