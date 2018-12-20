import getEventType from './utils/getEventType';
import initEventListener from './utils/initEventListener';
import getNow from './utils/getNow';
import getStyle from './utils/getStyle';
import getRect from './utils/getRect';
import prefixStyle from './utils/prefixStyle';
import { ease } from './utils/ease';
import getMomentum from './utils/getMomentum';
import isPreventDefaultErr from './utils/isPreventDefaultErr';

export const DEFAULT_CONFIG = {
    startX: 0, // 横轴方向初始化位置
    startY: 0, // 纵轴方向初始化位置
    enabled: true, // 是否开启better-scroll滚动
    scrollX: false, // 当设置为 true 的时候，可以开启横向滚动
    scrollY: true, // 当设置为 true 的时候，可以开启纵向滚动
    freeScroll: false, // 有些场景我们需要支持横向和纵向同时滚动，而不仅限制在某个方向，这个时候我们只要设置 freeScroll 为 true 即可
    directionLockThreshold: 5, // 当我们需要锁定只滚动一个方向的时候，我们在初始滚动的时候根据横轴和纵轴滚动的绝对值做差，当差值大于 directionLockThreshold 的时候来决定滚动锁定的方向。
    eventPassthrough: '', // 在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动
    click: false, // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
    bounce: true, // 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画
    bounceTime: 700, // 设置回弹动画的动画时长
    momentum: true, // 当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画。设置为 true 则开启动画。
    momentumLimitTime: 300, // 只有在屏幕上快速滑动的时间小于 momentumLimitTime，才能开启 momentum 动画
    momentumLimitDistance: 15, // 只有在屏幕上快速滑动的距离大于 momentumLimitDistance，才能开启 momentum 动画
    probeType: 0, // 触发事件的方式
    preventDefault: true, // 当事件派发后是否阻止浏览器默认行为
    preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/},
    stopPropagation: true, // 阻止事件冒泡
    deceleration: 0.001, // momentum 动画的减速度
    swipeTime: 2500, // momentum 动画的动画时长
    swipeBounceTime: 500, // momentum 动画时，超过边缘后的回弹整个动画时间

    bindToWrapper: false, // 是否使用包裹元素来监听事件
    disableMouse: false, // 是否监听鼠标相关事件
    disableTouch: false, // 是否监听 touch 相关事件
    useTransform: true, // 是否使用 CSS3 transform 做位移
    useTransition: false, // 是否使用 CSS3 transition 动画

    initEventListener: initEventListener, // 注册/解除事件监听器
    getEventType: getEventType, // 获取事件类型
    getNow: getNow, // 获取当前时间戳
    getStyle: getStyle, // 获取元素的样式（如果有prop，就获取指定的元素样式，如果没有prop，就获取全部的样式）
    getRect: getRect, // 获取dom元素的rect数据
    prefixStyle: prefixStyle, // 获取兼容的样式属性
    isPreventDefaultErr: isPreventDefaultErr, // 是否可以阻止元素的默认行为
    ease: ease, // 贝塞尔曲线
    getMomentum: getMomentum // 根据滑动的时间和距离算出动量
};

export const TOUCH_EVENT = 'touch_event';
export const MOUSE_EVENT = 'mouse_event';
export const eventType = {
    touchstart: TOUCH_EVENT,
    touchmove: TOUCH_EVENT,
    touchend: TOUCH_EVENT,

    mousedown: MOUSE_EVENT,
    mousemove: MOUSE_EVENT,
    mouseup: MOUSE_EVENT
};

export const DIRECTION = { // 滚动方向
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
};

/**
 * 事件类型
 * @exports
 */
export const EVENT_TYPE = {
    refresh: 'refresh', // 刷新事件
    beforeScrollStart: 'beforeScrollStart', // 滚动开始前
    scroll: 'scroll', // 滚动事件
    scrollEnd: 'scrollEnd', // 滚动结束事件
    scrollStart: 'scrollStart', // 滚动开始
    touchEnd: 'touchEnd' // 触摸结束
};

/**
 * 动画兼容样式
 */
export const style = {
    transform: prefixStyle('transform'),
    transformOrigin: prefixStyle('transformOrigin'),

    transition: prefixStyle('transition'),
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionDelay: prefixStyle('transitionDelay'),
    transitionEnd: prefixStyle('transitionEnd')
};

/**
 * 派发scroll事件的选项
 */
export const probeType = {
    PROBE_DEBOUNCE: 1, // 非实时的派发scroll事件
    PROBE_NORMAL: 2, // 实时派发scroll事件
    PROBE_REALTIME: 3 // 不仅在实时派发scroll事件，同时在momentTime时也派发scroll事件
};
