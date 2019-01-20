import setStyle from '../../utils/setStyle';
import eventUtil from '../../utils/eventUtil';
import DefaultOptions from '../../utils/DefaultOptions';
import { DEFAULT_CONFIG } from '../../constants';
import getEvents from '../../utils/getEvents';

class Indicator extends DefaultOptions {
    // 默认配置参数
    defaultOptions = DEFAULT_CONFIG;

    constructor (el, options) {
        super(options);

        const _that = this;
        _that.setDefaultOptions(options);
        _that._init(el, options);
    }

    /**
     * 初始化
     * @param {HTMLElement} el scrollbar的dom元素对象
     * @param {Object} options 默认可选参数
     * @param {Boolean} options.fade 滚动条默认是否处于隐藏状态
     * @param {Boolean} options.interactive 是否可以拖动滚动条来实现滑动
     */
    _init (el, options) {
        const _that = this;
        _that.el = el;
        _that.indicator = el && el.children && el.children[0];
        _that.fade = (options && options.fade) || false;
        _that.interactive = (options && options.interactive) || true;

        setStyle(_that.indicator, 'opacity', _that.fade ? '0' : '1');
        if (_that.interactive) {
            _initEventListener();
        }

        _that._refresh();
    }

    /**
     * 刷新滚动bar
     * @memberof Indicator
     */
    _refresh () {

    }

    _shouldRefresh () {}

    /**
     * 初始化事件监听器
     * @memberof Indicator
     */
    _initEventListener () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _target = _opts.bindToWrapper ? _that.indicator : window;
        const _pointerEvents = getEvents();
        const _args = [
            [_that.indicator, _pointerEvents[0], _that._handleEvent.bind(_that), true],
            [_target, _pointerEvents.slice(1), _that._handleEvent.bind(_that), true]
        ]
        _args.forEach((arg) => {
            if (arg) {
                eventUtil.initEventListener.apply(null, arg);
            }
        });
    }

    /**
     * 事件处理程序
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _handleEvent (event) {
        const _that = this;
        const _type = (event && event.type) || '';
        switch (_type) {
            case 'mousedown':
            case 'touchstart':
                _that._start(event);
                break;
            case 'mousemove':
            case 'touchmove':
                _that._move(event);
                break;
            case 'mouseup':
            case 'mousecancel':
            case 'touchend':
            case 'touchend':
                _that._end(event);
                break;
        }
    }

    /**
     * 滑动开始
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _start (event) {
    }

    /**
     * 滑动
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _move (event) {
    }

    /**
     * 滑动结束
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _end (event) {
    }
}