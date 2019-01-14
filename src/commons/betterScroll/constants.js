import prefixStyle from './utils/prefixStyle';

/**
 * 默认配置选项
 * @export
 */
export const DEFAULT_CONFIG = {
    HWCompositing: true, // 是否开启动画硬件加速（让GPU工作，这样效率更高）
    useTransform: true, // 是否使用transform移动位置
    useTransition: true, // 是否使用transition动画
    scrollX: false, // 是否开启横向滚动条
    scrollY: true, // 是否开启纵向滚动条
    freeScroll: false, // 是否开启横向和纵向滚动条
    directionLockThreshold: 5, // 通过横向滑动距离和纵向滑动距离的绝对值来决定是横向滚动／纵向滚动
    bindToWrapper: false, // 是否使用wrapper监听事件
    listenerEvents: ['orientationchange', 'resize'], // 监听的事件
    muObserverOptions: { // MutationObserver配置可选参数
        attributes: true,
        childList: true,
        subtree: true
    },
    checkDomUpdateTimer: 60, // 检查dom更新定时器
    observeDOM: true, // 检查dom是否更新
    autoBlur: true, // 是否当元素一开始滚动的时候，就将当前页面中input和textarea元素设置为blur
    preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}, // 如果满足当前条件，就不会阻止事件默认行为，否则就会阻止事件的默认行为
    preventDefault: true,
    stopPropagation: true,
    momentumLimitTime: 300, // 只有在屏幕上快速滑动的时间小于momenumLimitTime, 才会开启momentum动画
    momentumLimitDistance: 15, // 只有在屏幕上快速滑动的距离大于momentumLimitDistance, 才会开启momentum动画
    eventPassthrough: null,
    bounce: true, // 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画
    bounceTime: 700, // 设置回弹动画时长(ms)
    probeType: 0 // 当probetype为1时，会非实时的（屏幕滑动一段距离后）派发scroll事件，当probeType为2是，会实时派发scroll事件，当probeType为3时，会实时和在momentum动画过程中派发scroll事件
};

/**
 * 样式style
 * @export
 */
export const style = {
    transform: prefixStyle('transform'),
    transition: prefixStyle('transition'),
    transitionDuration: prefixStyle('transitionDuration'),
    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
    transitionEnd: prefixStyle('transitionEnd')
};

/**
 * 事件类型
 * @exports
 */
export const EVENT_TYPE = {
    REFRESH: 'refresh', // 刷新事件类型
    BEFORE_SCROLL_START: 'beforeScrollStart', // 在元素滚动之前
    SCROLL_START: 'scrollStart', // 元素刚开始滚动
    SCROLL: 'scroll' // scroll事件
};

/**
 * 事件类型名字
 */
export const EVENT_TYPE_VALUE = {
    MOUSE_EVENT: 'mouse_event', // 鼠标事件
    TOUCH_EVENT: 'touch_event' // 触摸事件
};

/**
 * 鼠标事件的button属性的值
 */
export const BUTTON_TYPE = {
    LEFT_MOUSE: '0',
    MIDDLE_MOUSE: '1',
    RIGHT_MOUSE: '2'
};

/**
 * probeType类型
 */
export const PROBE_TYPE = {
    NORMAL: '1', // 非实时
    REAL_TIME: '2', // 实时
    REAL_MOMENTUM_TIME: '3' // 实时+momentum动画
}
