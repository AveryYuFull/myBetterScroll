/**
 * 是否在浏览器环境下
 * @returns {Boolean} 是否在浏览器环境下
 */
export default function isBrowser () {
    return typeof window !== 'undefined';
}
