<template>
    <div>
        <div v-if="!needModify">
            <header>
                <span>{{formatTS(post.ts)}}</span>
                <router-link :to="`/u/${post.creator}`" style="margin-left:2em">{{post.creatorName}}</router-link>     
            </header>
            <div class="post-content" v-html="post.html" style="font-size:1rem"></div>
            <footer style="color:grey;font-style:italic;border-bottom:1px dashed lightgrey">
                <span style="margin-right:1em">{{createdAt}}</span>
                <ButtonGroup>
                    <Button v-for="(cmd,idx) in cmds"
                            :key="idx"
                            style="border:none" size="small"
                            @click="onCmd(cmd)"
                        >
                        {{cmd.label}}
                        <span v-if="isFinite(cmd.num)">({{cmd.num}})</span>
                    </Button>
                </ButtonGroup>
            </footer>
        </div>
        
        <CommentDialog v-if="needCommentsBox"
                        @close="needCommentsBox=false"
                        :visible="needCommentsBox"
                        :creator ="me"
                        :rootPostId="post._id"
                        :key="post._id"
                        ></CommentDialog>
        
        <Editor :value="post.html" 
                v-if="needModify" 
                @input="updatePost" 
                @cancel="needModify=false"
                :needCancelBtn="true"
                >
        </Editor>
    </div>
</template>

<style lang="stylus" scoped>
    .el-button:not(:hover)
        color:grey
    
    .post-content
        padding:.5em 0 1em;
        line-height:1.6;
    
</style>

<style lang="stylus">
    .deleted
        color:grey;
        font-style:italic
</style>

<script>
    import CommentDialog from "./comment-dialog.vue";
    import {mapGetters} from "vuex"
    export default {
        props:["post"],
        components:{CommentDialog},
        computed:{
            ...mapGetters("user", {
                curUserId:"uid"
            }),
            createdAt(){
                return this.formatDatetime(this.post.createdAt);
            }
            ,ownerOrAdmin(){
                var uid = this.curUserId;
                var creator = this.post.creator;
                var groupCreator = this.$store.state.curGroup.creator;

                return (uid === creator || uid === groupCreator);
            }
            , me(){
                var {_id, name} = this.$store.state.user;
                return {
                    _id, name
                }
            },
            cmds(){
                console.log("cmds changed")
                var cmds = [{
                        label:"赞",
                        onClick(){
                            
                        }
                    },
                    {
                        label:"评论",
                        num:this.post.numChildren || 0,
                        onClick(){
                            this.needCommentsBox = true;
                        }
                    }
                ]
            
                if(this.ownerOrAdmin && this.post.status ==="publish"){
                    cmds.push({
                        label:"修改",
                        onClick(){
                            this.needModify = true;
                        }
                    }, {
                        label:"删除",
                        async onClick(){
                            try{
                                await this.$confirm("确定删除?", "提示", {type:"warning"});
                                
                                try{
                                    await this.$http.delete("/g/Post/"+this.post._id);
                                    this.$message("删除成功");
                                    this.post.html = "<span class='deleted'>内容已被删除</span>"
                                
                                }
                                catch(e){
                                    this.$message("删除失败.可能服务器出问题了, 请稍后再试试")
                                }
                            }
                            catch(e){
                                
                            }
                            
                        }
                    })
                } 
                return cmds;
            }
        }
        , data(){
            return {
                needCommentsBox:false,
                needModify:false
            }
        }
        , methods:{
            onCmd(cmd){
                cmd.onClick && cmd.onClick.bind(this)();
            },
            async updatePost(html){
                await this.$http.post("/g/Post/"+this.post._id)
                    .send({html:html});
                this.$message("修改成功");
                this.post.html = html;
                this.needModify = false;
            }
        }
        
    }
</script>