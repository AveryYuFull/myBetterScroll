/**
 * 添加/删除事件处理程序
 * @param {HTMLElement} el 事件currentTarget元素
 * @param {Array|String} types 事件类型
 * @param {Function} handler 事件处理程序
 * @param {string} [flag='add'] 添加或删除事件处理程序
 * @param {Object|Boolean} capture 捕获/冒泡监听事件
 */
function initEventListener (el, types, handler, flag = 'add', capture) {
    if (!el || !types || !handler) {
        return;
    }

    flag = flag !== 'remove' ? 'add' : 'remove';
    if (!(capture instanceof Object) &&
        supportPassive.isSupportPassive()) {
        capture = {
            capture: capture,
            passive: true
        };
    }
    if (!Array.isArray(types)) {
        types = [types];
    }
    types.forEach(type => {
        if (type) {
            _initEvent(type);
        }
    });

    /**
     * 添加/删除事件处理程序
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

/**
 * 添加事件处理程序
 * @param {HTMLElement} el 事件currentTarget对象
 * @param {String} type 事件类型
 * @param {Function} handler 事件处理程序
 * @param {Object|Boolean} capture 捕获/冒泡阶段注册事件
 */
function addHandler (el, type, handler, capture) {
    if (!el || !handler || !type) {
        return;
    }

    if (el.addEventListener instanceof Function) {
        el.addEventListener(type, handler, capture);
    } else if (el.attachEvent instanceof Function) {
        el.attachEvent('on' + type, handler);
    } else {
        el['on' + type] = handler;
    }
}

/**
 * 取消事件处理程序
 * @param {HTMLElement} el 事件currentTarget对象
 * @param {String} type 事件类型
 * @param {Function} handler 事件处理程序
 * @param {Object|Boolean} capture 捕获/冒泡阶段注册事件
 */
function removeHandler (el, type, handler, capture) {
    if (!el || !handler || !type) {
        return;
    }

    if (el.removeEventListener instanceof Function) {
        el.removeEventListener(type, handler, capture);
    } else if (el.detachEvent instanceof Function) {
        el.detachEvent('on' + type, handler);
    } else {
        el['on' + type] = null;
    }
}

const supportPassive = {
    /**
     * 判断浏览器是否支持passive事件
     * @returns {Boolean} 浏览器是否支持注册passive事件
     */
    isSupportPassive () {
        let supportsPassiveOption = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassiveOption = true;
                }
            });
            window.addEventListener('test', null, opts);
        } catch (e) {};
        supportPassive.isSupportPassive = () => {
            return supportsPassiveOption;
        };

        return supportsPassiveOption;
    }
};

/**
 * event事件util对象
 */
export const eventUtil = {
    // 添加/删除事件处理程序
    initEventListener,
    /**
     * 获取事件对象
     * @param {Event} event 事件对象
     * @returns {Event} 事件对象
     */
    getEvent (event) {
        return event || window.event;
    },
    /**
     * 获取事件目标对象
     * @param {Event} event 事件对象
     * @returns {Object} 事件目标对象
     */
    getTarget (event) {
        let res = null;
        if (event) {
            res = event.target || event.srcElement;
        }
        return res;
    },
    /**
     * 阻止事件冒泡/捕获
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
     * 阻止事件默认行为
     * @param {Event} event 事件对象
     */
    preventDefault (event) {
        if (event && !supportPassive.isSupportPassive()) {
            if (event.preventDefault instanceof Function) {
                event.preventDefault();
            } else {
                event.returnValue = false;
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
