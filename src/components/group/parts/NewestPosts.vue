<template>
    <div>
        <transition-group tag="ul" name='post'
                        class='plain' ref="posts"
                        @after-enter="onAfterEnter">
            <li v-for="post in historyList" 
                :key="post._id" 
                :data-id="post._id"
                style="padding-bottom:1.8rem">
                <Post :post="post"></Post>
            </li>
        </transition-group>
        
        <Button style="width:100%" v-if="!historyFetcher.hasDone()" @click="fetchMore('history')">显示更多</Button>
    </div>
</template>

<style lang="stylus">

</style>
<script type="text/javascript" >
    import Post from "../../post/timeline-post.vue"
    
    class PostsFetcher{
        constructor(options){
            this.options = options;
            this._fetching =false;
        }
        fetch(){
            if(this.isDone){
                return Promise.resolve([]);
            }
            var {$vm, $cmp, sortField, boundaryTS} = this.options;
            if(!$vm.groupId){
                this.isDone = true;
                return Promise.resolve([]);
            }
            this._fetching = true;
            console.log("fetch begin")
            return $vm.$http.get("/g/Post")
                .query({
                        condition:{
                            "groups":$vm.groupId,
                         //   "longTS":{[$cmp]:boundaryTS}
                        },
                        sortField
                        ,limit: $vm.batchSize
                    })
                    .then((res)=>{
                        var list = res.body;
                        this.options.boundaryTS = list && list.length && list[list.length-1].longTS;
                        this.isDone = list.length<$vm.batchSize;
                        this._fetching = false;
                        console.log("fetch done")
                        return Promise.resolve(res.body)
                    })
        }
        hasDone(){
            return this.isDone;
        }
        isFetching(){
            return this._fetching;
        }
        
    }
    
    import {mapGetters} from "vuex"
    export default {
        components:{
            Post
        },
        props:["groupId", "newPost"],
        data(){
            return {
                historyList:[]
                , batchSize:6
            }
        }
        , computed:{
            ...mapGetters("user/", ["progressTS"])
        }
        , methods:{
            async fetchMore(typeStr){
                var fetcher = this[typeStr+"Fetcher"];
                
                if(fetcher.hasDone() || fetcher.isFetching()){
                    return;
                }
                var list = await fetcher.fetch();
                this[typeStr+"List"] = this[typeStr+"List"].concat(list);
            }
            ,localeDateStr(str){
                var d = new Date(str)
                return d.toLocaleString();
            }
            , onScroll(e){
            //    console.log(e)
            }
            , initFetchers(){
                console.log("progressTS", this.progressTS)

                this.historyFetcher = new PostsFetcher({
                                                $vm:this
                                                , $cmp:"$lt" 
                                                , sortField:{createdAt:-1}
                                            //    , boundaryTS:this.progressTS*1000
                    
                })
                
                this.fetchMore("history");
            }
            ,reset(){
                console.log("reset")
                Object.assign(this.$data, this.$options.data());
                this.initFetchers();
            }
            ,onAfterEnter(){
                if(this.needSetProgressTS && this.newProgressTS>=0){
                    this.$store.dispatch("user/setProgressTS", this.newProgressTS);
                    this.needSetProgressTS = false;
                    this.newProgressTS = -1;
                }
            }
        }
        ,watch:{
            newPost(){
                this.historyList.unshift(this.newPost)
            }
        }
        ,created(){
            this.initFetchers();            
        }
        ,mounted(){
      //      global.$$vm.$on("resetProgressTS", ()=>this.reset());
        }
    }
    
</script>