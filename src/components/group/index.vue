<template>
    <div class="container">
        <div class="header">
            <div class="pull-right">
                <tag type="">学习总时长 {{formatTS(totalTS)}}
                    <span style="margin-left:1em" v-if="Math.abs(totalTS-progressTS)>10">进度 {{formatTS(progressTS)}}</span>
                </tag>
                <ReviewPopover :value="progressTS"
                        v-once
                        @input='setProgressTS'
                        ></ReviewPopover>                
            </div>

            <Breadcrumb>
                <BreadcrumbItem :to="{path:'/'}">首页</BreadcrumbItem>
                <BreadcrumbItem>{{groupInfo.name}}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        
        <Members></Members>
        
        <Tabs v-model="activeName">
            <tab-pane label="时间线" name="timeline"></tab-pane>
            <tab-pane label="最新" name="newest"></tab-pane>
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

    import {mapState, mapGetters, mapActions} from "vuex";
    import ReviewPopover from "./parts/ReviewPopover";
    import Members from "./parts/Members"
    export default {
        name:"Group",
        components:{
            ReviewPopover,
            Members
        },
        data(){
            return {
                activeName:this.$route.name,
                groupInfo:{}
            }
        },
        watch:{
            "$route.name":function(){
              this.activeName = this.$route.name;
            },
            activeName(){
                this.$router.push({name:this.activeName});
            },
          /*  id(){
                this.fetchGroupInfo();
            }*/
        },
        computed:{
            id(){
                return this.$route.params.groupId || this.groupInfo._id;
            },
            ...mapGetters("user/", ["progress", "totalTS", "progressTS"])
            , curGroup(){
                return this.getGroupById(this.id);
            }
        },
        methods:{
            ...mapActions("group/", ["getGroupById"]),
            fetchGroupInfo(){
                if(!this.id){
                    return;
                }
                this.$http.get("/g/Group/"+this.id)
                    .query({
                        populate:{
                            path:"creator",
                            fields:"name figureUrl"
                        }
                    })
                    .then((res)=>{
                        this.groupInfo = res.body;
                        this.$store.commit("curGroup", this.groupInfo);
                    })
            }
            ,setProgressTS(ts){
                this.$store.dispatch("user/setProgressTS", ts);
                setTimeout(()=>{
                    $$vm.$emit("resetProgressTS");
                },10)
            }
        },
        async created(){
            var groupInfo = await this.curGroup;
            if(!groupInfo){
                this.fetchGroupInfo();
            }
            this.groupInfo = groupInfo || {_id:this.id};
            this.$store.commit("curGroup", this.groupInfo);
       //     this.$store.dispatch("user/subscrGroup", this.id);
        },
        mounted(){
            var step = Math.floor(Math.random()*30+30)

            this.timer = setInterval(()=>{
                if(this.groupInfo._id){
                    this.$store.dispatch("user/incrProgressTS");
                    
                    if(!this.progressTS%step){
                        this.$store.dispatch("user/saveProgress");
                        console.log("save")
                    }
                }
            },1000)    
        },
        beforeDestroy(){
            this.timer && clearInterval(this.timer);
            this.timer = null;

            this.$store.dispatch("user/saveProgress", this.id);
            this.$store.commit("curGroup", {});
        }
    }
</script>