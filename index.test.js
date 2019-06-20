var to = require('./src/index')

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

test('类型转换', () => {
    var obj = {
        age: 23,
    }

    to(obj, {
        age: 'string',
    })

    expect(obj.age).toBe('23')
})

test('日期转换', () => {
    var obj = {
        birthday: 1560827789638,
    }
    to(obj, {
        birthday: 'date',
    })

    expect(obj.birthday).toBe('2019-06-18 11:16:29')
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

test('字符串参数', () => {
    var obj = {
        status: 1,  // 0 不健康 1 健康
    }
    to(obj, 'status:rename:statusLabel&statusLabel:enum:不健康,健康')

    expect(obj.statusLabel).toBe('健康')
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