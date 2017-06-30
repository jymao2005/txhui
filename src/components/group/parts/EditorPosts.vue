<template>
    <div>
        <Editor key="editor" v-model="newCnt" @typeChanged="typeChanged" :defaultType="postType"></Editor>
        
        <Component :is="compName" :key="groupInfo._id" :groupId="groupInfo._id" :newPost="newPost" ></Component>
    </div>
</template>

<style lang="stylus">
    
</style>
<script type="text/javascript" >
    import TimelinePosts from "./TimelinePosts.vue"
    import NewestPosts from "./NewestPosts.vue"
    import api from "../../../mixin/api.js"
    import {mapState, mapGetters} from "vuex"
    
    export default {
        mixins:[api],
        components:{
            TimelinePosts,
            NewestPosts
        },
        props:["groupInfo", "compName"]
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
               // var groupCreator = this.groupInfo.creator;
            //    var uid = this.$store.state.user._id;
             //   if(groupCreator === uid){
                    return "短笔记"
             //   }
             //   return "提问"
            }
        }
        ,watch:{
            async newCnt(){
                console.log("newCnt")
                if(!this.newCnt){
                    return;
                }
                await this.$store.dispatch("user/ensureLogin")
                
                var {_id:groupId} = this.groupInfo;
                this.newPost = await this.publishPost({
                    html:this.newCnt,
                    creator:this.$store.state.user
                    , ts: this.progressTS //this.totalTS //s use progressTS here?
                    , groupId
                    , type:this.postType||"短笔记"
                })
                this.newCnt="";
            }
        },
        methods:{
            typeChanged(type){
                this.postTypeBySelect = type;
            }
        }
    }
</script>