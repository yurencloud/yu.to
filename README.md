> 前言：yu.to是一个快速处理对象数据，数组数据的简单库，直接支持es5，同时也支持es6，支持功能拓展，扁平化，无嵌套的配置，容易上手和使用。



#### 一、快速上手

###### 安装

```shell
npm install --save yu.to
```



###### 使用

> 主要应对分页数据的快速处理

```javascript
var to = require('yu.to')

var response = {
    'currentPage': 1,
    'pageSize': 10,
    'totalNum': 3,
    'data': [
        {
            'id': 21,
            'userRemark': null,
            'receiverPhone': '16657100261',
            'receiver': '杜乐平',
            'status': 1,
            'type': '0',
            'dispatchTime': null,
            'createTime': 1560506022000,
            'updateTime': 1560506022000,
            'productOrders': [
                {
                    'id': 63,
                    'productName': '华为华为',
                    'unitPrice': 10,
                    'quantity': 1,
                    'type': 'ORDER',
                    'status': 'SUCCESS',
                }
            ]
        }
    ]
}

to(response.data, {
    userRemark: 'default',
    receiver: 'prepend:姓名:',
    status: 'copy:statusLabel',
    statusLabel: 'enum:失败,成功',
    dispatchTime: 'date',
    createTime: 'date:yyyy-MM-dd',
    updateTime: 'date',
    'productOrders.unitPrice': 'append:元',
    'productOrders.type': 'compare:ORDER',
    'productOrders.status': 'compare:SUCCESS?成功:失败',
})

console.log(response.data)

// ************* 处理后输出结果 *************

/*
  [
    { id: 21,
       userRemark: '/',
       receiverPhone: '16657100261',
       receiver: '姓名:杜乐平',
       status: 1,
       type: '0',
       dispatchTime: '/',
       createTime: '2019-06-14',
       updateTime: '2019-06-14 17:53:42',
       productOrders: [
           {
             id: 63,
             productName: '华为华为',
             unitPrice: '10元',
             quantity: 1,
             type: true,
             status: '成功',
           }
       ],
       statusLabel: '成功'
    }
   ]
*/
```



#### 二、配置参数

| 配置      | 配置说明                 | 参数                                   | 默认参数            | 备注                              |
| --------- | ------------------------ | -------------------------------------- | ------------------- | --------------------------------- |
| rename    | 属性重命名               | 重命名后的名称                         | -                   | 参数必填，原属性删除              |
| copy      | 属性重复制               | 复制后的名称                           | -                   | 参数必填，原属性保留              |
| string    | 转成字符串               | -                                      | -                   | -                                 |
| number    | 转成数字                 | -                                      | -                   | -                                 |
| boolean   | 转成布尔值               | -                                      | -                   | -                                 |
| date      | 时间戳转日期             | 时间转换格式 yyyy-MM-dd hh:mm:ss.SSS   | yyyy-MM-dd hh:mm:ss | 时间戳为null时，返回默认字符串'/' |
| timestamp | 日期转时间戳             | 时间转换格式 yyyy-MM-dd hh:mm:ss.SSS   | yyyy-MM-dd hh:mm:ss | 日期为null时，返回默认字符串'/'   |
| compare   | 比较判断得布尔值或字符串 | 比较的字符串或比较的字符加三元运算的值 | -                   | -                                 |
| prepend   | 在内容前添加字符串       | 字符串                                 | -                   | -                                 |
| append    | 在内容后添加字符串       | 字符串                                 | -                   | -                                 |
| enum      | 数组枚举转换             | 以','分隔的字符串                      | -                   | 参数必填                          |
| mapping   | 对象枚举转换             | 以'&'和','分隔的字符串                 | -                   | 参数必填                          |
| array     | 字符串转数组             | 分隔符号                               | 逗号','             | -                                 |



#### 三、自定义拓展配置参数

> 多次调用 to.extend() 方法会以merge的形式合并拓展配置参数

```javascript
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

// {status: 2}
```





#### 四、配置参数支持多种数据类型

##### 字符串型单个配置(最简单的使用)

```javascript
var obj = { status: 1 }
to(obj, 'status:string') 
// {status: '1'}
```



##### 字符串型配置(以&符号分隔)

```javascript
var obj = { status: 1 }
to(obj, 'status:rename:statusLabel&statusLabel:enum:不健康,健康') 
// {statusLabel: '健康'}
```



> 没有值的，一律不支持对象型配置，比如string,number,boolean

##### 对象型单个配置(值为字符串)

```javascript
var obj = { status: 1 }
to(obj, {
  status: 'enum:不健康,健康'
})
// {status: '健康'}
```



##### 对象型多个配置(值为字符串)

```javascript
var obj = { status: 1 }
to(obj, {
  status: 'rename:statusLabel',
  statusLabel: 'enum:不健康,健康'
})
// {statusLabel:'健康'}
```



##### 对象型单个配置(值为对象,值的值为字符串)

