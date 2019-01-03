import DefaultOptions from '../utils/DefaultOptions';
import { DEFAULT_CONFIG, SCROLL_DIRECTION, style } from '../constants';

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
        if (_opts) {
            const _el = _opts.el;
            _that.el = _el;
            _that.indicator = _el && _el.children[0];
            _that.direction = _opts.direction;
            _that.interactive = _opts.interactive;
            _that.fade = _opts.fade;
            if (_that.fade) {
                _that.visible = 0;
                _that.indicator.style.opacity = '0';
            } else {
                _that.visible = 1;
                _that.indicator.style.opacity = '1';
            }
        }
    }

    /**
     * 更新scrollbar的样式
     * @param {String} prop 样式属性
     * @param {String} val 样式值
     */
    _setStyle (prop, val) {
        console.log(prop, val);
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
            _that.indicatorH = Math.max(INDICATOR_MIN_LEN, Math.round((_wrapH * _wrapH) / (_scrollH || _wrapH || 1)));
            _that._setStyle('height', `${_that.indicatorH}px`);
            _that.maxPosY = _wrapH - _that.indicatorH;
            _that.sizeRatioY = _that.maxPosY / _scroller.maxScrollY;
        } else {
            const _wrapW = _that.el.clientWidth;
            const _scrollW = _scroller.scrollW;
            _that.indicatorW = Math.max(INDICATOR_MIN_LEN, Math.round((_wrapW * _wrapW) / (_scrollW || _wrapW || 1)));
            _that._setStyle('width', `${_that.indicatorW}px`);
            _that.maxPosX = _wrapW - _that.indicatorW;
            _that.sizeRatioX = _that.maxPosX / _scroller.maxScrollX;
        }
    }

    /**
     * 更新滚动条的位置
     */
    updatePosition () {
        const _that = this;
        const _direction = _that.direction;
        const _scroller = _that.scroller;
        let _newPos = null;
        let _len = null;
        let _maxPos = null;

        if (_direction === SCROLL_DIRECTION.VERTICAL) {
            _newPos = _scroller.y * _that.sizeRatioY;
            _len = _that.indicatorH;
            _maxPos = _that.maxPosY;
        } else {
            _newPos = _scroller.x * _that.sizeRatioX;
            _len = _that.indicatorW;
            _maxPos = _that.maxPosX;
        }
        _updatePosition(_newPos, _len, _maxPos, _direction);

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
            if (direction === SCROLL_DIRECTION.VERTICAL) {
                _that._setStyle('height', `${len}px`);
                _that.y = pos;
            } else {
                _that._setStyle('width', `${len}px`);
                _that.x = pos;
            }
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
            _that.visible = 1;
            _that._setStyle('opacity', '1');

            _that.transitionTime(0);
            _that._calcute();
            _that.updatePosition();
        } else {
            _that.visible = 0;
            _that._setStyle('opacity', '0');
        }
    }
}
