'use strict'

var date = require('yu.date');
var object = require('yu.object');

var globalConfig = {
    default: '/',
    dateFormat: 'yyyy-MM-dd hh:mm:ss'
}

var globalExtend = {}

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
        result[itemList[0]] = optionList[i].substr(itemList[0].length + 1)
    }
    return result
}

/*
* 将单个字符串配置或配置对象，转成配置对象
* @param {String, Object} optionItem - 单个字符串配置或配置对象
* @return {Object} config - 配置对象 {option:'配置名',value:'配置值'}
* */
function getOptionConfig(optionItem) {
    if (typeof optionItem === 'object') {
        for (var key in optionItem) {//用javascript的for/in循环遍历对象的属性
            return {option: key, value: optionItem[key]}
        }
    }
    var option = optionItem.split(':')
    if (option.length === 1) {
        return {option: option[0].trim()}
    } else {
        // 修复value中可能出现冒号的问题
        var value = optionItem.substr(option[0].length + 1)
        return {option: option[0].trim(), value: value}
    }
}

/*
* 对操作数据对象应用单个配置对象
* @param {Object} source - 操作数据对象
* @param {String} optionItem - 字符串参数
* @return {String} key - 操作数据对象的属性名
* */
function singleConversion(source, optionItem, key) {
    var config = getOptionConfig(optionItem)
    if (key.indexOf('.') > 0) {
        var keys = key.split('.')
        for (var i = 0; i < keys.length - 1; i++) {
            source = source[keys[i]]
            key = keys[i + 1]
        }
    }
    switch (config.option) {
        case 'copy':
            source[config.value] = source[key]
            break
        case 'rename':
            source[config.value] = source[key]
            delete source[key]
            break
        case 'default':
            var placeholder = globalConfig.default
            if (config.value && config.value.length) {
                placeholder = config.value
            }
            source[key] = source[key] === null ? placeholder : source[key]
            break
        case 'string':
            source[key] = String(source[key])
            break
        case 'number':
            source[key] = Number(source[key])
            break
        case 'boolean':
            source[key] = Boolean(source[key])
            break
        case 'date':
            var format = globalConfig.dateFormat
            if (config.value  && config.value.length) {
                format = config.value
            }
            if(source[key] === null){
                source[key] = globalConfig.default
                break
            }
            source[key] = date.format(new Date(source[key]), format)
            break
        case 'timestamp':
            var formatDate = globalConfig.dateFormat
            if (config.value  && config.value.length) {
                formatDate = config.value
            }
            source[key] = date.parse(source[key], formatDate).getTime()
            break
        case 'enum':
            var enumArray = config.value
            if (typeof config.value === 'string') {
                enumArray = config.value.split(',')
            }
            source[key] = enumArray[source[key]]
            break
        case 'mapping':
            var mapping = config.value
            if (typeof config.value === 'string') {
                mapping = {}
                var mappingArray = config.value.split(',')
                for (var i = 0; i < mappingArray.length; i++) {
                    var map = mappingArray[i].split(':')
                    mapping[map[0]] = map[1]
                }
            }
            source[key] = mapping[source[key]]
            break
        case 'array':
            var splitChar = ','
            if (config.value) {
                splitChar = config.value
            }
            var array = source[key].split(splitChar)
            source[key] = array
            break
        default:
            globalExtend[config.option](source, key, config.value)
            break
    }
}

/*
* 转换单个数据对象
* @param {Object} source - 操作数据对象
* @param {Object} option - 参数
* @return void
* */
function conversionObject(source, option) {
    for (var key in option) {
        if (option[key] instanceof Array) {
            for (var i = 0; i < option[key].length; i++) {
                singleConversion(source, option[key][i], key)
            }
        } else {
            singleConversion(source, option[key], key)
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
        for (var i = 0; i < source.length; i++) {
            conversionObject(source[i], option)
        }
    } else {
        conversionObject(source, option)
    }
}

/*
* 拓展方法
* @param {Object} extend - 拓展对象（方法合集) { optionName: function(source, key, configValue) {}, ... }
* @return to
* */
to.extend = function(extend) {
    globalExtend = object.assign(globalExtend, extend)
    return to
}

/*
* 设置默认配置
* @param {Object} config - 设置默认配置对象
* @return to
* */
to.config = function(config) {
    globalConfig = object.assign(globalConfig, config)
    return to
}

module.exports = to