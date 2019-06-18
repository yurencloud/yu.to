'use strict'

var date = require('yu.date');

function getOptionConfig(optionString) {
    var option = optionString.split(':')
    if(option.length === 1){
        return { option: option[0].trim() }
    }else{
        return { option: option[0].trim(), value: option[1].trim() }
    }
}
function to(source, option) {
    console.log(source, option)
    switch (typeof source) {
        case 'object':
            if(typeof option === 'string'){
                if( source instanceof Array ) {
                    // 如果是数组
                }
            }else{
                for(var key in option){
                   var config = getOptionConfig(option[key])
                    switch (config.option) {
                        case 'rename':
                            source[config.value] = source[key]
                            delete source[key]
                            break
                        case 'string':
                            source[key] = source[key] + ''
                            break
                        case 'date':
                            source[key] = date.format(new Date(source[key]), 'yyyy-MM-dd hh:mm:ss')
                            break
                        case 'enum':
                            var enumArray = config.value.split(',')
                            source[key] = enumArray[source[key]]
                            break
                        default:
                            break
                    }
                }
            }
            break
        default:
            break
    }
}

module.exports = to