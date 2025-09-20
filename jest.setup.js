require('@testing-library/jest-dom');
// Polyfill fetch for Jest (Node.js)
if (typeof global.fetch === 'undefined') {
	global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
