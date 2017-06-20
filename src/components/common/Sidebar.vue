<template>
    <div class='' v-clickoutside="()=>showMenu=false">
        <Button class="sidebarBtn" type="text" @click="toggleSidebar" size="mini"><IconFA name="bars" style="box-sizing:initial"></IconFA></Button>
        
        <div class="sidebar" >
            <transition name="slideIn">
                <Menu theme="light" v-show="showMenu">
                    
                    <MenuItem index="1"><router-link to="/">首页</router-link></MenuItem>
                    <MenuItem index="2" v-if="!hasLogin" @click="login">登录</MenuItem>
                    <MenuItem index="3" @click="logout" v-if="hasLogin">注销</MenuItem>
                </Menu>
            </transition>
        </div>
    </div>
</template>

<style lang="stylus" scoped>
    .sidebar, .sidebarBtn
        position:absolute;
        left:.5rem;
        top:.5rem;
        z-index:2;
    
    .sidebar
        top:2.5rem;
        min-width:10rem;
        
        a
            color:inherit;

  .slideIn-enter-active, .slideIn-leave-active {
    transition: left .2s;
    position:relative;
  }
  .slideIn-leave, .slideIn-enter-active {
     left:0;
  }
  .slideIn-enter, .slideIn-leave-to {
    left:-100%;
  }
    
</style>

<script type="text/javascript">

    
    export default {
        data(){
            return {
                showMenu:false
            }
        }
        ,computed:{
            hasLogin(){
                return this.$store.state.user.hasLogin;
            }
        }
        ,methods:{
            toggleSidebar(){
                this.showMenu = !this.showMenu;
            },
            async logout(){
                await this.$http.post("/logout")
                this.$store.commit("user/logout");
            },
            login(){
                this.$store.commit("user/loginNow")
            }
        }
    }
</script>