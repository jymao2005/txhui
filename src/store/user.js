
var defaultUser = {
    hasLogin:false,
    needLogin:false,
    needRegister:false,
    name:"",
    groups:[],
    progresses:{},
    nickname:""
}
export default {
    namespaced:true,
    state:Object.assign({}, defaultUser)
    ,mutations:{
        save(state, user){
            Object.assign(state, user);
            window.localStorage.setItem("userInfo", JSON.stringify(state));
        },
        loginNow(state){
            state.needLogin = true;
        },
        loginDone(state){
            state.needLogin = false;    
        },
        cancelLogin(state){
            state.needLogin = false;
        },
        hasLogin(state){
            state.needLogin = false;
            state.hasLogin = true;
        },
        logout(state){
            for(var key in state){
                state[key] = null;
            }  
            Object.assign(state, defaultUser);
            console.log(state)
            window.localStorage.removeItem("userInfo");
            $$vm.$message({message:"注销成功", type:"success"});
        }
        ,subscrGroup(state, {groupId, groups}){
            //when one user enter a group, we say he subscribe the group.
            state.groups = groups
            if(!state.progresses[groupId]){
                //for case that reenter a group
                state.progresses[groupId]={
                    totalTS:0,
                    progressTS:0
                }
            }
            window.localStorage.setItem("userInfo", JSON.stringify(state));
        }
        ,quitGroup(state,{groupId, groups}){
            state.groups = groups
            state.progresses[groupId] = null;                    
            window.localStorage.setItem("userInfo", JSON.stringify(state));
        }
        ,incrProgress(state,id){
            var progress = state.progresses[id];
            if(!progress){
                progress = state.progresses[id] = {
                    totalTS:0,
                    progressTS:0
                };
            }
            
            progress.totalTS++;
            progress.progressTS++;
            window.localStorage.setItem("userInfo", JSON.stringify(state));
        }
        ,setProgress(state, id, newProgress){
            var progress = state.progresses[id];
            progress.progressTS = newProgress;
            window.localStorage.setItem("userInfo", JSON.stringify(state));
        }
        ,newUser(state, nickname){
            state.needRegister = true;
            state.needLogin = false;
            
            state.nickname = nickname;
        },
        registerDone(state){
            state.needRegister = false;
        },
        cancelRegister(state){
            state.needRegister = false;
        }
    }
    ,actions:{
        async loadUser({commit}, $http){
            var user = JSON.parse(window.localStorage.getItem("userInfo"));
            if(user) {
                commit("save", user)
            }
            var res = await $http.get("/self");
            user = res && res.body && res.body.user;
            if(user){
                commit("save", res.body.user);
            }
        }
        , ensureLogin({state, commit}){
            return new Promise((resolve, reject)=>{
                if(state.hasLogin){
                    resolve(true);
                    return;
                }
                
                commit("loginNow")
                $$vm.$store.watch((state)=>state.user.hasLogin, ()=>{
                    resolve(true)
                })
            })
        }
        , async loginOnServer({state, commit}, info){
            var res = await $$vm.$http.post("/login").send(info)
            var ret = res.body;
            switch(ret.status){
                case "newUser":
                    commit("newUser", ret.nickname)
                    break;
                case "ok":
                    commit("hasLogin");
                    commit("save", ret.user);
                    $$vm.$message({message:"登录成功", type:"success"})
                    break;
                default:
                    $$vm.$message("哎呀, 服务器出问题了...")
                    break;
            }
        }
        , async registerOnServer({state, commit}, info){
                var res = await $$vm.$http.post("/register").send(info)
                var ret = res.body;
                switch(ret.status){
                    case "ok":
                        commit("registerDone");
                        commit("hasLogin");
                        commit("save", ret.user);
                        break;
                    default:
                        $$vm.$message("注册失败.可能服务器出问题了...")
                        break;
                }
        }
        , async saveProgressOnServer({state,commit}, groupId){
            var progress = state.progresses[groupId];
            if(progress && state.hasLogin){
                await $$vm.$http.post("/user/progress")
                    .send({groupId:groupId, progress:progress})
            }
        }
        ,async subscrGroup({state, commit, dispatch}, groupId){
            if(state.groups.indexOf(parseInt(groupId))!=-1 || !state.hasLogin){
                return;
            }
            
            var res = await $$vm.$http.post("/user/joinGroup")
                    .send({groupId:groupId});
            var data = res.body;
            commit("subscrGroup", {groupId, groups:data.groups})
            commit("group/setGroupMembers",{ groupId, members:data.members}, {root:true})
        }
        ,async quitGroup({state, commit, dispatch, rootState}, groupId){
            if(state.groups.indexOf(groupId)==-1 || !state.hasLogin){
                return;
            }

            var res = await $$vm.$http.post("/user/quitGroup")
                    .send({groupId:groupId});
            var data = res.body;
            commit("quitGroup", {groupId, groups:data.groups})
            commit("group/setGroupMembers",{ groupId, members:data.members}, {root:true})
            
        }

    }
}
 
