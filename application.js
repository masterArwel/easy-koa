

let EventEmitter = require('events'); //  错误处理机制

let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application extends EventEmitter {

    constructor() {
        // this.callbackFunc;
        super();
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }

    //开启http server并传入callback
    listen(...args) {
        let server = http.createServer(this.callback());
        server.listen(...args);
    }

     //挂载回调函数
     //@param {Function} fn 回调处理函数
    use(fn) {
        this.callbackFunc = fn;
    }

     /** 中间件挂载
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * 中间件合并方法，将中间件数组合并为一个中间件
     */
    compose() {
        // 将middlewares合并为一个函数，该函数接收一个ctx对象
        return async ctx => {

            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext);
                }
            }

            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve();
            };
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next);
            }
            await next();
        };
    }
    /**
     * 获取http server所需的callback函数
     */
    callback() {
        return (req, res) => {
            let ctx = this.createContext(req, res);
            let respond = () => this.responseBody(ctx);
            // let fn = this.compose();
            // return fn(ctx).then(respond);
            let onerror = (err) => this.onerror(err, ctx); // 错误处理机制
            let fn = this.compose();
            // 在这里catch异常，调用onerror方法处理异常
            return fn(ctx).then(respond).catch(onerror);
        };
    }
    /**
     * 构造ctx
     */
    createContext(req, res) {
        // 针对每个请求，都要创建ctx对象
        let ctx = Object.create(this.context);
        ctx.request = Object.create(this.request);
        ctx.response = Object.create(this.response);
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx;
    }

    /**
     * 对客户端消息进行回复
     */
    responseBody(ctx) {
        let content = ctx.body;
        if (typeof content === 'string') {
            ctx.res.end(content);
        } else if (typeof content === 'object') {
            ctx.res.end(JSON.stringify(content));
        }
    }
    /**
     * 错误处理
     */
    onerror(err, ctx) {
        if (err.code === 'ENOENT') {
            ctx.status = 404;
        } else {
            ctx.status = 500;
        }
        let msg = err.message || 'Internal error';
        ctx.res.end(msg);
        // 触发error事件
        this.emit('error', err);
    }

}
module.exports = Application;




