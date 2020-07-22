const TokenKey = 'token'

const TCP = 0
const MQTT = 1
const HTTP = 2
const COAP = 3

const ProtocolList = ['TCP','MQTT','HTTP','COAP']
//获取协议字符串
const ProtoToStr = (index) => (index<0 || index>3?'':ProtocolList[index])

export {
    TokenKey,
    TCP,
    MQTT,
    HTTP,
    COAP,
    ProtoToStr
}