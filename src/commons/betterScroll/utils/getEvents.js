import isBrowser from './isBrowser';

/**
 * 返回事件类型
 * @returns {Array} 事件类型
 */
export default function getEvents () {
    if (isBrowser()) {
        return null;
    }

    let _evts = null;
    if ('ontouchstart' in window) {
        _evts = ['touchstart', 'touchmove', 'touchcacel', 'touchend'];
    } else {
        _evts = ['mousedown', 'mousemove', 'mousecancel', 'mouseend'];
    }
    return _evts;
}