```javascript
var obj = { status: 1 }
to(obj, {
  status: {enum: '不健康,健康'}
})
// {status: '健康'}
```



##### 对象型多个配置(值为对象,值的值为字符串)

```javascript
 var obj = { status: 1 }
 to(obj, {
   status: {rename: 'statusLabel'},
   statusLabel: {enum: '不健康,健康'}
 })
// {statusLabel: '健康'}
```



##### 对象型单个配置(值为对象,值的值为对象)

```javascript
var obj = { status: 'health' }
to(obj, {
  status: {mapping: {unHealth: '不健康', health: '健康'}},
})
// {status: '健康'}
```



##### 对象型多个配置(值为对象,值的值为对象)

```javascript
var obj = { status: 'health' }
to(obj, {
  status: {rename: 'statusLabel'},
  statusLabel: {mapping: {unHealth: '不健康', health: '健康'}},
})
// {statusLabel: '健康'}
```



#### 五、配置参数数组

> 注意：如果配置参数是一个数组，则他只会作用于当前的属性，会按配置参数数组中的顺序处理

```javascript
var obj = {
  status: 1,  // 0 不健康 1 健康
}
to(obj, {
  status: [{copy: 'statusLabel'}, {enum: ['不健康', '健康']}]
}

expect(obj.status).toBe('健康')
```



#### 六、使用示例

##### 重命名属性

```javascript
 var obj = { name: 'mack' }
 to(obj, {
   name: 'rename:myname',
 })
// {myname: 'mack'}
```



##### 基础类型转换

```javascript
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

// { age:'23', money: 123.23, love: true }
```



##### 时间戳转日期

```javascript
var obj = {
  birthday: 1560827789638,
  createdAt: 1560827789638
}
to(obj, {
  birthday: 'date',
  createdAt: 'date:yyyy-MM-dd'
})

// {birthday: '2019-06-18 11:16:29', createdAt: '2019-06-18'}
```



##### 比较判断，得到布尔值或赋值

```javascript
var obj = {
  status: 'SUCCESS',
  type: 'order',
}
to(obj, {
  status: 'compare:SUCCESS',
  type: 'compare:order?交易:购买',
})

// {status: true, type: '交易'}
```



##### 日期转时间戳

```javascript
var obj = {
  birthday: '2019-06-18 11:16:29',
  createdAt: '2019-06-18'
}
to(obj, {
  birthday: 'timestamp',
  createdAt: 'timestamp:yyyy-MM-dd'
})

// {birthday: 1560827789000, createdAt: 1560787200000}
```



##### 在内容前添加字符串

```javascript
var obj = {
  name: '王小明',
}
to(obj, {
  name: 'prepend:姓名:',
})

// {name: '姓名:王小明'}
```



##### 在内容后添加字符串

```javascript
var obj = {
  money: 3.25,
}
to(obj, {
  money: 'append:元',
})

// {money: '3.25元'}
```



##### 枚举转换

```javascript
var obj = {
  status: 1,  // 0 不健康 1 健康
}
to(obj, {
  status: 'enum:不健康,健康',
})

// {status: '健康'}
```



##### 枚举对象转换

```javascript
 var obj = {
   status: 'health',  // 0 不健康 1 健康
 }
 to(obj, {
   status: {mapping: 'unHealth:不健康,health:健康'},
 })

// {status: '健康'}
```



##### 属性复制

```javascript
var obj = {
  status: 1,  // 0 不健康 1 健康
}
to(obj, {
  status: 'copy:statusLabel',
})

// {status: 1, statusLabel: 1}
```



##### 属性复制后，再枚举

```javascript
var obj = {
  status: 1,  // 0 不健康 1 健康
}
to(obj, {
  status: 'copy:statusLabel',
  statusLabel: 'enum:不健康,健康',
})

// {status: 1, statusLabel:'健康'}
```


##### 字符串转数组

```javascript
var obj = {
  words: 'a,b,c',
  words2: 'a|b|c'
}
to(obj, {
  words: 'array',
  words2: 'array:|',
})

// ['a','b','c']  ['a','b','c'] 
```



null转默认值

```javascript
var obj = {
  words: null,
  words2: null,
}
to(obj, {
  words: 'default',
  words2: 'default:-',
})
// {words: '/', words2: '-'}
```



##### 处理数组对象

> 可无视数组，直接把数组当作对象处理（内部会自动判断并循环处理）

```javascript
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

// expect(objArray[0].status).toBe('健康')
// expect(objArray[1].status).toBe('不健康')
```



#### 七、多层嵌套属性，多层属性数组处理

##### 多层嵌套属性

```javascript
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

/*
{
  father: {
    child: {
      myname: 'tom'
    }
  }
}
*/
```



##### 多层属性数组处理

> 直接将数组视为一个对象处理，内部会自动判断是否为数组并循环处理

```javascript
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

// obj.father.child.family[1].status === '不健康'
```
