<template>
    <div>
        <Editor v-model="newCnt" @typeChanged="typeChanged()" :defaultType="postType"></Editor>
        
        <TimelinePosts :key="groupInfo._id" :groupId="groupInfo._id" :newPost="newPost" ></TimelinePosts>
    </div>
</template>

<style lang="stylus">
    
</style>
<script type="text/javascript" >
    import TimelinePosts from "./TimelinePosts.vue"
    import {mapState} from "vuex"
    
    export default {
        components:{
            TimelinePosts
        },
        props:["groupInfo"]
        ,data(){
            return {
                newCnt:"",
                newPost:{},
                postType:"提问"
            }
        }
        ,computed:{
            ...mapState(['progressTS'])
        }
        ,watch:{
            newCnt(){
                console.log("newCnt")
                if(!this.newCnt){
                    return;
                }
                var {name,_id:id} = this.groupInfo;
                this.$http.post("/g/Post")
                    .send({
                        html:this.newCnt,
                        creator:1,
                        creatorName:"测试用户1"
                        , creatorFigureUrl:""
                        , ts: this.progressTS //this.totalTS //s use progressTS here?
                        , groups:[id]
                        , type:this.postType||"短笔记"
                    }).then((res)=>{
                        this.newCnt="";
                        this.newPost = res.body;
                        
                    },(err)=>{
                        //error msg here
                    })
            }
        },
        methods:{
            typeChanged(post){
                this.postType = type;
            }
        }
    }
</script>