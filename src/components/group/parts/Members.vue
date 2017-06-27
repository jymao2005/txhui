<template>
    <ul class="plain list-inline compact">
        <li v-for="member in members.slice(0,8)">
            <router-link :to='`/u/${member._id}`' style="width:2rem;height:2.2rem">
                <img :src="member.figureUrl" 
                        :title="member.name"
                        class="small-figure"
                        :class="{creator:member.groupRole=='creator'}"
                        ></img>
            </router-link>
        </li>
        
        <li v-if="this.curGroup.members">
            <small>已有<Tag type="success">{{members.length}}</Tag>位同学</small>
            <Button size="mini" type="text" v-if="!hasJoin" @click="join">立即加入</Button>
            <Button size="mini" type="plain" v-if="hasJoin" @click ="quit" title="点击退出同学会">
                已加入
            </Button>
        </li>

    </ul>
</template>

<script type="text/javascript">
    import {mapState, mapGetters, mapActions} from "vuex"
    export default {
        data(){
            return {
                members:[]
            }
        },
        computed:{
            ...mapState(["curGroup"]),
            ...mapGetters("user/", ["uid"])
            , hasJoin(){
                var members = this.curGroup && this.curGroup.members;
                return this.uid && members && members.indexOf(this.uid)!=-1;
            }
            , isCreator(){
                return this.curGroup.creator._id === this.uid;
            }
        },
        watch:{
            curGroup(){
                console.log("curGroup changed")
                this.fetchMembers();
            }    
        },
        methods:{
            ...mapActions("user/", ["subscrGroup", "quitGroup", "ensureLogin"]),
            async fetchMembers(){
                var curGroup = this.curGroup;
                if(curGroup && curGroup.members){

                    var uids = this.curGroup.members;
                    var res = await this.$http.get("/g/User")
                    .query({
                        ids:uids,
                        select:"name figureUrl status"
                    });
                    var all = res.body;
                    var creator = this.curGroup.creator;
                    var creatorId = creator._id;
                    var idx = all.findIndex((item)=>item._id===creatorId);
                    idx!=-1 && all.splice(idx,1);
                    
                    all.unshift(Object.assign({groupRole:"creator"}, creator));
                    
                    this.members = all;
                }
            }
            ,async join(){
                console.log("join")
                await this.ensureLogin();
                console.log("login")
                await this.subscrGroup(this.curGroup._id);
                console.log("subscrGroup")
            }
            , async quit(){
                await this.ensureLogin();
                if(this.isCreator){
                    this.$message({message:"你是此同学会的发起人, 发起人还不能退出"
                                    , type:"warning"})
                    return;
                }
                await this.quitGroup(this.curGroup._id);
            }
        },
        async mounted(){
            this.fetchMembers();
        }
    }
</script>

<style lang='stylus'>
    .small-figure
        width:2rem;
        height:2.2rem;
        border-bottom:.2rem solid transparent

    ul.compact
        margin:1rem 0;
        li 
            padding:0rem .5rem;
            vertical-align:bottom

    .creator 
        border-color:orange
</style>

