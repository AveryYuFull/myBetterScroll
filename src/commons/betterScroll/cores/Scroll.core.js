/* eslint-disable max-lines */
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

        _that._stop();

        _that.startTime = _opts.getNow();

        _that.startX = _that.x;
        _that.startY = _that.y;
        _that.absStartX = _that.x;
        _that.absStartY = _that.y;

        let point = evt.touches ? evt.touches[0] : evt;
        _that.pointX = point.pageX;
        _that.pointY = point.pageY;
        console.log('start-->', point);

        // _that.directionX = 0;
        // _that.directionY = 0;
        _that.directionLocked = 0;
        _that.distX = 0;
        _that.distY = 0;
        _that.moved = false;

        _that.$emit(EVENT_TYPE.beforeScrollStart, {
            x: _that.x,
            y: _that.y
        });
    }

    /**
     * mousemove/touchmove 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _move (evt) {
        const _that = this;
        const _opts = _that.defaultOptions;

        if (!_opts.enabled || eventType[evt.type] !== _that.initiated) {
            return;
        }

        if (_opts.preventDefault) {
            evt.preventDefault();
        }
        if (_opts.stopPropagation) {
            evt.stopPropagation();
        }

        let point = evt.touches ? evt.touches[0] : evt;
        let deltaX = point.pageX - _that.pointX;
        let deltaY = point.pageY - _that.pointY;
        _that.pointX = point.pageX;
        _that.pointY = point.pageY;
        _that.distX += deltaX;
        _that.distY += deltaY;
        let _absDistX = Math.abs(_that.distX);
        let _absDistY = Math.abs(_that.distY);
        let timestamp = _opts.getNow();
        console.log('move--->', point);

        if (!_that.directionLocked && !_opts.freeScroll &&
            (!_that.hasHScroll || !_that.hasVScroll)) {
            if (_absDistX - _absDistY > _opts.directionLockThreshold) {
                _that.directionLocked = 'h';
            } else if (_absDistY - _absDistX > _opts.directionLockThreshold) {
                _that.directionLocked = 'v';
            } else {
                _that.directionLocked = 'n';
            }
        }

        if (_that.direcionLocked === 'h') {
            if (_opts.eventPassthrough === 'horizontal') {
                _that.initiated = false;
                return;
            } else if (_opts.eventPassthrough === 'vertical') {
                evt.preventDefault();
            }
            deltaY = 0;
        } else if (_that.directionLocked === 'v') {
            if (_opts.eventPassthrough === 'horizontal') {
                evt.preventDefault();
            } else if (_opts.eventPassthrough === 'vertical') {
                _that.initiated = false;
                return;
            }
            deltaX = 0;
        }

        deltaX = _that.hasHScroll ? deltaX : 0;
        deltaY = _that.hasVScroll ? deltaY: 0;

        let _newX = _that.x + deltaX;
        let _newY = _that.y + deltaY;

        let _bounce = _opts.bounce;
        let _left = false;
        let _right = false;
        let _top = false;
        let _bottom = false;
        if (_bounce) {
            _left = typeof _bounce.left === 'undefined' ? true : _bounce.left;
            _right = typeof _bounce.right === 'undefined' ? true : _bounce.right;
            _top = typeof _bounce.top === 'undefined' ? true : _bounce.top;
            _bottom = typeof _bounce.bottom === 'undefined' ? true : _bounce.bottom;
        }
        if (_newX < _that.maxScrollX || _newX > _that.minScrollX) {
            if ((_newX < _that.maxScrollX && _right) || (_newX > _that.minScrollX && _left)) {
                _newX = _that.x + deltaX / 3;
            } else {
                _newX = _newX < _that.maxScrollX ? _that.maxScrollX : _that.minScrollX;
            }
        }

        if (_newY < _that.maxScrollY || _newY > _that.minScrollY) {
            if ((_newY < _that.maxScrollY && _bottom) || (_newY > _that.minScrollY && _top)) {
                _newY = _that.y + deltaY / 3;
            } else {
                _newY = _newY < _that.maxScrollY ? _that.maxScrollY : _that.minScrollY;
            }
        }

        if (!_that.moved) {
            _that.moved = true;
            _that.$emit(EVENT_TYPE.scrollStart, {
                x: _that.x,
                y: _that.y
            });
        }

        _that._scrollTo(_newX, _newY);

        if (timestamp - _that.startTime > _opts.momentumLimitTime) {
            _that.timestamp = _opts.getNow();
            _that.startX = _that.x;
            _that.startY = _that.y;

            if (_opts.probeType === probeType.PROBE_DEBOUNCE) {
                _that.$emit(EVENT_TYPE.scroll, {
                    x: _that.x,
                    y: _that.y
                });
            }
        }
    }

    /**
     * mouseup/touchend 回调方法
     *
     * @param {Event} evt 事件对象
     * @memberof ScrollCore
     */
    _end (evt) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (!_opts.enabled || eventType[evt.type] !== _that.initiated) {
            return;
        }
        _that.initiated = false;

        _that.$emit(EVENT_TYPE.touchEnd, {
            x: _that.x,
            y: _that.y
        });

        if (_opts.preventDefault && !_opts.isPreventDefaultErr(evt.target, _opts.preventDefaultException)) {
            evt.preventDefault();
        }
        if (_opts.stopPropagation) {
            evt.stopPropagation();
        }

        let _newX = Math.round(_that.x);
        let _newY = Math.round(_that.y);
        const _deltaX = _newX - _that.absStartX;
        const _deltaY = _newY - _that.absStartY;
        const _directionX = _deltaX > 0 ? DIRECTION.left : (_deltaX < 0 ? DIRECTION.right : 0);
        const _directionY = _deltaY > 0 ? DIRECTION.up : (_deltaY < 0 ? DIRECTION.down : 0);

        if (_that._resetPosition(_opts.bounceTime, _opts.ease.bounce)) {
            return;
        }

        _that.endTime = _opts.getNow();
        let _absDistX = Math.abs(_newX - _that.startX);
        let _absDistY = Math.abs(_newY - _that.startY);
        let _duration = _that.endTime - _that.startTime;
        let _time = 0;
        if (_opts.momentum &&
            (_duration < _opts.momentumLimitTime) && (_absDistX > _opts.momentumLimitDistance || _absDistY > _opts.momentumLimitDistance)) {
            let _left = false;
            let _right = false;
            let _top = false;
            let _bottom = false;
            if (_bounce) {
                _left = typeof _bounce.left === 'undefined' ? true : _bounce.left;
                _right = typeof _bounce.right === 'undefined' ? true : _bounce.right;
                _top = typeof _bounce.top === 'undefined' ? true : _bounce.top;
                _bottom = typeof _bounce.bottom === 'undefined' ? true : _bounce.bottom;
            }
            const _wrapWidth = ((_directionX === DIRECTION.left && _right) ||
                (_directionX === DIRECTION.right && _left)) ? _that.wrapW : 0;
            const _wrapHeight = ((_directionY === DIRECTION.top && _bottom) ||
                (_directionY === DIRECTION.bottom && _top)) ? _that.wrapH : 0;
            const _momentumX = _that.hasHScroll ? _opts.getMomentum(_that.x, _that.startX,
                _that.endTime - _that.startTime, _that.maxScrollX, _that.minScrollX, _wrapWidth, _opts)
                : {destination: _newX, duration: 0};
            const _momentumY = _that.hasVScroll ? _opts.getMomentum(_that.y, _that.startY,
                _that.endTime - _that.startTime, _that.maxScrollY, _that.minScrollY, _wrapHeight, _opts)
                : {destination: _newY, duration: 0};
            _time = Math.max(_momentumX.duration, _momentumY.duration);
            _newX = _momentumX.destination;
            _newY = _momentumY.destination;
        }

        let _easing = _opts.ease.swipe;
        if (_newX < _that.maxScrollX || _newX > _that.minScrollX || _newY < _that.maxScrollY || _newY > _that.minScrollY) {
            _easing = _opts.ease.swipeBounce;
        }
        _that._scrollTo(_newX, _newY, _time, _easing);
    }

    /**
     * 使用requestAnimationFrame开启动画
     * @param {Number} destX 水平目标位置
     * @param {Number} destY 垂直目标位置
     * @param {Number} duration 动画时长（ms）
     * @param {String} easing 动画规则曲线方法
     */
    _animate (destX, destY, duration, easing) {
        const _that = this;
        const _opts = _that.defaultOptions;
        const _startX = _that.x;
        const _startY = _that.y;
        const startTime = _opts.getNow();
        const destTime = startTime + time;

        cancelAnimationFrame(_that.animateTimer);
        _that.animateTimer = requestAnimationFrame(_magic);
        _that.isAnimating = true;

        /**
         * 动画步骤执行方法
         */
        function _magic () {
            let _now = _opts.getNow();
            if (_now >= destTime) {
                _that._translate(destX, destY);
                _that.isAnimating = false;
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

            // 如果probeType为时时记录滚动条状态
            if (_opts.probeType === probeType.PROBE_REALTIME) {
                _that.$emit(EVENT_TYPE.scroll, {
                    x: _that.x,
                    y: _that.y
                });
            }

            _that.animateTimer = requestAnimationFrame(_magic);
        }
    }

    /**
     * 滚动到指定的位置
     * @param {Number} x 水平目标位置
     * @param {Number} y 垂直目标位置
     * @param {Number} time 动画时长（ms）
     * @param {String} easing 动画规则曲线方法
     */
    _scrollTo (x, y, time, easing) {
        const _that = this;
        if (x === _that.x && y === _that.y) {
            _that.$emit(EVENT_TYPE.scrollEnd, {
                x: _that.x,
                y: _that.y
            });
            return;
        }

        const _opts = _that.defaultOptions;
        const _scroller = _that.scroller;
        _that.isInTransition = _opts.useTransition && time;
        if (!time || _that.useTransition) { // 使用transition动画效果
            _scroller[style.transitionDuration] = time;
            _scroller[style.transitionTimingFunction] = easing && easing.style;
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
                    if (!_resetPosition(time, ease)) {
                        _that.$emit(EVENT_TYPE.scrollEnd, {
                            x: _that.x,
                            y: _that.y
                        });
                    }
                }
            }
        } else { // 使用requestAnimationFrame做动画效果
            _that._animate(x, y, time, easing.fn);
        }

        /**
         * 记录动画过程中派发滚动事件
         */
        function _startProbe () {
            cancelAnimationFrame(_that.probeTimer);
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
        let matrix = getStyle(_that.scroller);
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
     * @returns {Boolean} 更新滚动条成功／失败
     * @memberof ScrollCore
     */
    _resetPosition (time, easing) {
        const _that = this;
        let _x = _that.x;
        let _y = _that.y;

        if (!_that.hasVScroll || !_that.hasHScroll) {
            return false;
        }

        if (_x > _that.minScrollX) {
            _x = _that.minScrollX;
        } else if (_x < _that.maxScrollX) {
            _x = _that.maxScrollX;
        }
        if (_y > _that.minScrollY) {
            _y = _that.minScrollY;
        } else if (_y < _that.maxScrollY) {
            _y = _that.maxScrollY;
        }

        if (_x === _that.x && _y === _that.y) {
            return false;
        }

        _that._scrollTo(_x, _y, time, easing);
        return true;
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
            _that.scrollerStyle[style.transform] = `translate(${x}px, ${y}px)`;
        } else {
            _that.scrollerStyle.left = `${x}px`;
            _that.scrollerStyle.top = `${y}px`;
        }
    }

    /**
     * 动画结束的回调方法
     * @param {Event} evt 事件对象
     * @private
     */
    _transitionEnd (evt) {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (_that.scroller && _that.isInTransition) {
            _that._transitionTime(0);
            if (!_that._resetPosition(_opts.bounceTime, _opts.ease.bounce)) {
                _that.isInTransition = false;
                _that.$emit(EVENT_TYPE.scrollEnd, {
                    x: _that.x,
                    y: _that.y
                });
            }
        }
    }

    /**
     * 设置动画时间
     * @param {Number} time 动画时间
     */
    _transitionTime (time = 0) {
        const _that = this;
        _that.scrollerStyle[style.transitionDuration] = time;
    }

    /**
     * 停止动画
     * @private
     * @memberof ScrollBase
     */
    _stop () {
        const _that = this;
        const _opts = _that.defaultOptions;
        if (_opts.useTransition) {
            if (_that.isInTransition) {
                _that.isInTransition = false;
                cancelAnimationFrame(_that.probeTimer);
                const _curPos = _that._getComputedPostion();
                if (_curPos) {
                    _that._scrollTo(_curPos.x, _curPos.y);
                }
            }
        } else {
            if (_that.isAnimating) {
                _that.isAnimating = false;
                cancelAnimationFrame(_that.animateTimer);
                _that._scrollTo(_that.x, _that.y);
            }
        }
    }
}
