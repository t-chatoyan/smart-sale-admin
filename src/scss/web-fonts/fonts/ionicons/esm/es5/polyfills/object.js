export function applyPolyfill (window, document) {
/*!
Object.assign
*/
  typeof Object.assign !== 'function' && Object.defineProperty(Object, 'assign', { value: function (d, f) { if (d == null) throw new TypeError('Cannot convert undefined or null to object'); for (var e = Object(d), b = 1; b < arguments.length; b++) { var a = arguments[b]; if (a != null) for (var c in a)Object.prototype.hasOwnProperty.call(a, c) && (e[c] = a[c]) } return e }, writable: !0, configurable: !0 })
  /*!
Object.entries
*/
  Object.entries || (Object.entries = function (c) { for (var b = Object.keys(c), a = b.length, d = Array(a); a--;)d[a] = [b[a], c[b[a]]]; return d })
}
