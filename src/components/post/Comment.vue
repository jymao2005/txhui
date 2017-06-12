<template>
    <div class="container" style="border-bottom:1px solid lightgrey">
        <div v-html="cmt.html" style="font-size:1em;padding-bottom:.2em;"></div>
        <footer style="font-size:12px">
            <span style="display:inline-block"><a :href="`/u/{cmt.creator}`">{{cmt.creatorName}}</a></span>
            <span style="font-style:italic;font-color:lightgrey;float:right">{{formatDatetime(cmt.createdAt)}}</span>
        </footer>        
    </div>
</template>

<script type="text/javascript">
    export default {
        props:["cmt"]
    }
</script>