<template>
    <div class="container">
        <div class="hero">
            <blockquote>
                <p>
                    最好的学习方法就是教会同学, 或者, 被同学教会.
                </p>
                <footer>— <cite>同学会</cite></footer>
            </blockquote>
        </div>
        
        <groupList></groupList>

    </div>
</template>

<style lang="stylus">
    .hero
        padding:1em 1em 2em;
        
        blockquote
            color: darken(#42d885, 30%)

</style>

<script type="text/javascript">
    import GroupList from "./GroupList.vue"
    export default {
        components:{
            GroupList
        }
    }
</script>