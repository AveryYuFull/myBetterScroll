import ScrollBase from './Scroll.base';
import { DEFAULT_CONFIG, EVENT_TYPE, MOUSE_EVENT, DIRECTION, eventType, style,
    probeType } from '../constants';
import { requestAnimationFrame, cancelAnimationFrame } from '../utils/raf';
import getStyle from '../utils/getStyle';

/**
 * 核心的滚动条事件逻辑的处理模块
 *
 * @export
 * @class ScrollCore
 * @extends {ScrollBase}
 */
export default class ScrollCore extends ScrollBase {
    /**
     * 默认配置参数
     *
     * @memberof ScrollCore
     */
    defaultOptions = DEFAULT_CONFIG;

    constructor (el, options) {
        super(el, options);

        const _that = this;
        _that.setDefaultOptions(options);
    }

    /**
     * mousedown/touchstart 回调方法
     * 记录一下当前鼠标或触摸位置
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _start (evt) {
        const _that = this;
        const _evtType = eventType[evt.type];
        if (_evtType === MOUSE_EVENT) {
            if (evt.button !== 0) {
                return;
            }
        }

        const _opts = _that.defaultOptions;
        if (!_opts.enabled || (_that.initiated && _that.initiated !== _evtType)) {
            return;
        }
        _that.initiated = _evtType;

        if (_opts.preventDefault &&
            !_opts.isPreventDefaultErr(evt.target, _opts.preventDefaultException)) {
            evt.preventDefault();
        }
        if (_opts.stopPropagation) {
            evt.stopPropagation();
        }

        _that.startTime = _opts.getNow();

        _that.startX = _that.x;
        _that.startY = _that.y;
        _that.absStartX = _that.x;
        _that.absStartY = _that.y;

        let point = evt.touches ? evt.touches[0] : evt;
        _that.pointX = point.pageX;
        _that.pointY = point.pageY;

        _that.directionX = 0;
        _that.directionY = 0;
        _that.directionLocked = 0;
        _that.distX = 0;
        _that.distY = 0;

        _that.$emit(EVENT_TYPE.beforeScrollStart);
    }

    /**
     * mousemove/touchmove 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _move (evt) {
        const _that = this;
    }

    /**
     * mouseup/touchend 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _end (evt) {
    }

    /**
     * 使用requestAnimationFrame开启动画
     * @param {Number} destX 水平目标位置
     * @param {Number} destY 垂直目标位置
     * @param {Number} duration 动画时长（ms）
     * @param {String} 动画规则曲线方法
     */
    _animate (destX, destY, duration, easing) {
        const _that = this;
        const _startX = _that.x;
        const _startY = _that.y;
        const startTime = getNow();
        const destTime = startTime + time;

        clearAnimationFrame(_that.animateTimer);
        _that.animateTimer = requestAnimationFrame(_magic);

        function _magic () {
            let _now = getNow();
            if (_now >= destTime) {
                _that._transitionEnd(destX, destY);

                if (!_that._resetPosition(duration, easing)) {
                    _that.$emit(EVENT_TYPE.scrollEnd, {
                        x: _that.x,
                        y: _that.y
                    });
                }
                return;
            }

            _now = (_now - startTime) / duration;
            let _newX = (destX - _startX) * easing(_now) + startX;
            let _newY = (destY - _startY) * easing(_now) + startY;
            _translate(_newX, _newY);

            _that.animateTimer = requestAnimationFrame(_magic);
        }
    }

    /**
     * 滚动到指定的位置
     * @param {Number} x 水平目标位置
     * @param {Number} y 垂直目标位置
     * @param {Number} time 动画时长（ms）
     * @param {String} 动画规则曲线方法
     */
    _scrollTo (x, y, time, ease) {
        const _that = this;
        if (x === _that.x && y === _that.y) {
            return;
        }

        const _opts = _that.defaultOptions;
        const _scroller = _that.scroller;

        _that.isInTransition = _opts.useTransition && time;
        if (!time || _that.useTransition) { // 使用transition动画效果
            _scroller[style.transitionDuration] = time;
            _scroller[style.transitionTimingFunction] = ease;
            _that._translate(x, y);

            if (time && _opts.probeType === probeType.PROBE_REALTIME) {
                _startProbe();
            } else if (_opts.probeType === probeType.PROBE_NORMAL) {
                _that.$emit(EVENT_TYPE.scroll, {
                    x: _that.x,
                    y: _that.y
                });
                if (!time) {
                    let _reflow = document.body.offsetHeight;
                    if(!_resetPosition(time, ease)) {
                        _that.$emit(EVENT_TYPE.scrollEnd, {
                            x: _that.x,
                            y: _that.y
                        });
                    }
                }
            }
        } else { // 使用requestAnimationFrame做动画效果
            _that._animate(x, y, time, easing);
        }

        /**
         * 记录动画过程中派发滚动事件
         */
        function _startProbe () {
            clearAnimationFrame(_that.probeTimer);
            _that.probeTimer = requestAnimationFrame(_magic);

            /**
             * magic回调
             */
            function _magic () {
                const pos = _that._getComputedPostion();
                if (pos) {
                    _that.$emit(EVENT_TYPE.scroll, {
                        x: pos.x,
                        y: pos.y
                    });
                }

                if (_that.isInTransition) {
                    _that.probeTimer = requestAnimationFrame(_magic);
                }
            }
        }
    }

    /**
     * 获取滚动位置
     * @returns {Object|Null} 返回位置信息
     */
    _getComputedPostion () {
        const _that = this;
        const _opts = _that.defaultOptions;
        const matrix = getStyle(_that.scroller);
        let res = null;
        if (matrix) {
            if (_opts.useTransform) {
                matrix = matrix[style.transform].split(')')[0].split(',');
                res = {
                    x: matrix[12] || matrix[4],
                    y: matrix[13] || matrix[5]
                };
            } else {
                res = {
                    x: matrix.left.replace(/[^-\d.]/g, ''),
                    y: matrix.top.replace(/[^-\d.]/g, '')
                };
            }
        }
        return res;
    }

    /**
     * 如果滚动内容超过最大滚动距离和最小滚动距离，需要重置滚动位置
     *
     * @param {Number} time 动画时间
     * @param {String} easing 动画函数
     * @memberof ScrollCore
     */
    _resetPosition (time, easing) {

    }

    /**
     * 滚动
     *
     * @param {Number} x 水平滚动距离
     * @param {Number} y 垂直滚动距离
     * @memberof ScrollCore
     */
    _translate(x, y) {
        const _that = this;
        const _opts = _that.defaultOptions;

        if (_opts.useTransform) {
            _that.scroller[style.transform] = `translate(${x}px, ${y}px, 0)`;
        } else {
            _that.scroller.left = `${x}px`;
            _that.scroller.top = `${y}px`;
        }
    }

    _transitionEnd (evt) {

    }
}
