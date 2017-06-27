export default {
    namespaced:true,
    state:{
        creatingGroup:false,
        groupList:[]
    }
    ,getters:{
    }
    ,mutations:{
        createGroup(state){
            state.creatingGroup = true;
        }
        , createGroupDone(state, group){
            state.creatingGroup = false;
            state.groupList.unshift(group)
        }
        , cancelCreateGroup(state){
            state.creatingGroup = false;
        }
        , setGroupList(state, groupList){
            state.groupList = groupList
        }
        , setGroupMembers(state, {groupId, members}){
            state.groupList.forEach((item)=>{
                if(groupId == item._id){
                    item.members = members;
                }
            })
        }
    }
    ,actions:{
        loadGroupList({state, commit}){
            return $$vm.$http.get("/g/Group")
            .query({
                limit:1000
                , populate:{
                    path:"creator",
                    select:"name figureUrl"
                }, sortField:{countMembers:-1}
            })
            .then((res)=>{
                //state.groupList = res.body;
                commit("setGroupList", res.body);
            }, (err)=>{
                console.error(err)
            })
        }
        , getGroupById({state}, gid){
            console.log(state, gid)
            
            var group = state.groupList.find((group)=>group._id===+gid);
            console.log("group:", group)
            return group;
        }
        , setGroupMembers({commit, rootState}, {groupId, members}){
            commit("setGroupMembers", {groupId, members});
            console.log("arguments", arguments)
            var curGroup = rootState.curGroup;
            if(curGroup && curGroup._id === groupId){
                commit("setCurGroupMember", members, {root:true})
            }
            
        }
    }
}