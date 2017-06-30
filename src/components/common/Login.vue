<template>
    <Dialog :visible="needLogin" v-if="needLogin" size="small" @visible-change="$event || cancelLogin()">
        <iframe @load="startCheck" frameborder="no" 
                class="login" :src="url" 
                ref="loginFrame" 
                :name="iframeInitName"
                />
    </Dialog>
</template>

<script>
    import {mapMutations, mapActions} from "vuex"
    export default {
        data(){
            return {
                url:"https://graph.qq.com/oauth2.0/authorize?client_id=100477447&response_type=token&scope=get_user_info&redirect_uri=http%3A%2F%2Fwww.jymao.com%2Fqq-login-ok.html?proxy="+location.host+"%2Fproxy.html"
                , iframeInitName:"loginStart"
                
            }
        },
        methods:{
            ...mapMutations("user/",[
                "cancelLogin"
            ])
            , ...mapActions("user/", [
                "loginOnServer"
            ])
            ,startCheck(){
                //store full path for mobile qq login callback
                var path = this.$route.fullPath;
                if(path.indexOf("/login")==-1){
                    window.localStorage.setItem("lastPath", this.$route.fullPath);
                }
                
                var node = this.$refs.loginFrame;
                
                var initName = this.iframeInitName;
                check();
                var self = this;
                function check(){
                    
                    setTimeout(()=>{
                        try{
                            var name = node.contentWindow.name;
                            console.log("name:",name)
                        }
                        catch(e){
                            setTimeout(check, 200);
                            return;
                        }
                        if(initName !== name){
                            var info = JSON.parse(name);
                            console.log("info:", info)
                            self.loginOnServer(info)
                        }
                        else {
                            check();
                        }
                        
                    },200)
                }
            }
        }
        ,computed:{
            needLogin(){
                var {hasLogin, needLogin} = this.$store.state.user;
                return !hasLogin && needLogin;
            }
        }
        
    }
</script>

<style lang="stylus">
    
    .login
        width: 100%;
        min-height:30rem;
    
</style>