<template>
    <Popover ref="popover" trigger="click">
        <div style="padding:1rem 0.5rem">
            <Form label-position="top" :rules="rules"  :model="model">
                <FormItem label="设置起始时间点" prop="ts">
                    <Input
                        type="text" 
                        v-model="model.ts"
                        @keyup.enter.prevent="submit"
                    ></Input>
                </FormItem>
                <FormItem><Button type="primary" @click="submit">确定</Button></FormItem>
            </Form>
        </div>
        
        <Button slot="reference" size="mini" style="border:none"
            type="text"
            >复习
        </Button>

    </Popover>
</template>

<script type="text/javascript">
    function transform(value){
        console.log("transfrom:", value);
        var parts = value.split(":");
        var hours = parseInt(parts[0])||0;
        var min = parseInt(parts[1]) || 0;
        var sec = parseInt(parts[2]) || 0;
        var ts = hours*60*60+min*60+sec;
        return hours*60*60+min*60+sec;
    }


    export default {
        data(){
            return {
                progressTS:this.value,
                model:{
                    ts:this.formatTS(this.value)  
                },
                rules:{
                    ts:[
                        {required:true, message:"不能为空"},
                        {
                            type:"number",
                            transform(value){
                                return transform(value)
                            },
                            min:0,
                            max:this.value,
                            message:"起始时间点不能超过当前进度"
                        }
                    
                        ]
                }
            }
        }
        ,props:["value"]
        ,methods:{
            submit(){
                this.$emit("input", transform(this.model.ts));
            }
        }
    }
</script>

<style>
    
</style>