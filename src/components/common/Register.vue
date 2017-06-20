<template>
    <Dialog title="欢迎你, 新同学. " :visible="needRegister" size="mini"
         @visible-change="$event || cancelRegister()">
        <Form style="width:25rem" 
                labelWidth="5rem" 
                :rules="rules" 
                :model="formData"
                ref="form"
                >
            <FormItem label="用户名" prop="name">
                <Input v-model.trim="formData.name" autofocus ></Input>
            </FormItem>
            <FormItem label="自我介绍" prop="intro">
                <Input placeholder="请简单介绍下自己" v-model.trim="formData.intro"></Input>
            </FormItem>
        </Form>
        <Button style="width:100%" type="success" @click="registerNow">注册</Button>
    </Dialog>
</template>

<script>
    import {mapMutations, mapActions} from "vuex"
    export default {
        data(){
            return {
                formData:{
                    name: this.$store.state.user.nickname,
                    intro:""
                }
                , rules:{
                    name:[
                          , { required:true, message:"不能为空"}
                          , { 
                                pattern:new RegExp("^[\\u4e00-\\u9fa5_a-zA-Z0-9]+$")
                                , message:"字符必须是: 中文, 英文, 数字, 下划线"
                          }
                         ]
                    , intro:[
                        {
                        }
                    ]
                }
            }
        },
        methods:{
            ...mapMutations("user/",[
                "cancelRegister"
            ])
            , ...mapActions("user/", [
                "registerOnServer"
            ])
            ,registerNow(){
                this.$refs.form.validate((valid)=>{
                    valid && this.registerOnServer(this.formData);
                })
            }
        }
        ,computed:{
            needRegister(){
                var {needRegister} = this.$store.state.user;
                return needRegister;
            }
        }
        ,watch:{
            "$store.state.user.nickname": function(){
                this.formData.name = this.$store.state.user.nickname;
            }
        }
    }
</script>

<style lang="stylus">
    
    .login
        width: 100%;

</style>