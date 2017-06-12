<template>
    <div>
        <header>
            <span>{{formatTS(post.ts)}}</span>
            <router-link :to="`/u/${post.creator}`" style="margin-left:2em">{{post.creatorName}}</router-link>     
        </header>
        <p v-html="post.html" style="font-size:1rem"></p>
        <footer style="color:grey;font-style:italic">
            <span style="margin-right:1em">{{createdAt}}</span>
            <ButtonGroup>
                <Button v-for="cmd in cmds"
                        style="border:none" size="small"
                        @click="onCmd(cmd)"
                    >
                    {{cmd.label}}
                    <span v-if="isFinite(cmd.num)">({{cmd.num}})</span>
                </Button>
            </ButtonGroup>
        </footer>
        
        <CommentDialog v-if="needCommentsBox"
                        @close="needCommentsBox=false"
                        :visible="needCommentsBox"
                        :creator ="{_id:1, name:'abc'}"
                        :rootPostId="post._id"
                        :key="post._id"
                        ></CommentDialog>
    </div>
</template>

<script>
    import CommentDialog from "./comment-dialog.vue"
    export default {
        props:["post"],
        components:{CommentDialog},
        computed:{
            createdAt(){
                return this.formatDatetime(this.post.createdAt);
            }
        }
        , data(){
            return {
                needCommentsBox:false,
                cmds:[{
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
                }]
            }
        }
        , methods:{
            onCmd(cmd){
                cmd.onClick && cmd.onClick.bind(this)();
            }
        }
        
    }
</script>