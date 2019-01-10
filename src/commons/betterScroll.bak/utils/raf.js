import isBrowser from './isBrowser';
import getNow from './getNow';

const noop = function () {};

(function () {
    if (!isBrowser()) {
        window.cancelAnimationFrame = window.requestAnimationFrame = noop;
        return;
    }

    let _lastTime = 0;
    const _vendors = ['webkit', 'moz'];

    for (let i = 0; i < _vendors.length && !window.requestAnimationFrame; i++) {
        const _vendor = _vendors[i];
        window.requestAnimationFrame = window[_vendor + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[_vendor + 'CancelAnimationFrame'] ||
            window[_vendor + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            let _currTime = getNow();
            let _timeToCall = Math.max(0, 16 - (_currTime - _lastTime));
            let id = setTimeout(function () {
                if (callback instanceof Function) {
                    callback(_currTime + _timeToCall);
                }
            }, _timeToCall);
            _lastTime = _currTime + _timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            window.clearTimeout(id);
        };
    }
})();

// 回调方法列表
const callbackList = [];

/**
 * 列表查询指定的数据，如果查询到，就返回对应的数据，反之返回null
 *
 * @param {Array} list 列表
 * @param {Function} predicate 判断函数
 * @returns {Object} 返回查询到的元素
 */
function _find(list, predicate) {
    let res = null;

    if (list) {
        for (let i = 0; i < list.length; i++) {
            if ((predicate instanceof Function) &&
                predicate(list[i], i, list)) {
                res = list[i];
                break;
            }
        }
    }
    return res;
}

/**
 * 删除列表中指定的元素
 *
 * @param {Array} list 列表元素
 * @param {Function} predicate 判断函数
 * @returns {Object} 返回删除的元素, 如果删除没有成功，就返回null
 */
function _removeItem (list, predicate) {
    let res = null;
    if (list && list.length > 0 && predicate) {
        let _index = _findIndex(list, predicate);
        if (~_index) {
            res = list.splice(_index, 1);
        }
    }
    return res;
}

/**
 * 列表查询指定的数据，如果查询到，就返回对应的数据的索引，反之返回-1
 *
 * @param {Array} list 列表
 * @param {Function} predicate 判断函数
 * @returns {Object} 返回查询到元素的索引
 */
function _findIndex (list, predicate) {
    let res = -1;

    if (list) {
        for (let i = 0; i < list.length; i++) {
            if ((predicate instanceof Function) &&
                predicate(list[i], i, list)) {
                res = i;
                break;
            }
        }
    }
    return res;
}

/**
 * 添加数据
 *
 * @param {Array} list 列表
 * @param {any} data 数据
 */
function _addList (list, data) {
    if (list && Array.isArray(list) &&
        typeof data !== 'undefined') {
        list.push(data);
    }
}

// 定义requestAnimationFrame
const requestAnimationFrame = function (callback) {
    const _entry = _find(callbackList, item => item.callback === callback);
    if (_entry) {
        return _entry.requestId;
    }

    let requestId = window.requestAnimationFrame(time => {
        if (callback instanceof Function) {
            callback(time);
        }
        _removeItem(callbackList, item => item.requestId === requestId);
    });

    _addList({
        requestId,
        callback
    });
    return requestId;
};

// 定义cancelAnimationFrame
const cancelAnimationFrame = function (id) {
    if (typeof id !== 'undefined') {
        _removeItem(callbackList, item => item.requestId === id);
        window.cancelAnimationFrame(id);
    }
};

export {
    requestAnimationFrame,
    cancelAnimationFrame
};
