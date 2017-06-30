<template>
    <Dialog title="发起同学会"
            size="mini" 
            :visible="creatingGroup" 
            v-if="creatingGroup"
            @visible-change="$event || cancelCreateGroup()">
        <Form style="min-width:25rem"
            :rules="rules"
            :model="formData"
            ref="form">
            <FormItem label="名称" prop="name">
                <Input placeholder="例如: 同学《Javascript权威指南》"
                v-model.trim="formData.name"></Input>
            </FormItem>
            <FormItem label="同学会介绍" prop="intro">
                <Input type="textarea" 
                        :rows="3"
                        v-model.trim="formData.intro"
                        placeholder="学习什么, 为什么学习它, 有什么期望, 等等(150字内)"></Input>
            </FormItem>
            <Button type="success" @click="createGroupNow" style="width:100%">发起</Button>
        </Form>
    </Dialog>
</template>

<script>
    import {mapState, mapMutations} from "vuex"
    import api from "../../mixin/api";
    
    export default {
        name:"CreateGroup",
        mixins:[api],
        data(){
            return {
                formData:{
                    intro:"",
                    name:""
                },
                rules:{
                    name:[{
                        min:5, max:20, message:"字数在5-20之间"
                    }, {
                        required:true,message:"不能为空"
                    }]
                    ,intro:[{
                        min:10, max:150, message:"字数在10-150之间"
                    }, {
                        required:true,message:"不能为空"
                    }]
                }
            }
            
        },
        computed:{
            ...mapState("group/",["creatingGroup"])
        }
        , methods:{
            ...mapMutations("group/", ["createGroupDone","cancelCreateGroup"])
            , createGroupNow(){
                this.$refs.form.validate((valid)=>{
                    if(!valid){
                        return;
                    }
                    var {name:creatorName, _id:creator, figureUrl} = this.$store.state.user;
                    var {name, intro} = this.formData;
                    this.$http.post("/g/Group")
                    .send({
                        name,
                        intro,
//                        creatorName,
                        creator,
//                        figureUrl
                    }).then((res)=>{
                        var group = res.body;
                        group.creator = {
                            _id:creator,
                            name:creatorName,
                            figureUrl
                        }
                        this.createGroupDone(group);
                        this.$store.dispatch("user/subscrGroup", group._id)
                        
                        console.log(this)
                        this.publishPost({
                            html:"<p>"+intro+"</p>",
                            creator:group.creator,
                            ts:0,
                            groupId:group._id,
                            type:"资料"
                        })

                        this.formData = {intro:"", name:""}
                        
                    },(err)=>{
                        this.$message("哎呀, 服务器出问题了...")
                    })
                });
            }
        }
    }
</script>