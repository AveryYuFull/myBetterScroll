import eventUtil from './eventUtil';
import isPreventDefaultException from './isPreventDefaultException';

/**
 * 阻止事件默认行为和阻止事件捕获／冒泡
 * @param {Event} event 事件对象
 * @param {Object} options 可选参数
 */
export default function preventStopEvent (event, options) {
    if (!event) {
        return;
    }
    if (options.preventDefault &&
        isPreventDefaultException(eventUtil.getTarget(event), options.preventDefaultException)) {
        eventUtil.preventDefault();
    }
    if (options.stopPropagation) {
        eventUtil.stopPropagation();
    }
}
