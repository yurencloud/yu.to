var to = require('./src/index')

var obj = {
    name: 'mack',
    age: 23,
    birthday: 1560827789638,
    status: 1,  // 0 不健康 1 健康
}

test('重命名属性', () => {
    to(obj, {
        name: 'rename:myname',
    })

    expect(obj.name).toBe(undefined)
    expect(obj.myname).toBe('mack')
})

test('类型转换', () => {
    to(obj, {
        age: 'string',
    })

    expect(obj.age).toBe('23')
})

test('日期转换', () => {
    to(obj, {
        birthday: 'date',
    })

    expect(obj.birthday).toBe('2019-06-18 11:16:29')
})

test('枚举转换', () => {
    to(obj, {
        status: 'enum:不健康,健康',
    })

    expect(obj.status).toBe('健康')
})

test('处理数组对象', () => {
    to(obj, {
        status: 'enum:不健康,健康',
    })

    expect(obj.status).toBe('健康')
})