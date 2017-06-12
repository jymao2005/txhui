<template>
    <Dialog :modal="true" 
            title="评论"
            size= "small"
            :visible="visible" :beforeClose="()=>$emit('close')">
        <div>
            <Editor placeholder="写评论" v-model="newCmt"></Editor>
        </div>
        <div>
            <ul class="plain">
                <li v-for="cmt in cmtList" style="margin-bottom:1em">
                    <Comment :cmt="cmt"></Comment>
                </li>
            </ul>
        </div>
    </Dialog>
</template>

<style lang="stylus" >

</style>
<script type="text/javascript">
    import Editor from "../Editor.vue";
    import Comment from "./Comment.vue";
    
    export default {
        props:["visible", "creator", "rootPostId"],
        components:{Comment},
        data(){
            return {
                newCmt:"",
                cmtList:[]
            }
        }
        ,watch:{
            newCmt(){
                if(!this.newCmt){
                    return;
                }
                this.$http.post("/g/Comment")
                    .send({
                        html:this.newCmt
                        ,creator:this.creator._id
                        ,root:this.rootPostId
                        , creatorName:this.creator.name
                    })
                    .then((res)=>{
                        var cmt = res.body;
                        this.newCmt = "";
                        this.cmtList.unshift(cmt)
                    })
            }
        }
        ,created(){
            this.$http.get("/g/Comment")
                .query({condition:{root:this.rootPostId}})
                .then((res)=>{
                    this.cmtList = res.body;
                }).catch((err)=>{})
        }
    }
</script>