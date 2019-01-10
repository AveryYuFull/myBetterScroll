// 是否支持passive属性
const _supportPassive = (function () {
    var supportsPassiveOption = false;
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassiveOption = true;
            }
        });
        window.addEventListener('test', null, opts);
    } catch (e) {};
    return supportsPassiveOption;
})();

/**
 * 添加／解除事件监听器
 * @param {HTMLElement} el 事件监听元素
 * @param {String|Array} types 事件类型
 * @param {Function} fn 事件处理程序
 * @param {Boolean} flag 添加／解除事件监听
 * @param {Boolean|Object} capture 在捕获／冒泡阶段处理事件
 * @returns {Boolean} 是否成功
 */
function _initEventListener (el, types, fn, flag, capture = true) {
    if (!el || !types || !fn) {
        return false;
    }

    if (typeof capture === 'boolean') {
        capture = {
            capture: capture,
            passive: _supportPassive
        };
    }
    flag = !flag ? 'remove' : 'add';

    if (!(types instanceof Array)) {
        types = [types];
    }
    types.forEach(type => {
        _initEvent(type);
    });

    return true;

    /**
     * 添加／解除事件监听器
     * @param {String} type 事件类型
     */
    function _initEvent (type) {
        let _fn = null;
        switch ((flag || '') + '') {
            case 'add':
                _fn = addHandler;
                break;
            case 'remove':
                _fn = removeHandler;
                break;
        }
        if (_fn instanceof Function) {
            _fn(el, type, handler, capture);
        }
    }
}

const eventUtil = {
    initEventListener: _initEventListener,
    /**
     * 添加事件监听器
     * @param {HTMLElement} el 事件元素
     * @param {String} type 事件类型
     * @param {Function} fn 事件处理程序
     * @param {Object|Boolean} capture 在捕获／冒泡阶段处理事件
     * @returns {Boolean} 是否成功
     */
    addHandler (el, type, fn, capture) {
        if (!el || !type || !fn) {
            return false;
        }

        if (el.addEventListener instanceof Function) {
            el.addEventListener(type, fn, capture);
        } else if (el.attachEvent instanceof Function) {
            el.attachEvent('on' + type, fn);
        } else {
            el['on' + type] = fn;
        }
        return true;
    },
    /**
     * 解除事件监听器
     * @param {HTMLElement} el 事件元素
     * @param {String} type 事件类型
     * @param {Function} fn 事件处理程序
     * @param {Object|Boolean} capture 在捕获／冒泡阶段处理事件
     * @returns {Boolean} 是否成功
     */
    removeHandler (el, type, fn, capture) {
        if (!el || !type || !fn) {
            return false;
        }

        if (el.removeEventListener instanceof Function) {
            el.removeEventListener(el, type, fn, capture);
        } else if (el.detachEvent instanceof Function) {
            el.detachEvent('on' + type, fn);
        } else {
            el['on' + type] = null;
        }
    },
    /**
     * 获取事件对象
     * @param {Event} event 事件对象
     * @returns {Event} 返回事件对象
     */
    getEvent (event) {
        return event || window.event;
    },
    /**
     * 阻止事件的浏览器默认行为
     * @param {Event} event 事件对象
     */
    preventDefault (event) {
        if (event) {
            if (event.preventDefault instanceof Function) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    },
    /**
     * 阻止事件冒泡
     * @param {Event} event 事件对象
     */
    stopPropagation (event) {
        if (event) {
            if (event.stopPropagation instanceof Function) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    },
    /**
     * 获取button属性
     * @param {Event} event 事件对象
     * @returns {String} 事件button属性
     */
    getButton (event) {
        let res;
        if (event) {
            const _button = event.button + '';
            if (document.implementation.hasFeature('MouseEvents', '2.0')) {
                res = _button;
            } else {
                switch (_button) {
                    case '0':
                    case '1':
                    case '3':
                    case '5':
                    case '7':
                        res = '0';
                        break;
                    case '2':
                    case '6':
                        res = '2';
                        break;
                    case '4':
                        res = '1';
                        break;
                }
            }
        }
        return res;
    }
};

export default eventUtil;
