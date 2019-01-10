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
    bindToWrapper: false // 是否使用wrapper监听事件
    // listenerEvents: null // 监听的事件
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
