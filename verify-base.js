'use strict';

var isIdentityCard = require('verify-identity-card');

var verifyErrMsg = require('./verify-err-msg'); /**
                                                 * Created by awei on 2016/7/5.
                                                 */

function isNumber(val) {
  if (isNaN(val) || val === null || val === undefined || (val + '').trim() === '') return false;
  return true;
}
function macro(msg, macro, value) {
  if (!msg) msg = '';
  if (arguments.length === 3) {
    var reg = new RegExp('{' + macro + '}', 'g');
    msg = msg.replace(reg, value);
  }
  return msg;
}
function verify(ruleName, fun) {
  if (typeof fun === 'function') {
    if (rules.hasOwnProperty(ruleName)) return console.warn(ruleName + ' has be used,please replace one');
    rules[ruleName] = fun;
  }
  if (rules.hasOwnProperty(ruleName)) {
    return function (val, arg) {
      var errMsg = rules[ruleName](val, arg);
      var valid = errMsg === undefined;
      return {
        valid: valid,
        err_msg: valid ? null : errMsg
      };
    };
  }
}
var rules = {
  length: function length(val, _length) {
    if (verify('int')(_length).valid && val.length !== _length / 1) return macro(verifyErrMsg.common.length, 'length', _length);
  },
  minLength: function minLength(val, _minLength) {
    if (verify('int')(_minLength).valid && val.length < _minLength) return macro(verifyErrMsg.common.minLength, 'minLength', _minLength);
  },
  maxLength: function maxLength(val, _maxLength) {
    if (verify('int')(_maxLength).valid && val.length > _maxLength) return macro(verifyErrMsg.common.maxLength, 'maxLength', _maxLength);
  },
  maxNumber: function maxNumber(val, _maxNumber) {
    if (!isNumber(val)) return macro(verifyErrMsg.number.common);
    val = val / 1;
    _maxNumber += '';
    if (isNumber(_maxNumber.replace('!', ''))) {
      if (_maxNumber.indexOf('!') !== -1) {
        _maxNumber = _maxNumber.replace('!', '') / 1;
        if (val >= _maxNumber) return macro(verifyErrMsg.number.maxNumber2, 'maxNumber', _maxNumber);
      } else {
        _maxNumber = _maxNumber / 1;
        if (val > _maxNumber) return macro(verifyErrMsg.number.maxNumber, 'maxNumber', _maxNumber);
      }
    }
  },
  minNumber: function minNumber(val, _minNumber) {
    if (!isNumber(val)) return macro(verifyErrMsg.number.common);
    val = val / 1;
    _minNumber += '';
    if (isNumber(_minNumber.replace('!', ''))) {
      if (_minNumber.indexOf('!') !== -1) {
        _minNumber = _minNumber.replace('!', '') / 1;
        if (val <= _minNumber) return macro(verifyErrMsg.number.minNumber2, 'minNumber', _minNumber);
      } else {
        _minNumber = _minNumber / 1;
        if (val < _minNumber) return macro(verifyErrMsg.number.minNumber, 'minNumber', _minNumber);
      }
    }
  },
  decimalLength: function decimalLength(val, _decimalLength) {
    if (!isNumber(val)) return macro(verifyErrMsg.number.common);
    val = val / 1;
    if (isNumber(_decimalLength)) {
      if ((val + '').split('.')[1].length > _decimalLength) return macro(verifyErrMsg.number.decimalLength, 'decimalLength', _decimalLength);
    }
  },
  number: function number(val, isType) {
    if (isType === false) return;
    if (!isNumber(val)) return macro(verifyErrMsg.number.common);
  },
  int: function int(val, isType) {
    if (isType === false) return;
    if (!isNumber(val)) return macro(verifyErrMsg.number.common);
    if ((val + '').indexOf('.') !== -1) return macro(verifyErrMsg.int);
  },
  phone: function phone(val, isType) {
    if (isType === false) return;
    var reg = /^1\d{10}$/;
    if (!reg.test(val)) return macro(verifyErrMsg.phone);
  },
  idCard: function idCard(val, isType) {
    if (isType === false) return;
    if (!isIdentityCard(val)) return macro(verifyErrMsg.idCard);
  },
  bankCard: function bankCard(val, isType) {
    if (isType === false) return;
    var tmp = true;
    var total = 0;
    for (var i = val.length; i > 0; i--) {
      var num = val.substring(i, i - 1);
      tmp = !tmp;
      if (tmp) num = num * 2;
      var gw = num % 10;
      total += gw + (num - gw) / 10;
    }
    if (total % 10 !== 0) return macro(verifyErrMsg.bankCard);
  },
  email: function email(val, isType) {
    if (isType === false) return;
    var reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(val)) return macro(verifyErrMsg.email);
  },
  verifyCode: function verifyCode(val, isType) {
    if (isType === false) return;
    if (!verify('int')(val).valid || !verify('length')(val, 6).valid) return macro(verifyErrMsg.verifyCode);
  }
};
verify.macro = macro;
verify.errMsg = verifyErrMsg;
Object.defineProperty(verify, "errMsg", {
  set: function set(v) {
    return verifyErrMsg = v;
  },
  get: function get() {
    return verifyErrMsg;
  }
});
module.exports = verify;