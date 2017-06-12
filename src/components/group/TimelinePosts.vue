<template>
    <div>
        <Timeline :pending="true">
            <Transition>
                <TimelineItem v-if="pendingPost" color="grey">
                    <div>
                        <span>下一条即将显示 {{formatTS(pendingPost.ts-progressTS)}}</span>
                    </div>
                    <Button @click="showPendingNow()" style="font-size:1em" type="text">立即显示</Button>
    
                </TimelineItem>
            </Transition>
            <TimelineItem v-for="post in historyList" :key="post._id" :data-id="post._id">
                <IconFA  style="box-sizing:initial" color="red" name="question-circle" v-if="post.type=='提问'" slot="dot"></IconFA>
                <Post :post="post"></Post>
            </TimelineItem>
            
        </Timeline>
        <Button style="width:100%" v-if="!historyFetcher.hasDone()" @click="fetchMore('history')">显示更多</Button>
    </div>
</template>

<style lang="stylus">

        
</style>
<script type="text/javascript" >
    import Post from "../post/timeline-post.vue"
    
    class PostsFetcher{
        constructor(options){
            this.options = options;
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
            return $vm.$http.get("/g/Post")
                .query({
                        condition:{
                            "groups":$vm.groupId,
                            "ts":{[$cmp]:boundaryTS}
                        },
                        sortField
                        ,limit: $vm.batchSize
                    })
                    .then((res)=>{
                        var list = res.body;
                        this.options.boundaryTS = list && list.length && list[list.length-1].ts;
                        this.isDone = list.length<$vm.batchSize;
                        return Promise.resolve(res.body)
                    })
        }
        hasDone(){
            return this.isDone;
        }
        
    }
    
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
                , batchSize:3
            }
        }
        , computed:{
            progressTS(){
                return this.$store.state.progressTS;
            }
        }
        , methods:{
            async fetchMore(typeStr){
                var fetcher = this[typeStr+"Fetcher"];
                
                if(fetcher.hasDone()){
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
                this.historyList.unshift(this.pendingPost);
                this.futureList.shift();
                if(this.pendingPost.ts>this.progressTS){
                    this.$store.commit("setProgressTS", this.pendingPost.ts);
                }
            }
        }
        ,watch:{
            newPost(){
                this.historyList.unshift(this.newPost)
            }
            , progressTS(){
                var near = this.futureList[0];
                this.pendingPost = near;
                if(this.futureList.length<2 && !this.futureFetcher.hasDone()){
                    this.fetchMore("future");
                }
                if(!near){
                    return;
                }
                if(this.progressTS>=near.ts){
                    this.showPendingNow();
                }
            }
        }
        ,created(){
            
//            console.log("typeof progressTS", typeof this.progressTS, this.progressTS)
//            console.log("timelineposts created for group:", this.groupId, this)
            this.futureFetcher = new PostsFetcher({
                                            $vm:this
                                            , $cmp:"$gte" 
                                            , sortField:"+ts"
                                            , boundaryTS:this.progressTS
            })
            
            this.historyFetcher = new PostsFetcher({
                                            $vm:this
                                            , $cmp:"$lte" 
                                            , sortField:"-ts"
                                            , boundaryTS:this.progressTS
                
            })
            
            this.fetchMore("future");
            this.fetchMore("history");
        }
    }
</script>