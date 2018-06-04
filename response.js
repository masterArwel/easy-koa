module.exports = {

    get body() {
        return this._body;
    },

    //设置返回给客户端的body内容
    set body(data) {
        this._body = data;
    },

    get status() {
        return this.res.statusCode;
    },

    // 设置返回给客户端的stausCode
    set status(statusCode) {
        if (typeof statusCode !== 'number') {
            throw new Error('statusCode must be a number!');
        }
        this.res.statusCode = statusCode;
    }

};