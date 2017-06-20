export default class Image {
    constructor(editArea, uploader){
        this.editArea = editArea;
        this.uploader = uploader;
    }
    insertPasteImage(e){
        var result = [];

        var clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData || {};
        var items = clipboardData.items;
        if (!items) {
            return result;
        }
    
        Object.keys(items).forEach((key) =>{
            var value = items[key];
            var type = value.type;
            if (/image/i.test(type)) {
              //  this.showBase64(value.getAsFile());
                this.uploader.uploadAsync(value.getAsFile())
            }
        });
    }
    showBase64(file){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        var self=this;
        reader.onload = function(){
            self.insertImgLink(this.result);
        };
    }
    insertImgLink(link){
        if(!link){
            return;
        }
        var img = document.createElement("img");
        img.onload = ()=>{
            img=null;
            this.editArea.insertHTML("<img src='"+link+"' style='max-width:100%' />")
        };
        img.onerror = ()=>{
            img=null;
            console.log("error while inserting image:", link)
        //    this.$bus.$emit("插入图片错误");
            return;
        }
        img.src=link;
    }
}