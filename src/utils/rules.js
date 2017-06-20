export default {
    validNameChar:{ 
            pattern:new RegExp("^[\\u4e00-\\u9fa5_a-zA-Z0-9]+$")
            , message:"字符必须是: 中文, 英文, 数字, 下划线"
          }
}