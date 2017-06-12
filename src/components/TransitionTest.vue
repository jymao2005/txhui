<template>
    <div>
        <link href="https://unpkg.com/animate.css@3.5.1/animate.min.css" rel="stylesheet" type="text/css">

        <button @click="show=!show">Toggle</button>
        <transition name="f" mode="out-in">
            <span key="hello" v-if="show" :style="{background:'green', display:'block', position:'absolute'}">Hello</span>
            <span key ="someone" v-if="!show" :style="{border:'1px solid red', display:'block', position:'absolute'}">Someone</span>
        </transition>
    </div>
</template>

<script type="text/javascript">
    export default {
        data(){
            return {show:true}
        }
    }
    
</script>


<style type="text/css" scoped>
    .f-enter-active, .f-leave-active  {
        transition: all 1s;
       /* animation:bounce-in .8s*/
    }
    .f-enter{
        opacity:0;
        transform:translateY(30px);
    }
    .f-enter-active {
    }
    .f-leave-active {
        opacity:0;
        transform:translateY(-30px);
    }

</style>