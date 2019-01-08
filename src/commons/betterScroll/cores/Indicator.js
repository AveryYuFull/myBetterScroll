/* eslint-disable max-lines */
import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, SCROLL_DIRECTION, style, eventType, MOUSE_EVENT, EVENT_TYPE } from '../constants';
import { eventUtil } from '../utils/eventUtil';

// 滚动条indicator最小长度
const INDICATOR_MIN_LEN = 8;

/**
 * translate配置信息
 */
const translateConfig = {
    [SCROLL_DIRECTION.VERTICAL]: {
        translate: (pos) => {
            return `translateY(${pos}px)`;
        },
        relative: 'top'
    },
    [SCROLL_DIRECTION.HORIZONTAL]: {
        translate: (pos) => {
            return `translateX(${pos}px)`;
        },
        relative: 'left'
    }
};

/**
 * 样式配置
 */
const styleConfig = {
    [SCROLL_DIRECTION.VERTICAL]: 'height',
    [SCROLL_DIRECTION.HORIZONTAL]: 'width'
};

export default class Indicator extends DefaultOptions {
    defaultOptions = DEFAULT_CONFIG;

    constructor (scroller, options) {
        super(options);
        const _that = this;
        _that.scroller = scroller;
        _that.setDefaultOptions(options);

        _that._init();
    }

    /**
     * 初始化方法
     */
    _init () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _scrollbar = _opts && _opts.scrollbar;
        if (_opts) {
            const _el = _opts.el;
            _that.el = _el;
            _that.indicator = _el && _el.children[0];
            _that.direction = _opts.direction;
            _that.interactive = _scrollbar && _scrollbar.interactive;
            _that.pos = 0;
            _that.fade = typeof _scrollbar === 'boolean' ? _scrollbar : _scrollbar && _scrollbar.fade;
            if (_that.fade) {
                _that.visible = false;
                _that._setStyle('opacity', '0');
            } else {
                _that.visible = true;
                _that._setStyle('opacity', '1');
            }
        }

