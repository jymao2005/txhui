<template>
    <div class="container">
        <div class="header">
            <tag type="" class="pull-right">学习总时长 {{formatTS(totalTS)}}
                <span style="margin-left:1em" v-if="Math.abs(totalTS-progressTS)>10">进度 {{formatTS(progressTS)}}</span>
            </tag>

            <Breadcrumb>
                <BreadcrumbItem :to="{path:'/'}">首页</BreadcrumbItem>
                <BreadcrumbItem>{{groupInfo.name}}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <Tabs v-model="activeName">
            <tab-pane label="综合" name="combined"></tab-pane>
            <tab-pane label="短笔记" name="s-notes"></tab-pane>
            <tab-pane label="问答" name="questions"></tab-pane>
        </Tabs>
        <router-view v-if="groupInfo._id" :groupInfo="groupInfo"></router-view>        
    </div>

</template>

<style lang="stylus">
    .header 
        padding: .8em 0 .5em;
        @media (max-width:720px)
            margin-left:3rem;
        
</style>

<script type="text/javascript" >

    import {mapState} from "vuex"
    
    export default {
        name:"Group",
        data(){
            return {
                activeName:this.$route.name,
                groupInfo:{},
                totalTS:0
            }
        },
        watch:{
            "$route.name":function(){
              this.activeName = this.$route.name;
            },
            activeName(){
                this.$router.push({name:this.activeName});
            },
            id(){
                this.fetchGroupInfo();
            },
            totalTS(){

                var info = {
                                totalTS:this.totalTS
                                , progressTS:this.$store.state.progressTS
                            };
             //   localStorage.setItem("group_"+this.id, JSON.stringify(info));
            }
        },
        computed:{
            id(){
                return this.$route.params.groupId;
            },
            ...mapState(["progressTS"])
        },
        methods:{
            fetchGroupInfo(){
                if(!this.id){
                    return;
                }
                this.$http.get("/g/Group/"+this.id)
                    .then((res)=>{
                        this.groupInfo = res.body;
                    })
            },
            loadTotalTS(){
//                var info = JSON.parse(localStorage.getItem("group_"+this.id)) 
//                            || {totalTS:0, progressTS:0};
                
                var info = this.$store.state.user.progresses[this.id] 
                            || {totalTS:0, progressTS:0};
                this.totalTS = info.totalTS;
                
                var progressTS = info.progressTS || this.totalTS;
                this.$store.commit("setProgressTS", progressTS);
            }
        },
        created(){
            this.fetchGroupInfo();
            this.$store.dispatch("user/subscrGroup", this.id)
        },
        mounted(){
           this.loadTotalTS();

            this.timer = setInterval(()=>{
                if(this.groupInfo._id){
                    this.totalTS++;
                    this.$store.commit("incrProgressTS");
                    this.$store.commit("user/incrProgress", this.id);

                }
            },1000)    
        },
        components:{
        },
        beforeDestroy(){
            this.timer && clearInterval(this.timer);
            this.timer = null;

            this.$store.dispatch("user/saveProgressOnServer", this.id);
        }
    }
</script>