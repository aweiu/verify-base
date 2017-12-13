/**
 * Created by awei on 2016/7/5.
 */
import isIdentityCard from 'verify-identity-card'

let verifyErrMsg = require('./verify-err-msg')

function isNumber (val) {
  if (isNaN(val) || val === null || val === undefined || (val + '').trim() === '') return false
  return true
}

function macro (msg, macro, value) {
  if (!msg) msg = ''
  if (arguments.length === 3) {
    const reg = new RegExp(`{${macro}}`, 'g')
    msg = msg.replace(reg, value)
  }
  return msg
}

function verify (ruleName, fun) {
  if (typeof fun === 'function') {
    if (rules.hasOwnProperty(ruleName)) return console.warn(`${ruleName} has be used,please replace one`)
    rules[ruleName] = fun
  }
  if (rules.hasOwnProperty(ruleName)) {
    return function (val, arg) {
      const errMsg = rules[ruleName](val, arg)
      const valid = (errMsg === undefined)
      return {
        valid: valid,
        err_msg: valid ? null : errMsg
      }
    }
  }
}

const rules = {
  length (val, length) {
    if (verify('int')(length).valid && val.length !== length / 1) return macro(verifyErrMsg.common.length, 'length', length)
  },
  minLength (val, minLength) {
    if (verify('int')(minLength).valid && val.length < minLength) return macro(verifyErrMsg.common.minLength, 'minLength', minLength)
  },
  maxLength (val, maxLength) {
    if (verify('int')(maxLength).valid && val.length > maxLength) return macro(verifyErrMsg.common.maxLength, 'maxLength', maxLength)
  },
  maxNumber (val, maxNumber) {
    if (!isNumber(val)) return macro(verifyErrMsg.number.common)
    val = val / 1
    maxNumber += ''
    if (isNumber(maxNumber.replace('!', ''))) {
      if (maxNumber.indexOf('!') !== -1) {
        maxNumber = maxNumber.replace('!', '') / 1
        if (val >= maxNumber) return macro(verifyErrMsg.number.maxNumber2, 'maxNumber', maxNumber)
      } else {
        maxNumber = maxNumber / 1
        if (val > maxNumber) return macro(verifyErrMsg.number.maxNumber, 'maxNumber', maxNumber)
      }
    }
  },
  minNumber (val, minNumber) {
    if (!isNumber(val)) return macro(verifyErrMsg.number.common)
    val = val / 1
    minNumber += ''
    if (isNumber(minNumber.replace('!', ''))) {
      if (minNumber.indexOf('!') !== -1) {
        minNumber = minNumber.replace('!', '') / 1
        if (val <= minNumber) return macro(verifyErrMsg.number.minNumber2, 'minNumber', minNumber)
      } else {
        minNumber = minNumber / 1
        if (val < minNumber) return macro(verifyErrMsg.number.minNumber, 'minNumber', minNumber)
      }
    }
  },
  decimalLength (val, decimalLength) {
    if (!isNumber(val)) return macro(verifyErrMsg.number.common)
    val = val / 1
    if (isNumber(decimalLength)) {
      const decimal = (val + '').split('.')[1]
      if (decimal && decimal.length > decimalLength) return macro(verifyErrMsg.number.decimalLength, 'decimalLength', decimalLength)
    }
  },
  number (val, isType) {
    if (isType === false) return
    if (!isNumber(val)) return macro(verifyErrMsg.number.common)
  },
  int (val, isType) {
    if (isType === false) return
    if (!isNumber(val)) return macro(verifyErrMsg.number.common)
    if ((val + '').indexOf('.') !== -1) return macro(verifyErrMsg.int)
  },
  phone (val, isType) {
    if (isType === false) return
    const reg = /^1\d{10}$/
    if (!reg.test(val)) return macro(verifyErrMsg.phone)
  },
  idCard (val, isType) {
    if (isType === false) return
    if (!isIdentityCard(val)) return macro(verifyErrMsg.idCard)
  },
  bankCard (val, isType) {
    if (isType === false) return
    let tmp = true
    let total = 0
    for (let i = val.length; i > 0; i--) {
      let num = val.substring(i, i - 1)
      tmp = !tmp
      if (tmp) num = num * 2
      const gw = num % 10
      total += (gw + (num - gw) / 10)
    }
    if (total % 10 !== 0) return macro(verifyErrMsg.bankCard)
  },
  email (val, isType) {
    if (isType === false) return
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!reg.test(val)) return macro(verifyErrMsg.email)
  },
  verifyCode (val, isType) {
    if (isType === false) return
    if (!verify('int')(val).valid || !verify('length')(val, 6).valid) return macro(verifyErrMsg.verifyCode)
  }
}
verify.macro = macro
verify.errMsg = verifyErrMsg
Object.defineProperty(verify, 'errMsg', {
  set: v => (verifyErrMsg = v),
  get: () => verifyErrMsg
})
export default verify
