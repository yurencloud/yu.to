
#### 使用说明

```javascript
var to = require('./src/index')
var data = require('./test-data')

test('字符串型单个配置(最简单的使用)', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, 'status:string')

    expect(obj.status).toBe('1')
})

test('字符串型配置(以&符号分隔)', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, 'status:rename:statusLabel&statusLabel:enum:不健康,健康')

    expect(obj.statusLabel).toBe('健康')
})

// 没有值的，一律不支持对象型配置，比如string,number,boolean

test('对象型单个配置(值为字符串)', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'enum:不健康,健康'
    })

    expect(obj.status).toBe('健康')
})

test('对象型多个配置(值为字符串)', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'rename:statusLabel',
        statusLabel: 'enum:不健康,健康'
    })
    expect(obj.statusLabel).toBe('健康')
})

test('对象型单个配置(值为对象,值的值为字符串)', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: {enum: '不健康,健康'}
    })

    expect(obj.status).toBe('健康')
})

test('对象型多个配置(值为对象,值的值为字符串)', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: {rename: 'statusLabel'},
        statusLabel: {enum: '不健康,健康'}
    })
    expect(obj.statusLabel).toBe('健康')
})


test('对象型单个配置(值为对象,值的值为对象)', () => {
    var obj = {
        status: 'health',  // 0 不健康 1 健康
    }
    to(obj, {
        status: {mapping: {unHealth: '不健康', health: '健康'}},
    })

    expect(obj.status).toBe('健康')
})

test('对象型多个配置(值为对象,值的值为对象)', () => {
    var obj = {
        status: 'health',  // 0 不健康 1 健康
    }
    to(obj, {
        status: {rename: 'statusLabel'},
        statusLabel: {mapping: {unHealth: '不健康', health: '健康'}},
    })

    expect(obj.statusLabel).toBe('健康')
})

test('重命名属性', () => {
    var obj = {
        name: 'mack',
    }
    to(obj, {
        name: 'rename:myname',
    })

    expect(obj.name).toBe(undefined)
    expect(obj.myname).toBe('mack')
})

test('重命名属性2', () => {
    var obj = {
        name: 'mack',
    }
    to(obj, {
        name: {rename: 'myname'},
    })

    expect(obj.name).toBe(undefined)
    expect(obj.myname).toBe('mack')
})

test('类型转换', () => {
    var obj = {
        age: 23,
        money: '123.23',
        love: 'yes',
    }

    to(obj, {
        age: 'string',
        money: 'number',
        love: 'boolean'
    })

    expect(obj.age).toBe('23')
    expect(obj.money).toBe(123.23)
    expect(obj.love).toBe(true)
})

test('时间戳转日期', () => {
    var obj = {
        birthday: 1560827789638,
    }
    to(obj, {
        birthday: 'date',
    })

    expect(obj.birthday).toBe('2019-06-18 11:16:29')
})

test('比较判断，得到布尔值或赋值', () => {
    var obj = {
        status: 'SUCCESS',
        type: 'order',
    }
    to(obj, {
        status: 'compare:SUCCESS',
        type: 'compare:order?交易:购买',
    })

    expect(obj.status).toBe(true)
    expect(obj.type).toBe('交易')
})

test('时间戳转日期2', () => {
    var obj = {
        birthday: 1560827789638,
    }
    to(obj, {
        birthday: {date: ''},
    })

    expect(obj.birthday).toBe('2019-06-18 11:16:29')
})

test('时间戳转日期3', () => {
    var obj = {
        birthday: 1560827789638,
    }
    to(obj, {
        birthday: {date: 'yyyy-MM-dd'},
    })

    expect(obj.birthday).toBe('2019-06-18')
})

test('日期转时间戳', () => {
    var obj = {
        birthday: '2019-06-18 11:16:29',
    }
    to(obj, {
        birthday: 'timestamp',
    })

    expect(obj.birthday).toBe(1560827789000)
})

test('日期转时间戳2', () => {
    var obj = {
        birthday: '2019-06-18 11:16:29',
    }
    to(obj, {
        birthday: {timestamp: ''},
    })

    expect(obj.birthday).toBe(1560827789000)
})

test('日期转时间戳3', () => {
    var obj = {
        birthday: '2019-06-18',
    }
    to(obj, {
        birthday: {timestamp: 'yyyy-MM-dd'},
    })

    expect(obj.birthday).toBe(1560787200000)
})

test('在内容前添加字符串', () => {
    var obj = {
        name: '王小明',
    }
    to(obj, {
        name: 'prepend:姓名:',
    })

    expect(obj.name).toBe('姓名:王小明')
})

test('在内容后添加字符串', () => {
    var obj = {
        money: 3.25,
    }
    to(obj, {
        money: 'append:元',
    })

    expect(obj.money).toBe('3.25元')
})

test('枚举转换', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'enum:不健康,健康',
    })

    expect(obj.status).toBe('健康')
})

test('枚举转换2', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: {enum: '不健康,健康'},
    })

    expect(obj.status).toBe('健康')
})

test('枚举转换3', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: {enum: ['不健康', '健康']},
    })

    expect(obj.status).toBe('健康')
})

test('枚举对象转换', () => {
    var obj = {
        status: 'health',  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'mapping:unHealth:不健康,health:健康',
    })

    expect(obj.status).toBe('健康')
})

test('枚举对象转换2', () => {
    var obj = {
        status: 'health',  // 0 不健康 1 健康
    }
    to(obj, {
        status: {mapping: 'unHealth:不健康,health:健康'},
    })

    expect(obj.status).toBe('健康')
})

test('枚举对象转换3', () => {
    var obj = {
        status: 'health',  // 0 不健康 1 健康
    }
    to(obj, {
        status: {mapping: {unHealth: '不健康', health: '健康'}},
    })

    expect(obj.status).toBe('健康')
})

test('枚举转换,枚举中存在冒号问题', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'enum:https://www.a.com,https://www.b.com',
    })

    expect(obj.status).toBe('https://www.b.com')
})

test('属性复制', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'copy:statusLabel',
    })

    expect(obj.statusLabel).toBe(obj.status)
})

test('属性复制后，再枚举', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
        status: 'copy:statusLabel',
        statusLabel: 'enum:不健康,健康',
    })
    expect(obj.statusLabel).toBe('健康')
})

test('无限深度属性处理', () => {
    var obj = {
        father: {
            child: {
                name: 'tom'
            }
        }
    }
    to(obj, {
        'father.child.name': 'rename:myname',
    })
    expect(obj.father.child.name).toBe(undefined)
    expect(obj.father.child.myname).toBe('tom')
})

test('无限深度属性处理2', () => {
    var obj = {
        father: {
            child: {
                name: 'tom'
            }
        }
    }
    to(obj, {
        'father.child.name': {rename: 'myname'},
    })
    expect(obj.father.child.name).toBe(undefined)
    expect(obj.father.child.myname).toBe('tom')
})

test('无限深度数组属性处理', () => {
    var obj = {
        father: {
            child: {
                family: [
                    { name: 'tom', status: 1},
                    { name: 'cindy', status: 1},
                    { name: 'bob', status: 0},
                ]
            }
        }
    }
    to(obj, {
        'father.child.family.status': {enum: '健康,不健康'},
    })
    expect(obj.father.child.family[1].status).toBe('不健康')
})

test('字符串转数组', () => {
    var obj = {
        words: 'a,b,c',
        words2: 'a|b|c'
    }
    to(obj, {
        words: 'array',
        words2: 'array:|',
    })
    expect(obj.words[2]).toBe('c')
    expect(obj.words2[2]).toBe('c')
})

test('default转默认值', () => {
    var obj = {
        words: null,
        words2: null,
    }
    to(obj, {
        words: 'default',
        words2: 'default:-',
    })
    expect(obj.words).toBe('/')
    expect(obj.words2).toBe('-')
})

test('处理数组对象', () => {
    var objArray = [
        {
            name: 'mack',
            age: 23,
            birthday: 1560827789638,
            status: 1,  // 0 不健康 1 健康
        },
        {
            name: 'cindy',
            age: 21,
            birthday: 1560827789638,
            status: 0,  // 0 不健康 1 健康
        },
    ]
    to(objArray, {
        status: 'enum:不健康,健康',
    })

    expect(objArray[0].status).toBe('健康')
    expect(objArray[1].status).toBe('不健康')
})

test('处理数组对象2', () => {
    var objArray = [
        {
            name: 'mack',
            age: 23,
            birthday: 1560827789638,
            status: 1,  // 0 不健康 1 健康
        },
        {
            name: 'cindy',
            age: 21,
            birthday: 1560827789638,
            status: 0,  // 0 不健康 1 健康
        },
    ]
    to(objArray, {
        status: {enum: ['不健康', '健康']},
    })

    expect(objArray[0].status).toBe('健康')
    expect(objArray[1].status).toBe('不健康')
})


test('参数数组', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
            status: ['copy:statusLabel', 'enum:不健康,健康']
        }
    )
    expect(obj.status).toBe('健康')
})


test('参数数组2', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, {
            status: [{copy: 'statusLabel'}, {enum: ['不健康', '健康']}]
        }
    )
    expect(obj.status).toBe('健康')
})

test('拓展功能', () => {
    to.extend({
        addOne: function (source, key, configValue) {
            source[key] = Number(source[key]) + 1
        }
    })
    var obj = {
        status: '1',
    }
    to(obj, {
            status: 'addOne'
        }
    )
    expect(obj.status).toBe(2)
})

test('拓展功能2', () => {
    to.extend({
        addOne: function (source, key, configValue) {
            source[key] = Number(source[key]) + 1
        }
    })
    var obj = {
        status: '1',
    }
    to(obj, {
            status: {addOne: ''}
        }
    )
    expect(obj.status).toBe(2)
})

test('拓展功能3', () => {
    to.extend({
        addOne: function (source, key, configValue) {
            source[key] = Number(source[key]) + 1
        }
    })
    var obj = {
        status: '1',
    }
    to(obj, {
            status: {addOne: ''}
        }
    )

    to.extend({
        addTwo: function (source, key, configValue) {
            source[key] = Number(source[key]) + 2
        }
    })

    to(obj, {
            status: [{addOne: ''},{addTwo: ''}]
        }
    )
    expect(obj.status).toBe(5)
})

test('处理分页数据', () => {
    var dataSource = Object.assign({}, data)
    to(dataSource.data, {
        status: 'enum:交易成功,交易失败,正在交易',
        dispatchTime: 'date',
        createTime: 'date',
        updateTime: 'date',
        remarks: 'default',
        'productOrders.status': 'copy:statusLabel',
        'productOrders.statusLabel': 'enum:交易成功,交易失败,正在交易',
    })
})
```