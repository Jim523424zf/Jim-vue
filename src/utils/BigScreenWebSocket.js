/**
* @Description:webSocket 封装
* @Author: Jim(ZF)
* @Date: 2021-05-30 15:35:03
**/
class MyWebSocket {
    constructor (sid) {
        this.sid = sid
        this.ws = null
        this.timeOut = 15000 // 超时时间为6s
        this.timeOutTimer = null
        this.serverTimeOutObj = null
        this.lockReconnect = false // 避免重复连接
        this.messageFun = [] // 方法集合
        this.init()
    }

    init () {
        const that = this
        // 具体根据环境修改
        // ws://192.168.88.7:8092/imserver/screen0908
        let socketUrl = process.env.VUE_APP_SOCKET_URL + this.sid
        socketUrl = socketUrl.replace('https', 'ws').replace('http', 'ws')

        if (that.ws) {
            that.ws.close()
            that.ws = null
        }
        // FIXME 参数拼接
        this.ws = new WebSocket(socketUrl)

        this.ws.onopen = () => {
            console.log('socket 打开')
            // 发送心跳检测
            this.heartCheckStart()
        }

        this.ws.onmessage = (msg) => {
            if (msg.data === '连接成功') {
                console.log('socket连接成功')
                return
            }
            const data = JSON.parse(msg.data)
            if (!data || this.messageFun.length === 0) return
            that.messageFun.forEach((item) => {
                item(data)
            })
            // 重置心跳检测
            this.heartCheckReset()
        }

        this.ws.onclose = () => {
            // 解决异常断开的问题
            console.log('socket 断开')
            // TODO 重连处理
            this.reconnet()
        }

        this.ws.onerror = () => {
            console.log('socket 连接出错')
            this.reconnet()
        }
    }

    reconnet () {
        console.log('socket重连')
        const that = this
        if (this.lockReconnect) return // 正在重连的情况下 直接退出
        this.lockReconnect = true
        setTimeout(() => {
            that.init()
            that.lockReconnect = false
        }, 2000)
    }

    heartCheckStart () {
        const that = this
        this.timeOutTimer = setTimeout(() => {
            if (!that.ws.readyState === that.ws.OPEN) return // 为啥这么写???? 忘了
            console.log('发送心跳')
            that.ws.send('ping')
            // 发送消息后 超时事件以内没收到消息 前端自动断开连接
            that.serverTimeOutObj = setTimeout(() => {
                console.log('自动断开')
                that.ws.close()
            }, that.timeOut) // 超时
        }, this.timeOut)
    }

    heartCheckReset () {
        clearTimeout(this.serverTimeOutObj)
        clearTimeout(this.timeOutTimer)
        this.heartCheckStart()
    }

    // 添加回调方法
    getMsg (fn) {
        this.messageFun.push(fn)
    }

    close () {
        this.ws.close()
    }

    sendMsg (msg) {
        this.ws.send(msg)
    }
}

const mySocket = new MyWebSocket('screen_0908')

export default mySocket
