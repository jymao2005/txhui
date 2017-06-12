<template>
    <div class='todos'>
        
        <input type="text" @keyup.enter="addNewTodo" v-model="newTodoText"/>
        
        
        <ul>
            <li v-for="(todo, idx) in todos">{{todo}} <button @click="todos.splice(idx,1)">X</button></li>
            
            <slot name="todo-item" v-for="(todo, idx) in todos" :todo ="todo"></slot>
        </ul>        
    </div>

</template>

<script type="text/javascript">
    export default {
        data(){
            return {
                newTodoText:"",
                todos:[]
            }    
        },
        methods:{
            addNewTodo(){
                var todo = this.newTodoText;
                this.todos.push(todo)
            },
            removeOne(){
                
            }
        }
    }
    
</script>