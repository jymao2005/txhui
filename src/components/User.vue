<template>
    <div class="container">
        <div class="header">
            <Breadcrumb>
                <BreadcrumbItem :to="{path:'/'}">首页</BreadcrumbItem>
                <BreadcrumbItem>个人主页</BreadcrumbItem>
            </Breadcrumb>            
        </div>
        <img :src="user.figureUrl100" width="100px" height="100px"></img>
        <span>{{user.name}}</span>
        <span>{{user.gender}}</span>
        <span>{{user.intro}}</span>
        <h5>同学会</h5>
        <ul>
            <li v-for="group in user.groups"><router-link :to="`/group/${group._id}`">{{group.name}}</router-link></li>
        </ul>
    </div> 
    
</template>

<script type="text/javascript">
    export default {
        name:"User",
        data(){
            return {user:{}}
        }
        , async created(){
            var uid = this.$route.params.userId;
            var res = await this.$http.get("/g/User/"+uid)
                                .query({
                                    populate:{
                                        path:"groups",
                                        select:"name"
                                    }
                                })
            this.user = res.body;
        }
    }
    
</script>