        if (_that.interactive) {
            _that._initEvtListener();
        }
    }

    /**
     * 监听事件
     * @memberof Indicator
     */
    _initEvtListener () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _listenEvents = _opts.listenEvents;
        if (_listenEvents) {
            eventUtil.initEventListener(_that.indicator, _listenEvents[0], _that._handleEvent.bind(_that), 'add');
            eventUtil.initEventListener(window, _listenEvents.slice(1), _that._handleEvent.bind(_that), 'add');
        }
    }

    /**
     * 事件处理程序
     * @param {Event} event 事件对象
     */
    _handleEvent (event) {
        const _that = this;
        event = eventUtil.getEvent(event);
        const _type = event && event.type;
        switch ((_type || '') + '') {
            case 'mousedown':
            case 'touchstart':
                _that._start(event);
                break;
            case 'mousemove':
            case 'touchmove':
                _that._move(event);
                break;
            case 'mouseup':
            case 'touchend':
                _that._end(event);
                break;
        }
    }

    /**
     * 阻止事件默认行为／阻止事件冒泡
     * @param {Event} event 事件对象
     */
    _preventEvent (event) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (_opts.preventDefault &&
            !_opts.isPreventDefaultErr(_opts.preventDefaultException)) {
            eventUtil.preventDefault(event);
        }
        if (_opts.stopPropagation) {
            eventUtil.stopPropagation(event);
        }
    }

    /**
     * 获取光标位置
     * @param {Event} event 事件对象
     * @returns {Number} 返回当前光标位置
     */
    _getPagePos (event) {
        let res = 0;
        if (event) {
            const _that = this;
            const _point = event.touches ? event.touches[0] : event;
            if (_that.direction === SCROLL_DIRECTION.VERTICAL) {
                res = _point.pageY;
            } else {
                res = _point.pageX;
            }
        }
        return res;
    }

    /**
     * 开始
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _start (event) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (event) {
            const _evtType = eventType[event.type];
            if (_evtType === MOUSE_EVENT) {
                const _button = eventUtil.getButton(event);
                if (_button !== '0') {
                    return;
                }
            }

            if (!_opts.enabled || (_that.initiated && _that.initiated !== _evtType)) {
                return;
            }
            _that.initiated = _evtType;
            _that._preventEvent();
            _that.pagePos = _that._getPagePos(event);
            _that.moved = false;

            _that.scroller.$emit(EVENT_TYPE.beforeScrollStart, {
                x: _that.scroller.x,
                y: _that.scroller.y
            });
        }
    }

    /**
     * 移动
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _move (event) {
        if (!event) {
            return;
        }

        const _that = this;
        const _opts = _that.defaultOptions;
        if (!_opts.enabled || !_that.initiated) {
            return;
        }
        _that._preventEvent();

        const _newPagePos = _that._getPagePos(event);
        const _delta = _newPagePos - _that.pagePos;
        _that.pagePos = _newPagePos;

        if (!_that.moved) {
            _that.scroller.$emit(EVENT_TYPE.scrollStart, {
                x: _that.scroller.x,
                y: _that.scroller.y
            });
            _that.moved = true;
        }

        _that._pos(_delta + _that.pos);
    }

    /**
     * 滑动滚动条
     * @param {Number} pos 滑动距离
     * @memberof Indicator
     */
    _pos (pos) {
        const _that = this;
        let x = 0;
        let y = 0;
        pos = _pos(pos);
        if (_that.direction === SCROLL_DIRECTION.VERTICAL) {
            y = pos;
        } else {
            x = pos;
        }
        _that.scroller._scrollTo(x, y);

        /**
         * 滑动滚动条
         * @param {Number} pos 滑动距离
         * @returns {Number} 返回新的位置
         */
        function _pos (pos) {
            const _maxPos = _that.maxPos;
            const _ratio = _that.sizeRatio;
            if (pos < 0) {
                pos = 0;
            } else if (pos > _maxPos) {
                pos = _maxPos;
            }
            pos = pos / _ratio;
            return pos;
        }
    }

    /**
     * 结束
     * @param {Event} event 事件对象
     * @memberof Indicator
     */
    _end (event) {
        if (event) {
            const _that = this;
            const _opts = _that.defaultOptions;
            if (!_opts.enabled || !_that.initiated) {
                return;
            }
            _that.initiated = false;
            _that._preventEvent();
        }
    }

    /**
     * 更新scrollbar的样式
     * @param {String} prop 样式属性
     * @param {String} val 样式值
     */
    _setStyle (prop, val) {
        const _that = this;
        const _indicatorStyle = _that.indicator.style;
        if (prop) {
            _indicatorStyle[prop] = val;
        }
    }

    /**
     * 计算indicator的长度
     */
    _calcute () {
        const _that = this;
        const _direction = _that.direction;
        const _scroller = _that.scroller;
        if (_direction === SCROLL_DIRECTION.VERTICAL) {
            const _wrapH = _that.el.clientHeight;
            const _scrollH = _scroller.scrollH;
            _that.indicatorSize = Math.max(INDICATOR_MIN_LEN, Math.round((_wrapH * _wrapH) / (_scrollH || _wrapH || 1)));
            _that._setStyle('height', `${_that.indicatorSize}px`);
            _that.maxPos = _wrapH - _that.indicatorSize;
            _that.sizeRatio = _that.maxPos / _scroller.maxScrollY;
        } else {
            const _wrapW = _that.el.clientWidth;
            const _scrollW = _scroller.scrollW;
            _that.indicatorSize = Math.max(INDICATOR_MIN_LEN, Math.round((_wrapW * _wrapW) / (_scrollW || _wrapW || 1)));
            _that._setStyle('width', `${_that.indicatorSize}px`);
            _that.maxPos = _wrapW - _that.indicatorSize;
            _that.sizeRatio = _that.maxPos / _scroller.maxScrollX;
        }
    }

    /**
     * 处理隐藏还是显示
     * @param {Boolean} visible 显示或隐藏滚动条bar
     */
    handleFade (visible) {
        const _that = this;

        _that.visible = visible;
        _that.transitionTime(visible ? 200 : 500);
        _that._setStyle('opacity', visible ? '1' : '0');
    }

    /**
     * 更新滚动条的位置
     */
    updatePosition () {
        const _that = this;
        const _direction = _that.direction;
        const _scroller = _that.scroller;
        let _newPos = null;

        if (_direction === SCROLL_DIRECTION.VERTICAL) {
            _newPos = _scroller.y * _that.sizeRatio;
        } else {
            _newPos = _scroller.x * _that.sizeRatio;
        }
        _updatePosition(_newPos, _that.indicatorSize, _that.maxPos, _direction);

        /**
         * 更行滚动条的位置
         * @param {Number} pos 滚动条的位置（水平／垂直）
         * @param {Number} len 滚动条的长度（高度／宽度）
         * @param {Number} maxPos 滚动条最大可以滚动的距离
         * @param {String} direction 滚动条方向
         */
        function _updatePosition (pos, len, maxPos, direction) {
            const _tmpLen = len;
            let _time = 0;
            if (pos < 0) {
                len = Math.max(INDICATOR_MIN_LEN, Math.round(len + pos * 3));
                pos = 0;
                _time = 500;
            } else if (pos > maxPos) {
                len = Math.max(INDICATOR_MIN_LEN, Math.round(len - (pos - maxPos) * 3));
                pos = maxPos + _tmpLen - len;
                _time = 500;
            }
            _that.pos = pos;
            _that._setStyle(styleConfig[direction], `${len}px`);
            _that._translate(pos, _time);
        }
    }

    /**
     * 移动滚动条到指定位置
     * @param {Number} pos 滚动条位置
     * @param {Number} time 动画方法
     */
    _translate (pos, time) {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _direction = _that.direction;
        if (_opts.useTransform) {
            _that.transitionTime(time);
            _that._setStyle(style.transform, translateConfig[_direction].translate(pos));
        } else {
            _that._setStyle(translateConfig[_direction].relative, `${pos}px`);
        }
    }

    /**
     * 设置滚动动画时长
     * @param {Number} time 动画时长
     */
    transitionTime (time) {
        const _that = this;
        _that._setStyle(style.transitionDuration, `${time || 0}ms`);
    }

    /**
     * 设置动画曲线方法
     * @param {*} easing 动画曲线方法
     */
    transitionTimingFunction (easing) {
        const _that = this;
        _that._setStyle(style.transitionTimingFunction, easing);
    }

    /**
     * 是否展示滚动条
     * @returns {Boolean} 是否应该展示滚动条
     */
    _shouldShow () {
        const _that = this;
        const _scroller = _that.scroller;
        const _direction = _that.direction;
        let res = false;
        if (_scroller &&
            ((_scroller.hasVScroll && _direction === SCROLL_DIRECTION.VERTICAL) ||
            (_scroller.hasHScroll && _direction === SCROLL_DIRECTION.HORIZONTAL))) {
            res = true;
        }

        return res;
    }

    /**
     * refresh indicator
     */
    refresh () {
        const _that = this;
        let _scrollbarAble = _that._shouldShow();
        if (_scrollbarAble) {
            _that.transitionTime(0);
            _that._calcute();
            _that.updatePosition();
        }
    }
}
