<template>
    <Popover ref="popover" placement="bottom-start" visible-arrow="true" trigger="click">
        <ul class="list-inline plain">
            <li data-emoji v-html="toHtml(item)" v-for="item in emojiList" @click="$emit('emojiSelected', toHtml(item))">
            </li>
        </ul>
    </Popover>
</template>

<script type="text/javascript">
   import listObj from "./listObj.js";
    
    function getList(){
        var list = Object.values(listObj).map((item)=>"/static/emoji/"+item);
        return list;
    }
    export default {
        data(){
            return {
                emojiList:getList()
            }
        }
        , methods:{
            toHtml(item){
                return `<img src="${item}" data-emoji/>`;
            },
            toggle(referenceEle){
                var popover = this.$refs.popover;
                popover.$refs.reference = referenceEle ;
                popover.doToggle();
            }
        }
        
    }
    
</script>

<style lang='stylus'>
    ul.list-inline li[data-emoji]
        padding:0rem 0rem;

        &:hover
            cursor:pointer;
            
        a
            vertical-align:middle;

    
    [data-emoji]
        font-size:1.2rem;
        margin:0 0.2rem;

    .editArea    
        [data-emoji]:hover
            cursor:default;
    
    img[data-emoji]
        width:1.6rem;
        height:1.6rem;
</style>