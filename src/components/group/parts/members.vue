<template>
    <ul>
        <li v-for="member in members">
            <img :src="member.figureUrl" :title="member.name"></img>
        </li>
    </ul>
</template>

<script type="text/javascript">
    export default {
        data(){
            return {
                members:[]
            }
        }
    }
</script>

<style lang='stylus'>
    
</style>

