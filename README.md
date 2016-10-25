# verify-base
校验基础包，内含各种常用校验方法。

## 安装
```
npm install verify-base
```
## 使用
```
import verifyBase from 'verify-base'
// 获取校验方法 name: 校验方法名
var verifySomeThing = verifyBase(name)
// 执行校验 val: 待校验的值 rule: 校验规则
verifySomeThing(val, rule)
// 返回：{valid: true / false, err_msg: 'xxx'}
```
### 支持的校验方法如下：
* length: 校验文本长度
* minLength: 校验文本最短长度
* maxLength: 校验文本最长长度
* maxNumber: 校验数字最大值
* minNumber: 校验数字最小值
* decimalLength: 校验小数位
* number: 校验是否为数字
* int: 校验是否为整数
* phone: 校验是否为手机号
* idCard: 校验是否为身份证号
* bankCard: 校验是否为银行卡号
* email: 校验是否为电子邮件地址
* verifyCode: 校验是否为6位数字验证码
### 示例
```
// 校验手机号
var verifyPhone = verifyBase('phone')
console.log(verifyPhone('186xxxxxx'))

// 校验数字最大值(最小值校验同理)
var verifyMaxNumber = verifyBase('maxNumber')
// 校验1是否大于等于2
console.log(verifyMaxNumber(1, 2))
// 校验1是否大于2
console.log(verifyMaxNumber(1, '!2'))
```
## 拓展校验规则
｀｀｀
// name: 校验方法名 verifyFun: 校验方法
verifyBase(name, verifyFun)
｀｀｀
### 示例
```
// 新增校验是否为6位数字 val: 调用校验时传入的第一个参数 rule: 调用校验时传入的第二个参数
// 校验是否为6位数字这种一般时不需要额外参数用来对比,所以rule参数用不到。校验文本长度，数字大小这种才会用到rule
verifyBase('verify6', (val, rule) => {
	// 判断是否为6位数字
	// 只需要关注错误的情况 返回出错提示即可
	if (!verifyBase('number')(val).valid || !verifyBase('length')(val, 6)) return '请输入正确的6位数字验证码'
})
// 调用
verifyBase('verify6')(123456)
```
### 属性
errMsg: 默认报错信息
```
{
  number: {
    common: '应为数字',
    // >
    maxNumber: '不能大于{maxNumber}',
    // >=
    maxNumber2: '应小于{maxNumber}',
    // <
    minNumber: '不能小于{minNumber}',
    // <=
    minNumber2: '应大于{minNumber}',
    decimalLength: '最多为{decimalLength}位小数'
  },
  // 特殊类型
  int: '应为整数',
  phone: '手机号不正确',
  idCard: '身份证号不正确',
  bankCard: '银行卡号不正确',
  verifyCode: '验证码错误',
  email: '邮箱格式不正确',
  // 其他
  common: {
    length: '内容长度必须为{length}位',
    minLength: '内容至少{minLength}位',
    maxLength: '内容至多{maxLength}位'
  }
}
// 修改或拓展报错信息
verifyBase.errMsg.common.empty = '{mark}不能为空'
```
### 方法
macro (msg, macro, value)<br>
*说明：用于替换报错信息中的'{}'内定义的关键字，一般用于封装校验插件时候使用* <br>
- msg(String):错误信息<br>
- macro(String):关键字<br>
- value(String):替换文本

### 示例
```
// 修改或拓展报错信息
verifyBase.errMsg.common.maxLength = '{mark}内容至多{maxLength}位'
// 这里只是做个示例 实际开发中，这个mark应该是你封装的校验插件中的某个配置项
var mark = '个性签名'
var errMsg = verifyBase('maxLength')('个性签名', 3).err_msg
console.log(verifyBase.macro(errMsg, 'mark', mark))
// 输出：个性签名内容至多3位
```