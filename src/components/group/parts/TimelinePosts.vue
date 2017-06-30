<template>
    <div>
        <Timeline :pending="true" style="">
            <TimelineItem v-if="pendingPost" color="grey">
                <div>
                    <span>下一条 {{formatTS(pendingPost.ts)}} ({{formatTS(pendingPost.ts-progressTS)}})</span>
                </div>
                <Button  @click="showPendingNow()" style="font-size:1em;width:100%" type="plain">
                        立即显示
                </Button>

            </TimelineItem>
            <TimelineItem v-if="!pendingPost" color="grey">
                <div>
                    <span>&nbsp;</span>
                </div>
                <Button style="font-size:1em;width:100%" :disabled="true" type="plain">
                        立即显示
                </Button>

            </TimelineItem>

            <transition-group tag="ul" name='post'
                            class='plain' ref="posts"
                            @after-enter="onAfterEnter">
                <TimelineItem v-for="post in historyList" 
                        :key="post._id" 
                        :data-id="post._id"
                        style="position:relative;"
                        >
                    <IconFA  style="box-sizing:initial" color="red" name="question-circle" v-if="post.type=='提问'" slot="dot"></IconFA>
                    
                    <span style="position:absolute; left:-4rem;top:0">{{formatTS(post.ts)}}</span>
                    <Post :post="post"></Post>
                </TimelineItem>
            </transition-group>
        
        </Timeline>
        <Button style="width:100%" v-if="!historyFetcher.hasDone()" @click="fetchMore('history')">显示更多</Button>
    </div>
</template>

<style lang="stylus">
    .post-enter-active, .post-leave-active {
      transition: opacity 1s;
    }
    .post-enter, .post-leave-active {
      opacity: 0;
    }

    .post-move {
        transition: transform 1s;
    }
    
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
                            "longTS":{[$cmp]:boundaryTS}
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
                , futureList:[]
                , pendingPost:null
                , batchSize:6
                , enableAni:false
                , needSetProgressTS:false
                , newProgressTS:-1
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
            ,showPendingNow(){

                if(this.pendingPost.ts>this.progressTS){
                    this.needSetProgressTS = true;
                    this.newProgressTS = this.pendingPost.ts;
                }

                this.historyList.unshift(this.pendingPost);
                this.futureList.shift();
                this.pendingPost = null;
            }
            , onScroll(e){
                console.log(e)
            }
            , initFetchers(){
                console.log("progressTS", this.progressTS)
                this.futureFetcher = new PostsFetcher({
                                                $vm:this
                                                , $cmp:"$gt" 
                                                , sortField:{longTS:1}
                                                , boundaryTS:this.progressTS*1000
                })
                
                this.historyFetcher = new PostsFetcher({
                                                $vm:this
                                                , $cmp:"$lt" 
                                                , sortField:{longTS:-1}
                                                , boundaryTS:this.progressTS*1000
                    
                })
                
                this.fetchMore("future");
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
            , progressTS(){
                if(this.futureList.length<2 && !this.futureFetcher.hasDone()){
                    console.log("fetch future ", this.progressTS, new Date())
                    this.fetchMore("future");
                }

                var near = this.futureList[0];
                this.pendingPost = near;
                if(!near){
                    return;
                }

                if(this.progressTS>=near.ts){
                    this.showPendingNow();
                }
            }
        }
        ,created(){
            this.initFetchers();            
        }
        ,mounted(){
            global.$$vm.$on("resetProgressTS", ()=>this.reset());
        }
    }
    
</script>