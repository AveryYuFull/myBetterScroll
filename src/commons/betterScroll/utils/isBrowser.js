/**
 * 是否是浏览器环境
 *
 * @export
 * @returns
 */
export default function isBrowser () {
    return typeof window !== 'undefined';
}
