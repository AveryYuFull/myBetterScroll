import getEventType from './utils/getEventType';
import initEventListener from './utils/initEventListener';
import getTime from './utils/getTime';

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
  preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/},

  useWrapper: false, // 是否使用包裹元素来监听事件
  disableMouse: false, // 是否监听鼠标相关事件
  disableTouch: false, // 是否监听 touch 相关事件

  initEventListener: initEventListener, // 注册/解除事件监听器
  getEventType: getEventType, // 获取事件类型
  getTime: getTime // 获取当前时间戳
}

export const TOUCH_EVENT = 'touch_event';
export const MOUSE_EVENT = 'mouse_event';
export const DIRECTION = { // 滚动方向
  H: 'horizontal',
  V: 'vertical'
}