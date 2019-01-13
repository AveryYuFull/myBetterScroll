import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG, EVENT_TYPE_VALUE, BUTTON_TYPE } from '../constants';
import eventUtil from '../utils/eventUtil';

export default class ScrollCore extends ScrollBase {
    defaultOptions = DEFAULT_CONFIG;

    constructor (options) {
        super(options);
        const _that = this;
        _that._handleOptions(options);
    }

    /**
     * 滚动开始前
     * @param {Event} event 滚动事件对象
     * @memberof ScrollCore
     */
    _start (event) {
        const _that = this;
        const _opts = _that.defaultOptions;
        let _evtType = event instanceof MouseEvent ? EVENT_TYPE_VALUE.MOUSE_EVENT : EVENT_TYPE_VALUE.TOUCH_EVENT;        
        if (_evtType === EVENT_TYPE_VALUE.MOUSE_EVENT) {
            const _button = eventUtil.getButton(event);
            if (_button !== BUTTON_TYPE.LEFT_MOUSE) {
                return;
            }
        }
    }

    /**
     * 滚动滚动条
     * @param {Event} event 滚动事件对象
     * @memberof ScrollCore
     */
    _move (event) {
    }
}
