<template>
    <div>
        <ul class="list-inline group-item header">
            <li>
                <Input 
                    type="text"
                    name="" 
                    icon="search" 
                    placeholder="同学会名称"
                    v-model="groupName"
                    @keyup.esc.native="groupName=''"
                    />
            </li>
            <li>
                <Input 
                    type="text"
                    name="" 
                    icon="search" 
                    placeholder="发起人"
                    v-model="creatorName"
                    @keyup.esc.native="creatorName=''"
                    />
            </li>
            <li>
                <small class="pull-right">同学数</small>
            </li>
            
        </ul>
        <transition-group tag="ul" name='el-zoom-in-top' class='plain'>
            <li :key="id" v-for="{name, creator, intro, _id:id, members} in filteredList">
                <ul class='list-inline group-item' :key="id">
                    <li><router-link :to='`/group/${id}`' :title="name">{{name}}</router-link></li>
                    <li v-if="creator && creator.name">
                        <router-link :to="`/u/${creator._id}`">
                            <img :src="creator.figureUrl" width="16px" height="16px" style="vertical-align:middle;margin-right:.5rem"/>
                            <span style="vertical-align:middle" >{{creator.name}}</span>
                        </router-link>
                    </li>
                    <li v-if="members" @click="$router.push('/group/'+id)" >
                        <Tag class='pull-right'  
                            :type="members.length>1?'success':'grey'">{{members.length}}</Tag>
                    </li>
                    
                </ul>
            </li>
        </transition-group>
        <footer>
            <Button type="success"  style="width:100%" @click="createGroup">没有找到你在学习的? 发起一个同学会</Button>
        </footer>
    </div>
</template>

<style lang="stylus" scoped>
    .el-zoom-in-top-move 
         transition: transform 1s;

    footer
        padding:3em 1em;
        
    ul.group-item
        padding:0;
        border-bottom:1px solid darken(white, 10%)
        width:100%;
        
        &.header
            border:none;
            li
                vertical-align:middle;
                color:#8391a5;
            
        &:hover:not(.header)
            cursor:pointer;
            border-bottom:1px solid darken(white,30%)
        
        li a
            overflow:hidden
            text-overflow:ellipsis;
            white-space:nowrap;
            display:inline-block;
            padding:1em 0 0;
            width:100%;

            
        li:nth-child(1)
            width:48%;
            padding-right:0em;
            font-weight:bold;

        li:nth-child(2)
            width:29%;
            padding-right:0em;
            
        li:nth-child(3)
            width:20%;


</style>

<script type="text/javascript">
    import {mapState} from "vuex";
    
    export default {
        data(){
            return {
                 groupName:""
                , creatorName:""
            }
        },
        computed:{
             ...mapState("group/", ["groupList"]),
             filteredList(){
                var filtered = this.groupList;
                
                var filterFn = (name, fieldFn)=>{
                    if(!name){
                        return filtered;
                    }
                    return filtered.filter((item)=>{
                        var regex = new RegExp(name,"i");
                        return regex.test(fieldFn(item));
                    })
                }
                filtered = filterFn(this.creatorName, (item)=>item.creator.name);
                filtered = filterFn(this.groupName, (item)=>item.name);
                return filtered;
            }
        },
        async created(){
            var loadingInstance = this.$loading();
            await this.$store.dispatch("group/loadGroupList");
            loadingInstance.close();
        }
        ,methods:{
            async createGroup(){
                await this.$store.dispatch('user/ensureLogin')
                this.$store.commit("group/createGroup")
            }
        }
    }
    
</script>