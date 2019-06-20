'use strict'

var date = require('yu.date');

/*
* 将字符串参数，转成对象参数
* @param {String} option - 字符串参数
* @return {Object} option - 对象参数
* */
function getOptionFromString(option) {
    var optionList = option.split('&')
    var result = {}
    for (var i = 0; i < optionList.length; i++) {
        var itemList = optionList[i].split(':')
        result[itemList[0]] = optionList[i].substr(itemList[0].length+1)
    }
    return result
}

/*
* 将单个字符串配置，转成配置对象
* @param {String} optionString - 单个字符串配置
* @return {Object} option - 配置对象 {option:'配置名',value:'配置值'}
* */
function getOptionConfig(optionString) {
    var option = optionString.split(':')
    if (option.length === 1) {
        return {option: option[0].trim()}
    } else {
        // 修复value中可能出现冒号的问题
        var value = optionString.substr(option[0].length+1)
        return {option: option[0].trim(), value: value}
    }
}

/*
* 对操作数据对象应用单个配置对象
* @param {Object} sourceObject - 操作数据对象
* @param {String} optionValue - 字符串参数
* @return {String} key - 操作数据对象的属性名
* */
function singleConversion(sourceObject, optionValue, key) {
    var config = getOptionConfig(optionValue)
    if(key.indexOf('.')>0){
        var keys = key.split('.')
        for (var i = 0; i < keys.length - 1; i++) {
            sourceObject = sourceObject[keys[i]]
            key = keys[i+1]
        }
    }
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
        case 'array':
            var splitChar = ','
            if(config.value){
                splitChar = config.value
            }
            var array = sourceObject[key].split(splitChar)
            sourceObject[key] = array
            break
        default:
            break
    }
}

/*
* 转换单个数据对象
* @param {Object} sourceObject - 操作数据对象
* @param {Object} option - 参数
* @return void
* */
function conversionObject(sourceObject, option) {
    for (var key in option) {
        if(option[key] instanceof Array){
            for (var i = 0; i < option[key].length; i++) {
                singleConversion(sourceObject, option[key][i], key)
            }
        }else{
            singleConversion(sourceObject, option[key], key)
        }
    }
}

/*
* 根据配置，转换对象或数组
* @param {Object, Array} source - 数据对象
* @param {Object, String} option - 配置参数
* @return void
* */
function to(source, option) {
    if (typeof option === 'string') {
        option = getOptionFromString(option)
    }

    if (source instanceof Array) {
        // 如果是数组
        for (var i = 0; i < source.length; i++) {
            conversionObject(source[i], option)
        }
    } else {
        conversionObject(source, option)
    }
}

module.exports = to