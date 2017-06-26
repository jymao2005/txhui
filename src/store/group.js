export default {
    namespaced:true,
    state:{
        creatingGroup:false,
        groupList:[]
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
                }, sortField:"-countMembers"
                
            })
            .then((res)=>{
                //state.groupList = res.body;
                commit("setGroupList", res.body);
            }, (err)=>{
                console.error(err)
            })
        }
    }
}