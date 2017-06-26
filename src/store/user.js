
var defaultUser = {
    hasLogin:false,
    needLogin:false,
    needRegister:false,
    name:"",
    groups:[],
    progresses:{},
    nickname:"",
    _id:0
}
export default {
    namespaced:true,
    state:Object.assign({}, defaultUser)
    ,getters:{
        uid(state){
            return state._id
        },
        localStoreName(state){
            return state.hasLogin?"userInfo":"visitorInfo"
        },
        progress(state, getters, rootState, rootGetters){
            var gid = rootGetters.curGroupId;
            return gid && state.progresses[gid];
        }
        , totalTS(state, getters){
            return (getters.progress && getters.progress.totalTS) || 0;
        }
        , progressTS(state, getters){
            return (getters.progress && getters.progress.ts) || 0;
        }
    }
    ,mutations:{
        save(state, localStoreName){
            window.localStorage.setItem(localStoreName, JSON.stringify(state));
        },
        load(state, user){
            Object.assign(state, user);
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
        ,subscrGroup(state, {groups, localStoreName}){
            //when one user enter a group, we say he subscribe the group.
            state.groups = groups
            window.localStorage.setItem(localStoreName, JSON.stringify(state));
        }
        ,quitGroup(state,{groupId, groups, localStoreName}){
            state.groups = groups
            state.progresses[groupId] = null;                    
            window.localStorage.setItem(localStoreName, JSON.stringify(state));
        }/*
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
        }*/
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
        },
        addProgress(state, groupId){
            $$vm.$set( state.progresses, groupId, {totalTS:0, ts:0})
        },
        setProgressTS(state,{ts, groupId}){
            state.progresses[groupId].ts = ts;
        },
        incrProgress(state, groupId){
            var progress = state.progresses[groupId];
            progress.ts++;
            progress.totalTS++;
        }
    }
    ,actions:{
        async loadUser({commit, getters}, $http){
            var localStoreName = getters.localStoreName;
            var user = JSON.parse(window.localStorage.getItem(localStoreName));
            if(user) {
                commit("load", user)
            }
            var res = await $http.get("/self");
            user = res && res.body && res.body.user;
            if(user){
                commit("load", res.body.user);
                commit("save", localStoreName);
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
        , async loginOnServer({state, commit, getters}, info){
            var res = await $$vm.$http.post("/login").send(info)
            var ret = res.body;
            switch(ret.status){
                case "newUser":
                    commit("newUser", ret.nickname)
                    break;
                case "ok":
                    commit("hasLogin");
                    commit("load", ret.user);
                    commit("save", getters.localStoreName)
                    $$vm.$message({message:"登录成功", type:"success"})
                    break;
                default:
                    $$vm.$message("哎呀, 服务器出问题了...")
                    break;
            }
        }
        , async registerOnServer({state, commit, getters}, info){
                var res = await $$vm.$http.post("/register").send(info)
                var ret = res.body;
                switch(ret.status){
                    case "ok":
                        commit("registerDone");
                        commit("hasLogin");
                        commit("load", ret.user);
                        commit("save", getters.localStoreName);
                        break;
                    default:
                        $$vm.$message("注册失败.可能服务器出问题了...")
                        break;
                }
        }
        , async saveProgress({state,commit, getters}, groupId){
            commit("save", getters.localStoreName);

            var progress = state.progresses[groupId];            
            if(progress && state.hasLogin){
                await $$vm.$http.post("/user/progress")
                    .send({groupId:groupId, progress:progress})
            }
        }
        ,async subscrGroup({state, commit, dispatch, getters}, groupId){
            if(state.groups.indexOf(parseInt(groupId))!=-1 || !state.hasLogin){
                return;
            }
            
            var res = await $$vm.$http.post("/user/joinGroup")
                    .send({groupId:groupId});
            var data = res.body;
            var localStoreName = getters.localStoreName;
            commit("subscrGroup", {groups:data.groups, localStoreName})
            commit("group/setGroupMembers",{ groupId, members:data.members}, {root:true})
        }
        ,async quitGroup({state, commit, dispatch, rootState, getters}, groupId){
            if(state.groups.indexOf(groupId)==-1 || !state.hasLogin){
                return;
            }

            var res = await $$vm.$http.post("/user/quitGroup")
                    .send({groupId:groupId});
            var data = res.body;
            commit("quitGroup", {groupId, groups:data.groups})
            var localStoreName = getters.localStoreName;
            commit("group/setGroupMembers",{localStoreName, groupId, members:data.members}, {root:true})
        }
        , async ensureProgress({state, commit, getters, rootGetters}){
            var gid = rootGetters.curGroupId;
            if(!gid){
                return Promise.reject(new Error("no current groupd Id"))
            }
            if(!getters.progress){
                commit("addProgress", gid);
            }
            var progress = getters.progress;

            //to adapt old version
            if(progress.progressTS){
                $$vm.$set(progress, "ts", progress.progressTS);
                delete progress.progressTS;
            }
            return Promise.resolve(getters.progress)
        }
        , async incrProgressTS({state, getters, dispatch, commit, rootGetters}){
            await dispatch("ensureProgress");
            commit("incrProgress", rootGetters.curGroupId);
        }
        , async setProgressTS({state, commit, dispatch, rootGetters}, ts){
            await dispatch("ensureProgress");
            commit("setProgressTS", {ts:ts, groupId:rootGetters.curGroupId})
        }

    }
}
 
