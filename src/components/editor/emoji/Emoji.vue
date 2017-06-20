<template>
    <Popover ref="popover" placement="bottom-start" visible-arrow="true" trigger="click">
        <ul class="list-inline plain">
            <li data-emoji v-html="toHtml(item)" v-for="item in emojiList" @click="$emit('emojiSelected', toHtml(item))">
            </li>
        </ul>
    </Popover>
</template>

<script type="text/javascript">
   // import listObj from "./listObj.js";
    
    function getList(){
        var list = [];
        var faceStr = '😄 😁 😆 😅 😂  😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁  😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐';
        list = list.concat(faceStr.split(/\s+/));

        var handStr = '🙌 👏 👋 👍 👎 👊 ✊ ️👌 ✋ 👐 💪 🙏 ️👆 👇 👈 👉 🖕 🖐 🤘 🖖';
        list = list.concat(handStr.split(/\s+/))
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
                return `<a href="javascript:void(0)" data-emoji>${item}</a>`;
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
        padding:0rem .5rem;

        &:hover
            cursor:pointer;
            
        a
            vertical-align:middle;

    
    [data-emoji]
        font-size:1.2rem;
        margin:0 .3rem;

    .editArea    
        [data-emoji]:hover
            cursor:default;
    
    img[data-emoji]
        width:1.6rem;
        height:1.6rem;
</style>