<template>
    <div>
        <Popover ref="popover" placement="bottom-start" visible-arrow="true" title="插入图片的三种方式" trigger="click" >
            <ul style="padding-left:2em">
                <li>
                    <p>使用快捷键 Ctrl+V (mac系统: Cmd+V) 从剪切板粘贴图片</p>
                </li>
                <li>
                    <p>拖拽图片文件到编辑框</p>
                </li>
                <li>
                    <Button @click="$refs.fileInput.click()" style="width:100%" type="plain">上传图片后自动插入</Button>
                </li>
            </ul>
        </Popover>
    
        <input ref="fileInput" 
                type="file" name="" 
                style="display:none" 
                accept="image/png, image/gif, image/jpeg, image/vnd.microsoft.icon"
                multiple
                @change="uploadFiles($refs.fileInput.files)"/>
    </div>
</template>

<script type="text/javascript">
    export default {
        data(){
            return { 
                uploadProgress:0
            }
        },
        props:["editArea"],
        methods:{
            toggle(referenceEle){
                var popover = this.$refs.popover;
                popover.$refs.reference = referenceEle ;
                popover.doToggle();
            },
            async uploadFiles(files){
                for(let idx=0;idx<files.length;idx++){
                    await this.uploadAsync(files[idx]);
                }   
            },
            async uploadAsync(file){
                if(file.size > 3*1024*1024){ //3M
                    this.$message("图片必须小于3M")
                   // throw new Error("file too large");
                   return;
                }
                var wait = this.$loading({target:this.editArea.txtEle})
                
                var res = await this.$http.get("/qiniu/uptoken");
                var token = res && res.body.token

                var res = await this.$http.post("http://upload.qiniu.com/")
                            .field("token", token)
                            .attach("file", file)
                            .on("progress",(evt)=>{
                                this.uploadProgress = evt.percent;
                                console.log(`uploading:${evt.percent}%`);
                                /*event
                                      direction: "upload" or "download"
                                      percent: 0 to 100 // may be missing if file size is unknown
                                      total: // total file size, may be missing
                                      loaded: // bytes downloaded or uploaded so far
                                 */

                            })
                var url = `http://i1.jymao.com/${res.body.key}`;
                console.log("url:",url)
                this.editArea.insertImgLink(url);
                wait.close();
            }
        }
    }
</script>