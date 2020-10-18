const TokenKey = 'token'

const TCP = 0
const MQTT = 1
const HTTP = 2
const COAP = 3

const ProtocolList = ['TCP', 'MQTT', 'HTTP', 'COAP']
// 获取协议字符串
const ProtoToStr = (index) => (index < 0 || index > 3 ? '' : ProtocolList[index])

const Number = 1
const String = 2
const Boolean = 3
const JSON = 4
const FieldTypeList = ['Number', 'String', 'Boolean', 'JSON']
const FieldTypeToStr = (index) => (index < 0 || index >= FieldTypeList.length ? '' : FieldTypeList[index])
export {
  TokenKey,
  TCP,
  MQTT,
  HTTP,
  COAP,
  ProtoToStr,
  FieldTypeToStr
}
