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

    console.log(obj);
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

    expect(obj.father.child.myname).toBe('tom')
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

var a = {
    name: {
        name: {
            name: 'tom'
        }
    }
}

console.log(a, a['name']['name']['name'])