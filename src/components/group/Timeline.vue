<template>
    <div>
        <Editor key="editor" v-model="newCnt" @typeChanged="typeChanged" :defaultType="postType"></Editor>
        
        <TimelinePosts :key="groupInfo._id" :groupId="groupInfo._id" :newPost="newPost" ></TimelinePosts>
    </div>
</template>

<style lang="stylus">
    
</style>
<script type="text/javascript" >
    import TimelinePosts from "./TimelinePosts.vue"
    import {mapState, mapGetters} from "vuex"
    
    export default {
        components:{
            TimelinePosts
        },
        props:["groupInfo"]
        ,data(){
            return {
                newCnt:"",
                newPost:{},
                postTypeBySelect:""
            }
        }
        ,computed:{
            ...mapGetters("user/", ['progressTS'])
            , postType(){
                if(this.postTypeBySelect){
                    return this.postTypeBySelect
                }
                var groupCreator = this.groupInfo.creator;
                var uid = this.$store.state.user._id;
                if(groupCreator === uid){
                    return "短笔记"
                }
                return "提问"
            }
        }
        ,watch:{
            async newCnt(){
                console.log("newCnt")
                if(!this.newCnt){
                    return;
                }
                await this.$store.dispatch("user/ensureLogin")
                
                var {_id:id} = this.groupInfo;
                var {name, figureUrl:creatorFigureUrl, _id:creatorId} = this.$store.state.user;
                this.$http.post("/g/Post")
                    .send({
                        html:this.newCnt,
                        creator:creatorId,
                        creatorName:name
                        , creatorFigureUrl:creatorFigureUrl
                        , ts: this.progressTS //this.totalTS //s use progressTS here?
                        , longTS: this.progressTS*1001+Math.floor(Math.random()*999)
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
            typeChanged(type){
                this.postTypeBySelect = type;
            }
        }
    }
</script>