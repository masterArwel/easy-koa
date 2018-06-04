


let easyKoa = require('./application');
let app = new easyKoa();

let responseData = {};
// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        // 在这里进行定制化的错误处理
    }
});
// 中间件1
app.use(async (ctx, next) => {
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});
// 中间件2
app.use(async (ctx, next) => {
    responseData.age = 16;
    await next();
});
// 中间件3
app.use(async ctx => {
    responseData.sex = 'male';
});

app.listen(3000, () => {
    console.log('listening on 3000');
});

// 返回{ name: "tom", age: 16, sex: "male"}
// 对ctx进行扩展
// app.context.echoData = function (errno = 0, data = null, errmsg = '') {
//     this.res.setHeader('Content-Type', 'application/json;charset=utf-8');
//     this.body = {
//         errno: errno,
//         data: data,
//         errmsg: errmsg
//     };
// };
//
// app.use(async ctx => {
//     let data = {
//         name: 'tom',
//         age: 16,
//         sex: 'male'
//     }
//     // 这里使用扩展，方便的返回utf-8格式编码，带有errno和errmsg的消息体
//     ctx.echoData(0, data, 'success');
// });
//
// app.listen(3000, () => {
//     console.log('listenning on 3000');
// });