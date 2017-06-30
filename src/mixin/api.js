export default {
    methods:{
        async publishPost({html, creator, ts=0, groupId, type="短笔记"}){
            try {
                console.log(this)
               // var wait = this.$loading({target:this.$el, fullscreen:true})
    
                var res = await this.$http.post("/g/Post")
                    .send({
                        html,
                        creator:creator._id,
                        creatorName:creator.name,
                        creatorFigureUrl:creator.figureUrl,
                        ts,
                        longTS:ts*1001+Math.floor(Math.random()*999),
                        groups:[groupId],
                        type
                    });
                
               // wait.close();
                return res.body;
                
            }catch(e){
                this.$message({message:"好奇怪, 发表失败了...也许服务器出问题了", type:"warning"})
            }
            
        }
    }
}