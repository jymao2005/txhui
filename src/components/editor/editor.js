
function createElemByHTML(html) {
    var div = void 0;
    div = document.createElement('div');
    div.innerHTML = html;
    return div.children[0];
}

function remove(elem){
    if (elem.remove) {
        elem.remove();
    } else {
        var parent = elem.parentElement;
        parent && parent.removeChild(elem);
    }
}

function _insertHTML(html){
    document.execCommand("insertHTML", false, html);
}


class Selection{
    constructor(txtEle){
        this.txtEle = txtEle;
        this._currentRange = null
    }
    getRange(){
        return this._currentRange || this.saveRange() || this._currentRange;
    }
    getSelectionContainerElem(range) {
        range = range || this.getRange() ;
        var elem = void 0;
        if (range) {
            elem = range.commonAncestorContainer;
            return elem.nodeType === 1 ? elem : elem.parentNode;
        }
    }
    saveRange(_range) {
        if (_range) {
            // 保存已有选区
            this._currentRange = _range;
            return;
        }

        // 获取当前的选区
        var selection = window.getSelection();
        if (selection.rangeCount === 0) {
            return;
        }
        var range = selection.getRangeAt(0);

        // 判断选区内容是否在编辑内容之内
        var containerElem = this.getSelectionContainerElem(range);
        if (!containerElem) {
            return;
        }
        var textElem = this.txtEle;
        if (textElem.contains(containerElem)) {
            // 是编辑内容之内的
            this._currentRange = range;
        }
    }  
    createRangeByElem(elem, toStart, isContent) {
        // $elem - 经过封装的 elem
        // toStart - true 开始位置，false 结束位置
        // isContent - 是否选中Elem的内容
        if (!elem) {
            return;
        }

        var range = document.createRange();

        if (isContent) {
            range.selectNodeContents(elem);
        } else {
            range.selectNode(elem);
        }

        if (typeof toStart === 'boolean') {
            range.collapse(toStart);
        }

        // 存储 range
        this.saveRange(range);
        this.restoreSelection()
    }    
    // 恢复选区
    restoreSelection() {
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this._currentRange);
    }
    
}


import ImageHandler from "./ImageHandler.js";

export default class EditorArea {
    constructor(txtEle, uploader){
        this.txtEle = txtEle; //dom node of edit area
        this.selection = new Selection(txtEle);
        this.imageHandler = new ImageHandler(this, uploader)
    }
    onEnter(e){
        var ele = this.selection.getSelectionContainerElem();
        if(ele.nodeName.toLowerCase()==="code"){
            this.insertHTML("\n")
            return;
        }

        var parentEle = ele.parentNode;
        if(parentEle !== this.txtEle){
            console.log("not top level node");
            return;
        }
        
        var name = ele.nodeName.toLowerCase();
        var node;
        switch(name){
            case "p":
                node = createElemByHTML("<p><br/></p>");
                break;
        }
        node && parentEle.insertBefore(node, ele.nextSibling);

        this.selection.createRangeByElem(node, true);
      //  remove(ele);

    }
    addNewline(){
        var ele = this.selection.getSelectionContainerElem();
        var name = ele.nodeName.toLowerCase();
        switch(name){
            case "code":
            case "pre":
                this.insertHTML("\n")
                break;
            case "p":
            case "div":
                var range = this.selection.getRange();
                console.log("range:", this.selection.getRange())
                var container = range.commonAncestorContainer;
                var length = container.length || (container.children && container.children.length);
                
                if(range.endOffset<length){
                    return false;
                }
                this._addNewNode("<p><br></p>", true)
                break;
            default:
                return false;
                break;
        }
        return true;
    }
    initNewline(){
        var html = this.txtEle.innerHTML;
        if(html.length){
            return;
        }
        _insertHTML("<p><br/></p>");

//        var node = createElemByHTML("");
//        this.txtEle.appendChild(node);
//        this.selection.saveRange();
    }
    _addNewNode(html, keepEmptyRefNode){
        var referenceNode = this.selection.getSelectionContainerElem();
        if(!referenceNode){
            return;
        }
        
        var node = createElemByHTML(html)
        var needRemove = false;

       // if(referenceNode === this.txtEle){
            //init case
       //     this.txtEle.appendChild(node);
      //  }
      //  else {
        referenceNode = this.getLevel2(referenceNode); 
            if(!keepEmptyRefNode 
                && !referenceNode.textContent){
                needRemove = true;
            }
            var ele = referenceNode.nextSibling;
            this.txtEle.insertBefore(node, ele);
      //  }
        this.selection.createRangeByElem(node, true);
        needRemove && remove(referenceNode)
        this.txtEle.focus();
    }
    enterCodeMode(){
        this._addNewNode("<pre><code><br></code></pre>")
    }
    getLevel2(ele){
        if(!this.txtEle.contains(ele) || this.txtEle === ele){
            var at = this.selection.getRange().startOffset;
            if(at < this.txtEle.children.length){
                var node = this.txtEle.children[at];
                return node;
            }
            
            return {nextSibling:null}
        }
        
        var parent = ele.parentNode
        while(parent && parent!=this.txtEle){
            ele = parent;
            parent = parent.parentNode;
        }
        return ele;
    }
    leaveCodeMode(){
        this._addNewNode("<p><br></p>")
    }
    insertHTML(html){
        this.txtEle.focus();
        var range = this.selection.getRange();
        var _startOffset = range.startOffset;
        var _container = range.commonAncestorContainer;
        _insertHTML(html);
        this.selection.saveRange();
        var newRange = this.selection.getRange();
        if (newRange.startOffset === _startOffset
            && newRange.commonAncestorContainer === _container ) {
            // 没起作用，再来一遍
            _insertHTML(html);
        }
    }
    pasteImage(e){
     //   console.log(e)
        this.imageHandler.insertPasteImage(e);
    }
    insertImgLink(link){
        this.imageHandler.insertImgLink(link)
    }
    execCmd(cmd, opts){
        document.execCommand(cmd, false, opts)
    }
}