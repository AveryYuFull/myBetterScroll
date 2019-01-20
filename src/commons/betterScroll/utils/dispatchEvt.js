import extend from '../utils/extend';

/**
 * 模拟dom派发事件
 * @param {HTMLElement|Window} target 事件目标元素
 * @param {String} evtType 事件类型
 * @param {Object} options 可选参数
 */
export default function dispatchEvt (target, evtType, options) {
    if (target && target.tagName && evtType && typeof evtType === 'string') {
        let _evt = document.createEvent(window && window.MouseEvent ? 'MouseEvents' : 'Event');
        _evt.initEvent(evtType, true, true);
        _evt = extend(_evt, options);
        _evt._constructed = true;
        target.dispatchEvent(_evt);
    }
}