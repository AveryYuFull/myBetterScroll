import supportPassive from './supportPassive';

/**
 * 注册/解除事件
 *
 * @export
 * @param {*} el 事件触发者
 * @param {*} type 事件类型
 * @param {*} fn 回调方法
 * @param {Boolean} [flag=true] 添加、解除事件
 * @param {boolean} [capture=true] 捕获、冒泡阶段
 */
export default function initEventListener (el, types, fn, flag = true, capture = true) {
    if (!el || !types || !fn) {
        return;
    }

    flag = (flag && 'add') || 'remove';
    let _capture = capture;
    if (typeof _capture !== 'object') {
        _capture = {
            passive: supportPassive(),
            capture: capture
        };
    }

    if (!Array.isArray(types)) {
        types = [types];
    }

    types && types.forEach(type => {
        _initEvent(type);
    })

    /**
     * 注册/解除事件
     *
     * @param {String} type 事件类型
     */
    function _initEvent (type) {
        console.log('type-->', type);
        if (type && el) {
            el[flag + 'EventListener'](type, fn, _capture);
        }
    }
}

