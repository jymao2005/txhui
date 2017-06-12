<template>
    <div class="container" :class="{focused}">
        <div class='editArea' v-focus ref="editArea" 
            :placeholder="placeholders[type]"
            contentEditable="true" @keyup.shift.space="go" @keyup.enter.ctrl="onEnter" @focus="focused=true" @blur="focused=false">
         
        </div>
        <div class="toolbar">
            <ButtonGroup class="">
                <Button style="border:none" type="plain" v-for="cmd in cmds" @click="handleCmd(cmd)">
                    <IconFA :name="cmd.icon" style="box-sizing:initial"></IconFA>
                </Button>
            </ButtonGroup>

            <Select v-model="type" size="mini" style="width:6em;margin-left:2em;vertical-align:middle;">
                    <Option v-for="type in types"
                            :key="type"
                            :value="type"></Option>
            </Select>
            
            <Button  @click="onEnter" type="text" class="pull-right" :style="{padding:'1em'}">发表 Ctrl+Enter</Button>
            
        </div>    
    </div>
</template>

<style lang="stylus" scoped>
    .fa-icon
        padding:0
    
    .container 
        max-width:650px;
        border-radius:.2em;
        border:1px solid #bbc0ca;
        background:lighten(#bbc0ca, 80%);
        color:grey;
        margin-bottom:2em;
        
        &.focused
            border-color:darken(#bbc0ca, 20%);        

    

    .editArea 
        min-height:8em;
        padding: 1em 1em;
        outline:none
        
        &[placeholder]:empty:before {
            content: attr(placeholder);
            color: #bababa;
        }
        
    
    .toolbar 
        box-sizing:initial;
        border-top:1px solid lighten(#bbc0ca,30%);
        background-color:white;
        border-bottom-left-radius:.2em;
        border-bottom-right-radius:.2em;
        

</style>

<script>
    
    export default {
        components:{
        }, 
        props:{
          value:String,
          placeholder:String,
          defaultType:String
        },
        watch:{
            value(){
                this.$refs.editArea.innerHTML = this.value;
            },
            type(){
                this.$emit("typeChanged", this.type);
            }
        },
        data(){
            
            return {
                placeholders:{
                    "短笔记":"写短笔记, 用自己的话把学到的表达出来",
                    "提问":"学习中遇到想不通的, 可以在这里提问. (请准确描述问题)"
                },
                types:["短笔记", "提问"],
                type:this.defaultType || "短笔记",
                focused:false,
                cmds:[
                    {
                        icon:"smile-o",
                        handler(){
                            console.log(this)
                        }
                    },
                    {
                        icon:"code"
                    },
                    {
                        icon:"picture-o"
                    }
                    
                    ]
            }    
        },
        methods:{
            handleCmd(cmd){
              cmd.handler && cmd.handler.call(this);  
            },
            update(cnt){
                
            },
            format(){
                var node = this.$refs.editArea;
                var cnt = node.innerHTML;
            },
            onEnter(){
                var cnt = this.$refs.editArea.innerHTML.trim();
                if(cnt && cnt.length>0){
                    this.$emit("input", cnt);
                }
                console.log("onEnter()")
                //this.$emit("publish", cnt);
            },
            go(){
                //how to make go feature?
            }
        }
    }
    
</script>