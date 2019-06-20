'use strict'

var date = require('yu.date');

function getOptionConfig(optionString) {
    var option = optionString.split(':')
    if (option.length === 1) {
        return {option: option[0].trim()}
    } else {
        return {option: option[0].trim(), value: option[1].trim()}
    }
}

function conversionObject(sourceObject, option) {
    for (var key in option) {
        var config = getOptionConfig(option[key])
        // var sourceObjectTarget
        // if (key.indexOf('.') > 0) {
        //     sourceObjectTarget =
        // }else{
        //     sourceObjectTarget
        // }
        switch (config.option) {
            case 'copy':
                sourceObject[config.value] = sourceObject[key]
                break
            case 'rename':
                sourceObject[config.value] = sourceObject[key]
                delete sourceObject[key]
                break
            case 'string':
                sourceObject[key] = sourceObject[key] + ''
                break
            case 'date':
                sourceObject[key] = date.format(new Date(sourceObject[key]), 'yyyy-MM-dd hh:mm:ss')
                break
            case 'enum':
                var enumArray = config.value.split(',')
                sourceObject[key] = enumArray[sourceObject[key]]
                break
            default:
                break
        }
    }
    return sourceObject
}

function to(source, option) {
    switch (typeof source) {
        case 'object':
            if (typeof option === 'string') {

            } else {
                if (source instanceof Array) {
                    // 如果是数组
                    for (var i = 0; i < source.length; i++) {
                        conversionObject(source[i], option)
                    }
                } else {
                    conversionObject(source, option)
                }
            }
            break
        default:
            break
    }
}

module.exports = to