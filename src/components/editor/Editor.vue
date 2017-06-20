<template>
    <div class="container" :class="{focused}">
        <div class='editArea' v-focus ref="editArea" 
            :placeholder="placeholder || placeholders[type]"
            contentEditable="true" 
            spellcheck="false"
            :class="{dragOver:dragOver}"
            @keydown="editArea.initNewline()"
            @keydown.enter = "editArea.addNewline() && $event.preventDefault()"
            @keydown.enter.ctrl.prevent="publish"
            @keydown.tab.prevent="editArea.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;')"
            @keyup ="editArea.selection.saveRange()"
            @keyup.ctrl="onKeyupCtrl($event)"
            @keyup.esc="$refs.editArea.blur()"
            @paste="editArea.pasteImage($event)"
            @dragover.prevent="dragOver=true"
            @dragleave.prevent="dragOver=false"
            @drop.prevent="onDrop"
            @focus="focused=true" @blur="focused=false">
             
        </div>
        <div class="toolbar" style='position:relative' @click="editArea.initNewline()">
            <ButtonGroup class="">
                <Button :style="cmd.style ||{border:'none'}" 
                        :type="cmd.type||'plain'" 
                        v-for="(cmd,idx) in cmds"
                        v-if="!isHidden(cmd)"
                        :ref="cmd.ref"
                        @click="handleCmd(cmd, idx)">
                    <IconFA :name="cmd.icon" style="box-sizing:initial"></IconFA>
                </Button>
            </ButtonGroup>

            <Select v-if="!placeholder" v-model="type" size="mini" style="width:6em;margin-left:2em;vertical-align:middle;">
                    <Option v-for="type in types"
                            :key="type"
                            :value="type"></Option>
            </Select>
            
            <Button  @click="publish" type="text" :style="{position:'absolute', right:'1em', top:'0', bottom:'0'}">发表 Ctrl+Enter</Button>
            
        </div>   
        <InsertImage :editArea="editArea" ref="insertImage"></InsertImage>
        <Emoji ref="emoji" @emojiSelected="editArea.insertHTML($event)"></Emoji>
    </div>
</template>
<style lang='stylus'>
    .editArea, .post-content
        * 
            margin:0;
            padding:0;

        pre 
            background:lighten(black,20%);
            color:darken(white,20%);
            margin:0;
            padding:1em;
            max-height:30em;
            overflow:scroll;
        
        a[data-emoji]:hover
            cursor:text
            
        
</style>

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

    
    .dragOver
        border:1px solid #20a0ff
        
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
    import InsertImage from "./InsertImage.vue"
    import EditArea from "./editor.js"
    import Emoji from "./emoji/Emoji.vue"
    export default {
        components:{
            InsertImage,
            Emoji
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
                dragOver:false,
                editArea:null,
                placeholders:{
                    "短笔记":"写短笔记, 用自己的话把学到的表达出来",
                    "提问":"学习中遇到想不通的, 可以在这里提问. (请准确描述问题)"
                },
                types:["短笔记", "提问"],
                type:this.defaultType || "短笔记",
                focused:false,
                inCodeMode:false,
                cmds:[
                    {
                        icon:"smile-o",
                        ref:"emojiBtn",
                        handler(){
                            console.log(this)
                            this.$refs.emoji.toggle(this.$refs.emojiBtn[0].$el)
                        }
                    },
                    {
                        icon:"code",
                        handler(cmd){
                            this.editArea.enterCodeMode();
                            this.inCodeMode = true;
                        },
                        isHidden(){
                            return this.inCodeMode;
                        }
                    },
                    {
                        icon:"code",
                        type:"success",
                        handler(){
                            this.editArea.leaveCodeMode();
                            this.inCodeMode = false;
                        },
                        style:{}
                        ,isHidden(){
                            return !this.inCodeMode
                        }
                    },
                    {
                        icon:"picture-o",
                        ref:"insertImageBtn",
                        handler(cmd, idx){
                            this.$refs.insertImage.toggle(this.$refs.insertImageBtn[0].$el);
                        }
                    }
                    
                    ]
            }    
        },
        methods:{
            onEmojiSelected(e){
                console.log(e)
                this.editArea.insertHTML(e)                
            },
            isHidden(cmd){
                return cmd.isHidden && cmd.isHidden.call(this, cmd);       
            },
            handleCmd(cmd, idx){
              cmd.handler && cmd.handler.call(this, cmd, idx);  
            },
            update(cnt){
                
            },
            format(){
                var node = this.$refs.editArea;
                var cnt = node.innerHTML;
            },
            publish(){
                var cnt = this.$refs.editArea.innerHTML.trim();
                if(cnt && cnt.length>0){
                    this.$emit("input", cnt);
                }
                console.log("publish()")
                //this.$emit("publish", cnt);
            },
            go(){
                //how to make go feature?
            },
            onEnter(e){
                console.log(e)
                if(e.ctrl){
                    return;
                }
                this.editArea.onEnter(e)
            }   
            ,enterCodeMode(){
                this.editArea.enterCodeMode();
            }
            ,onKeyupCtrl(e){
                switch(e.key){
                    case "V":
                    case "v":
                   //     this.editArea.pasteImage(e);
                        break;
                }
            },
            onDrop(e){
              this.dragOver = false;
              this.$refs.insertImage.uploadFiles(e.dataTransfer.files);
            }
        },
        mounted(){
            this.editArea = new EditArea(this.$refs.editArea, this.$refs.insertImage);
        }        
    }
    
</script>