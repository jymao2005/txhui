<template>
    <EditorPosts :groupInfo="groupInfo" compName="NewestPosts"></EditorPosts>
</template>

<style lang="stylus">
    
</style>
<script type="text/javascript" >
    import EditorPosts from "./parts/EditorPosts.vue"
    export default {
        components:{
            EditorPosts
        }
        ,props:["groupInfo"]
    }
</script>