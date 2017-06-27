<template>
    <div>
        <keep-alive exclude="Group,User">
            <router-view></router-view>
        </keep-alive>
        
        <Login></Login>    
        <Register></Register>
        <CreateGroup></CreateGroup>
        <Sidebar></Sidebar>
    </div>

</template>


<style lang="stylus">
    * 
        box-sizing:border-box;
    
    .gray { 
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        
        filter: grayscale(100%);
    	
        filter: gray;
    }        
    .fa-icon
        padding:.5em;
    
    .el-button .fa-icon
        padding:0

    html,body
        font-size:14px;
        
    p 
        margin:1em 0
        
    h1{
        font-size: 26px;
        font-weight: normal;
    }
    h2{
        font-size: 20px;
        font-weight: normal;
    }
    h3{
        font-size: 16px;
        font-weight: normal;
    }
    h4{
        font-size: 14px;
        font-weight: normal;
    }
    h5{
        font-size: 12px;
        font-weight: normal;
    }
    h6{
        font-size: 12px;
        font-weight: normal;
    }

    blockquote{
        padding: 1em 0;
        margin:0;
        line-height: 1.5;
        color: #666;
        font-size: 14px;
    }

    .container {
        max-width:650px;
        margin:auto;
    }
    
    a
        color:#48576a;
        text-decoration:none;
        
        &:hover
            color:#20a0ff;
            cursor:pointer;
        
    .clearfix:after
        clear:both;
        display:block;
        content:" "
        
    .pull-right
        float:right;
    .pull-left
        float:left;
        
    ul.list-inline 
        li
            display:inline-block;
            padding:0 1em;
    
    ul.plain
        list-style:none;
        margin:0;
        padding:0;

    .el-popover
        max-width:650px;
        
</style>

<script type="text/javascript">
    import Login from "./components/common/Login.vue";
    import Register from "./components/common/Register.vue";
    import CreateGroup from "./components/common/CreateGroup.vue";
    import Sidebar from "./components/common/Sidebar.vue";
    
    export default {
        data(){
            return {}
        },
        components:{Login, Register, CreateGroup, Sidebar},
        created(){
            this.$store.dispatch("user/loadUser", this.$http);
        }
    }
    
</script>