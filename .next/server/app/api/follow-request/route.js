"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/follow-request/route";
exports.ids = ["app/api/follow-request/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ffollow-request%2Froute&page=%2Fapi%2Ffollow-request%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffollow-request%2Froute.ts&appDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ffollow-request%2Froute&page=%2Fapi%2Ffollow-request%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffollow-request%2Froute.ts&appDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_MauroDiCarlo_Perso_SocialBook_src_app_api_follow_request_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/follow-request/route.ts */ \"(rsc)/./src/app/api/follow-request/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/follow-request/route\",\n        pathname: \"/api/follow-request\",\n        filename: \"route\",\n        bundlePath: \"app/api/follow-request/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\MauroDiCarlo\\\\Perso\\\\SocialBook\\\\src\\\\app\\\\api\\\\follow-request\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_MauroDiCarlo_Perso_SocialBook_src_app_api_follow_request_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/follow-request/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZmb2xsb3ctcmVxdWVzdCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZm9sbG93LXJlcXVlc3QlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZmb2xsb3ctcmVxdWVzdCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNNYXVyb0RpQ2FybG8lNUNQZXJzbyU1Q1NvY2lhbEJvb2slNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q01hdXJvRGlDYXJsbyU1Q1BlcnNvJTVDU29jaWFsQm9vayZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDbUM7QUFDaEg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb2NpYWxib29rLz8wNjk3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXE1hdXJvRGlDYXJsb1xcXFxQZXJzb1xcXFxTb2NpYWxCb29rXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGZvbGxvdy1yZXF1ZXN0XFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9mb2xsb3ctcmVxdWVzdC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2ZvbGxvdy1yZXF1ZXN0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9mb2xsb3ctcmVxdWVzdC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXE1hdXJvRGlDYXJsb1xcXFxQZXJzb1xcXFxTb2NpYWxCb29rXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGZvbGxvdy1yZXF1ZXN0XFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9mb2xsb3ctcmVxdWVzdC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ffollow-request%2Froute&page=%2Fapi%2Ffollow-request%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffollow-request%2Froute.ts&appDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/follow-request/route.ts":
/*!*********************************************!*\
  !*** ./src/app/api/follow-request/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\n\nasync function POST(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session?.user) return Response.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    const { targetUserId } = await req.json();\n    const requesterId = session.user.id;\n    if (targetUserId === requesterId) return Response.json({\n        error: \"Non puoi seguirti\"\n    }, {\n        status: 400\n    });\n    // Se già esiste follow approvato, errore\n    const alreadyFollowing = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.follow.findUnique({\n        where: {\n            followerId_followingId: {\n                followerId: requesterId,\n                followingId: targetUserId\n            }\n        }\n    });\n    if (alreadyFollowing) return Response.json({\n        error: \"Sei gi\\xe0 un follower\"\n    }, {\n        status: 400\n    });\n    // Se già esiste richiesta pending, errore\n    const existingRequest = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.followRequest.findUnique({\n        where: {\n            requesterId_targetId: {\n                requesterId,\n                targetId: targetUserId\n            }\n        }\n    });\n    if (existingRequest && existingRequest.status === \"pending\") return Response.json({\n        error: \"Richiesta gi\\xe0 inviata\"\n    }, {\n        status: 400\n    });\n    // Crea richiesta\n    const reqFollow = await _lib_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma.followRequest.upsert({\n        where: {\n            requesterId_targetId: {\n                requesterId,\n                targetId: targetUserId\n            }\n        },\n        update: {\n            status: \"pending\"\n        },\n        create: {\n            requesterId,\n            targetId: targetUserId,\n            status: \"pending\"\n        }\n    });\n    return Response.json({\n        success: true,\n        request: reqFollow\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9mb2xsb3ctcmVxdWVzdC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFzQztBQUNPO0FBQ0o7QUFFbEMsZUFBZUcsS0FBS0MsR0FBWTtJQUNyQyxNQUFNQyxVQUFVLE1BQU1KLDJEQUFnQkEsQ0FBQ0Msa0RBQVdBO0lBQ2xELElBQUksQ0FBQ0csU0FBU0MsTUFBTSxPQUFPQyxTQUFTQyxJQUFJLENBQUM7UUFBRUMsT0FBTztJQUFlLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBQ2xGLE1BQU0sRUFBRUMsWUFBWSxFQUFFLEdBQUcsTUFBTVAsSUFBSUksSUFBSTtJQUN2QyxNQUFNSSxjQUFjLFFBQVNOLElBQUksQ0FBU08sRUFBRTtJQUM1QyxJQUFJRixpQkFBaUJDLGFBQWEsT0FBT0wsU0FBU0MsSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBb0IsR0FBRztRQUFFQyxRQUFRO0lBQUk7SUFDckcseUNBQXlDO0lBQ3pDLE1BQU1JLG1CQUFtQixNQUFNZCwrQ0FBTUEsQ0FBQ2UsTUFBTSxDQUFDQyxVQUFVLENBQUM7UUFDdERDLE9BQU87WUFBRUMsd0JBQXdCO2dCQUFFQyxZQUFZUDtnQkFBYVEsYUFBYVQ7WUFBYTtRQUFFO0lBQzFGO0lBQ0EsSUFBSUcsa0JBQWtCLE9BQU9QLFNBQVNDLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQXNCLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBQzNGLDBDQUEwQztJQUMxQyxNQUFNVyxrQkFBa0IsTUFBTXJCLCtDQUFNQSxDQUFDc0IsYUFBYSxDQUFDTixVQUFVLENBQUM7UUFDNURDLE9BQU87WUFBRU0sc0JBQXNCO2dCQUFFWDtnQkFBYVksVUFBVWI7WUFBYTtRQUFFO0lBQ3pFO0lBQ0EsSUFBSVUsbUJBQW1CQSxnQkFBZ0JYLE1BQU0sS0FBSyxXQUFXLE9BQU9ILFNBQVNDLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQXdCLEdBQUc7UUFBRUMsUUFBUTtJQUFJO0lBQ3BJLGlCQUFpQjtJQUNqQixNQUFNZSxZQUFZLE1BQU16QiwrQ0FBTUEsQ0FBQ3NCLGFBQWEsQ0FBQ0ksTUFBTSxDQUFDO1FBQ2xEVCxPQUFPO1lBQUVNLHNCQUFzQjtnQkFBRVg7Z0JBQWFZLFVBQVViO1lBQWE7UUFBRTtRQUN2RWdCLFFBQVE7WUFBRWpCLFFBQVE7UUFBVTtRQUM1QmtCLFFBQVE7WUFBRWhCO1lBQWFZLFVBQVViO1lBQWNELFFBQVE7UUFBVTtJQUNuRTtJQUNBLE9BQU9ILFNBQVNDLElBQUksQ0FBQztRQUFFcUIsU0FBUztRQUFNQyxTQUFTTDtJQUFVO0FBQzNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc29jaWFsYm9vay8uL3NyYy9hcHAvYXBpL2ZvbGxvdy1yZXF1ZXN0L3JvdXRlLnRzP2ExNGIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJztcclxuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XHJcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aCc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcclxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XHJcbiAgaWYgKCFzZXNzaW9uPy51c2VyKSByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xyXG4gIGNvbnN0IHsgdGFyZ2V0VXNlcklkIH0gPSBhd2FpdCByZXEuanNvbigpO1xyXG4gIGNvbnN0IHJlcXVlc3RlcklkID0gKHNlc3Npb24udXNlciBhcyBhbnkpLmlkO1xyXG4gIGlmICh0YXJnZXRVc2VySWQgPT09IHJlcXVlc3RlcklkKSByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yOiAnTm9uIHB1b2kgc2VndWlydGknIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgLy8gU2UgZ2nDoCBlc2lzdGUgZm9sbG93IGFwcHJvdmF0bywgZXJyb3JlXHJcbiAgY29uc3QgYWxyZWFkeUZvbGxvd2luZyA9IGF3YWl0IHByaXNtYS5mb2xsb3cuZmluZFVuaXF1ZSh7XHJcbiAgICB3aGVyZTogeyBmb2xsb3dlcklkX2ZvbGxvd2luZ0lkOiB7IGZvbGxvd2VySWQ6IHJlcXVlc3RlcklkLCBmb2xsb3dpbmdJZDogdGFyZ2V0VXNlcklkIH0gfVxyXG4gIH0pO1xyXG4gIGlmIChhbHJlYWR5Rm9sbG93aW5nKSByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yOiAnU2VpIGdpw6AgdW4gZm9sbG93ZXInIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgLy8gU2UgZ2nDoCBlc2lzdGUgcmljaGllc3RhIHBlbmRpbmcsIGVycm9yZVxyXG4gIGNvbnN0IGV4aXN0aW5nUmVxdWVzdCA9IGF3YWl0IHByaXNtYS5mb2xsb3dSZXF1ZXN0LmZpbmRVbmlxdWUoe1xyXG4gICAgd2hlcmU6IHsgcmVxdWVzdGVySWRfdGFyZ2V0SWQ6IHsgcmVxdWVzdGVySWQsIHRhcmdldElkOiB0YXJnZXRVc2VySWQgfSB9XHJcbiAgfSk7XHJcbiAgaWYgKGV4aXN0aW5nUmVxdWVzdCAmJiBleGlzdGluZ1JlcXVlc3Quc3RhdHVzID09PSAncGVuZGluZycpIHJldHVybiBSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdSaWNoaWVzdGEgZ2nDoCBpbnZpYXRhJyB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIC8vIENyZWEgcmljaGllc3RhXHJcbiAgY29uc3QgcmVxRm9sbG93ID0gYXdhaXQgcHJpc21hLmZvbGxvd1JlcXVlc3QudXBzZXJ0KHtcclxuICAgIHdoZXJlOiB7IHJlcXVlc3RlcklkX3RhcmdldElkOiB7IHJlcXVlc3RlcklkLCB0YXJnZXRJZDogdGFyZ2V0VXNlcklkIH0gfSxcclxuICAgIHVwZGF0ZTogeyBzdGF0dXM6ICdwZW5kaW5nJyB9LFxyXG4gICAgY3JlYXRlOiB7IHJlcXVlc3RlcklkLCB0YXJnZXRJZDogdGFyZ2V0VXNlcklkLCBzdGF0dXM6ICdwZW5kaW5nJyB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBzdWNjZXNzOiB0cnVlLCByZXF1ZXN0OiByZXFGb2xsb3cgfSk7XHJcbn1cclxuIl0sIm5hbWVzIjpbInByaXNtYSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsIlBPU1QiLCJyZXEiLCJzZXNzaW9uIiwidXNlciIsIlJlc3BvbnNlIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwidGFyZ2V0VXNlcklkIiwicmVxdWVzdGVySWQiLCJpZCIsImFscmVhZHlGb2xsb3dpbmciLCJmb2xsb3ciLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJmb2xsb3dlcklkX2ZvbGxvd2luZ0lkIiwiZm9sbG93ZXJJZCIsImZvbGxvd2luZ0lkIiwiZXhpc3RpbmdSZXF1ZXN0IiwiZm9sbG93UmVxdWVzdCIsInJlcXVlc3RlcklkX3RhcmdldElkIiwidGFyZ2V0SWQiLCJyZXFGb2xsb3ciLCJ1cHNlcnQiLCJ1cGRhdGUiLCJjcmVhdGUiLCJzdWNjZXNzIiwicmVxdWVzdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/follow-request/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   getSession: () => (/* binding */ getSession)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _validations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./validations */ \"(rsc)/./src/lib/validations.ts\");\n\n\n\n\n\nconst authOptions = {\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                const parsed = _validations__WEBPACK_IMPORTED_MODULE_4__.loginSchema.safeParse(credentials);\n                if (!parsed.success) return null;\n                const { email, password } = parsed.data;\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        email\n                    }\n                });\n                if (!user?.passwordHash) return null;\n                const ok = await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_3__.compare)(password, user.passwordHash);\n                if (!ok) return null;\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    image: user.image,\n                    username: user.username\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.username = user.username;\n                token.language = user.language;\n            } else if (token.id) {\n                // Aggiorna sempre username e language dal db se già loggato\n                const dbUser = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                    where: {\n                        id: token.id\n                    }\n                });\n                if (dbUser) {\n                    token.username = dbUser.username;\n                    token.language = dbUser.language;\n                }\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.id = token.id;\n                session.user.username = token.username;\n                session.user.language = token.language;\n            }\n            return session;\n        }\n    }\n};\nconst getSession = ()=>(0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(authOptions);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQTZEO0FBQ0o7QUFDeEI7QUFDQztBQUNTO0FBRXBDLE1BQU1LLGNBQStCO0lBQzFDQyxTQUFTO1FBQUVDLFVBQVU7SUFBTTtJQUMzQkMsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0lBQ25DQyxXQUFXO1FBQ1RYLDJFQUFXQSxDQUFDO1lBQ1ZZLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBUTtnQkFDdkNDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixNQUFNTSxTQUFTaEIscURBQVdBLENBQUNpQixTQUFTLENBQUNQO2dCQUNyQyxJQUFJLENBQUNNLE9BQU9FLE9BQU8sRUFBRSxPQUFPO2dCQUM1QixNQUFNLEVBQUVQLEtBQUssRUFBRUcsUUFBUSxFQUFFLEdBQUdFLE9BQU9HLElBQUk7Z0JBQ3ZDLE1BQU1DLE9BQU8sTUFBTXRCLDJDQUFNQSxDQUFDc0IsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQUVDLE9BQU87d0JBQUVYO29CQUFNO2dCQUFFO2dCQUM3RCxJQUFJLENBQUNTLE1BQU1HLGNBQWMsT0FBTztnQkFDaEMsTUFBTUMsS0FBSyxNQUFNekIsaURBQU9BLENBQUNlLFVBQVVNLEtBQUtHLFlBQVk7Z0JBQ3BELElBQUksQ0FBQ0MsSUFBSSxPQUFPO2dCQUNoQixPQUFPO29CQUFFQyxJQUFJTCxLQUFLSyxFQUFFO29CQUFFaEIsTUFBTVcsS0FBS1gsSUFBSTtvQkFBRUUsT0FBT1MsS0FBS1QsS0FBSztvQkFBRWUsT0FBT04sS0FBS00sS0FBSztvQkFBRUMsVUFBVVAsS0FBS08sUUFBUTtnQkFBQztZQUN2RztRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFVixJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUlUsTUFBTUwsRUFBRSxHQUFHLEtBQWNBLEVBQUU7Z0JBQzNCSyxNQUFNSCxRQUFRLEdBQUcsS0FBY0EsUUFBUTtnQkFDdkNHLE1BQU1DLFFBQVEsR0FBRyxLQUFjQSxRQUFRO1lBQ3pDLE9BQU8sSUFBSUQsTUFBTUwsRUFBRSxFQUFFO2dCQUNuQiw0REFBNEQ7Z0JBQzVELE1BQU1PLFNBQVMsTUFBTWxDLDJDQUFNQSxDQUFDc0IsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQUVDLE9BQU87d0JBQUVHLElBQUlLLE1BQU1MLEVBQUU7b0JBQVc7Z0JBQUU7Z0JBQ2hGLElBQUlPLFFBQVE7b0JBQ1ZGLE1BQU1ILFFBQVEsR0FBR0ssT0FBT0wsUUFBUTtvQkFDaENHLE1BQU1DLFFBQVEsR0FBR0MsT0FBT0QsUUFBUTtnQkFDbEM7WUFDRjtZQUNBLE9BQU9EO1FBQ1Q7UUFDQSxNQUFNNUIsU0FBUSxFQUFFQSxPQUFPLEVBQUU0QixLQUFLLEVBQUU7WUFDOUIsSUFBSTVCLFFBQVFrQixJQUFJLEVBQUU7Z0JBQ2RsQixRQUFRa0IsSUFBSSxDQUFTSyxFQUFFLEdBQUdLLE1BQU1MLEVBQUU7Z0JBQ2xDdkIsUUFBUWtCLElBQUksQ0FBU08sUUFBUSxHQUFHRyxNQUFNSCxRQUFRO2dCQUM5Q3pCLFFBQVFrQixJQUFJLENBQVNXLFFBQVEsR0FBR0QsTUFBTUMsUUFBUTtZQUNsRDtZQUNBLE9BQU83QjtRQUNUO0lBQ0Y7QUFDRixFQUFDO0FBRU0sTUFBTStCLGFBQWEsSUFBTXJDLDJEQUFnQkEsQ0FBQ0ssYUFBWSIsInNvdXJjZXMiOlsid2VicGFjazovL3NvY2lhbGJvb2svLi9zcmMvbGliL2F1dGgudHM/NjY5MiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMsIGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnXHJcbmltcG9ydCBDcmVkZW50aWFscyBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJ1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICcuL3ByaXNtYSdcclxuaW1wb3J0IHsgY29tcGFyZSB9IGZyb20gJ2JjcnlwdGpzJ1xyXG5pbXBvcnQgeyBsb2dpblNjaGVtYSB9IGZyb20gJy4vdmFsaWRhdGlvbnMnXHJcblxyXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcclxuICBzZXNzaW9uOiB7IHN0cmF0ZWd5OiAnand0JyB9LFxyXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ3JlZGVudGlhbHMoe1xyXG4gICAgICBuYW1lOiAnQ3JlZGVudGlhbHMnLFxyXG4gICAgICBjcmVkZW50aWFsczoge1xyXG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiAnRW1haWwnLCB0eXBlOiAnZW1haWwnIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICdQYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcgfVxyXG4gICAgICB9LFxyXG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICBjb25zdCBwYXJzZWQgPSBsb2dpblNjaGVtYS5zYWZlUGFyc2UoY3JlZGVudGlhbHMpXHJcbiAgICAgICAgaWYgKCFwYXJzZWQuc3VjY2VzcykgcmV0dXJuIG51bGxcclxuICAgICAgICBjb25zdCB7IGVtYWlsLCBwYXNzd29yZCB9ID0gcGFyc2VkLmRhdGFcclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsIH0gfSlcclxuICAgICAgICBpZiAoIXVzZXI/LnBhc3N3b3JkSGFzaCkgcmV0dXJuIG51bGxcclxuICAgICAgICBjb25zdCBvayA9IGF3YWl0IGNvbXBhcmUocGFzc3dvcmQsIHVzZXIucGFzc3dvcmRIYXNoKVxyXG4gICAgICAgIGlmICghb2spIHJldHVybiBudWxsXHJcbiAgICAgICAgcmV0dXJuIHsgaWQ6IHVzZXIuaWQsIG5hbWU6IHVzZXIubmFtZSwgZW1haWw6IHVzZXIuZW1haWwsIGltYWdlOiB1c2VyLmltYWdlLCB1c2VybmFtZTogdXNlci51c2VybmFtZSB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgXSxcclxuICBjYWxsYmFja3M6IHtcclxuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcclxuICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICB0b2tlbi5pZCA9ICh1c2VyIGFzIGFueSkuaWRcclxuICAgICAgICB0b2tlbi51c2VybmFtZSA9ICh1c2VyIGFzIGFueSkudXNlcm5hbWU7XHJcbiAgICAgICAgdG9rZW4ubGFuZ3VhZ2UgPSAodXNlciBhcyBhbnkpLmxhbmd1YWdlO1xyXG4gICAgICB9IGVsc2UgaWYgKHRva2VuLmlkKSB7XHJcbiAgICAgICAgLy8gQWdnaW9ybmEgc2VtcHJlIHVzZXJuYW1lIGUgbGFuZ3VhZ2UgZGFsIGRiIHNlIGdpw6AgbG9nZ2F0b1xyXG4gICAgICAgIGNvbnN0IGRiVXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogdG9rZW4uaWQgYXMgc3RyaW5nIH0gfSlcclxuICAgICAgICBpZiAoZGJVc2VyKSB7XHJcbiAgICAgICAgICB0b2tlbi51c2VybmFtZSA9IGRiVXNlci51c2VybmFtZTtcclxuICAgICAgICAgIHRva2VuLmxhbmd1YWdlID0gZGJVc2VyLmxhbmd1YWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcclxuICAgICAgaWYgKHNlc3Npb24udXNlcikge1xyXG4gICAgICAgIDsoc2Vzc2lvbi51c2VyIGFzIGFueSkuaWQgPSB0b2tlbi5pZDtcclxuICAgICAgICA7KHNlc3Npb24udXNlciBhcyBhbnkpLnVzZXJuYW1lID0gdG9rZW4udXNlcm5hbWU7XHJcbiAgICAgICAgOyhzZXNzaW9uLnVzZXIgYXMgYW55KS5sYW5ndWFnZSA9IHRva2VuLmxhbmd1YWdlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZXNzaW9uO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldFNlc3Npb24gPSAoKSA9PiBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKVxyXG4iXSwibmFtZXMiOlsiZ2V0U2VydmVyU2Vzc2lvbiIsIkNyZWRlbnRpYWxzIiwicHJpc21hIiwiY29tcGFyZSIsImxvZ2luU2NoZW1hIiwiYXV0aE9wdGlvbnMiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsInBhcnNlZCIsInNhZmVQYXJzZSIsInN1Y2Nlc3MiLCJkYXRhIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsInBhc3N3b3JkSGFzaCIsIm9rIiwiaWQiLCJpbWFnZSIsInVzZXJuYW1lIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJsYW5ndWFnZSIsImRiVXNlciIsImdldFNlc3Npb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"error\",\n        \"warn\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFFN0MsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUEsQ0FBQztJQUMvREksS0FBSztRQUFDO1FBQVM7S0FBTztBQUN4QixHQUFFO0FBRUYsSUFBSUMsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc29jaWFsYm9vay8uL3NyYy9saWIvcHJpc21hLnRzPzAxZDciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWwgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkIH1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoe1xyXG4gIGxvZzogWydlcnJvcicsICd3YXJuJ11cclxufSlcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hXHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWwiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/validations.ts":
/*!********************************!*\
  !*** ./src/lib/validations.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   commentSchema: () => (/* binding */ commentSchema),\n/* harmony export */   loginSchema: () => (/* binding */ loginSchema),\n/* harmony export */   postSchema: () => (/* binding */ postSchema),\n/* harmony export */   registerSchema: () => (/* binding */ registerSchema)\n/* harmony export */ });\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/v3/types.js\");\n\nconst registerSchema = zod__WEBPACK_IMPORTED_MODULE_0__.object({\n    name: zod__WEBPACK_IMPORTED_MODULE_0__.string().min(2),\n    username: zod__WEBPACK_IMPORTED_MODULE_0__.string().min(3).regex(/^[a-z0-9_]+$/i, \"Solo lettere/numeri/_\"),\n    email: zod__WEBPACK_IMPORTED_MODULE_0__.string().email(),\n    password: zod__WEBPACK_IMPORTED_MODULE_0__.string().min(6)\n});\nconst loginSchema = zod__WEBPACK_IMPORTED_MODULE_0__.object({\n    email: zod__WEBPACK_IMPORTED_MODULE_0__.string().email(),\n    password: zod__WEBPACK_IMPORTED_MODULE_0__.string().min(6)\n});\nconst postSchema = zod__WEBPACK_IMPORTED_MODULE_0__.object({\n    content: zod__WEBPACK_IMPORTED_MODULE_0__.string().min(1),\n    mediaUrl: zod__WEBPACK_IMPORTED_MODULE_0__.string().url().optional().or(zod__WEBPACK_IMPORTED_MODULE_0__.literal(\"\").transform(()=>undefined)),\n    mediaType: zod__WEBPACK_IMPORTED_MODULE_0__[\"enum\"]([\n        \"image\",\n        \"video\"\n    ]).optional()\n});\nconst commentSchema = zod__WEBPACK_IMPORTED_MODULE_0__.object({\n    postId: zod__WEBPACK_IMPORTED_MODULE_0__.string().cuid(),\n    content: zod__WEBPACK_IMPORTED_MODULE_0__.string().min(1)\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ZhbGlkYXRpb25zLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVCO0FBRWhCLE1BQU1DLGlCQUFpQkQsdUNBQVEsQ0FBQztJQUNyQ0csTUFBTUgsdUNBQVEsR0FBR0ssR0FBRyxDQUFDO0lBQ3JCQyxVQUFVTix1Q0FBUSxHQUFHSyxHQUFHLENBQUMsR0FBR0UsS0FBSyxDQUFDLGlCQUFpQjtJQUNuREMsT0FBT1IsdUNBQVEsR0FBR1EsS0FBSztJQUN2QkMsVUFBVVQsdUNBQVEsR0FBR0ssR0FBRyxDQUFDO0FBQzNCLEdBQUU7QUFFSyxNQUFNSyxjQUFjVix1Q0FBUSxDQUFDO0lBQ2xDUSxPQUFPUix1Q0FBUSxHQUFHUSxLQUFLO0lBQ3ZCQyxVQUFVVCx1Q0FBUSxHQUFHSyxHQUFHLENBQUM7QUFDM0IsR0FBRTtBQUVLLE1BQU1NLGFBQWFYLHVDQUFRLENBQUM7SUFDakNZLFNBQVNaLHVDQUFRLEdBQUdLLEdBQUcsQ0FBQztJQUN4QlEsVUFBVWIsdUNBQVEsR0FBR2MsR0FBRyxHQUFHQyxRQUFRLEdBQUdDLEVBQUUsQ0FBQ2hCLHdDQUFTLENBQUMsSUFBSWtCLFNBQVMsQ0FBQyxJQUFNQztJQUN2RUMsV0FBV3BCLHdDQUFNLENBQUM7UUFBQztRQUFTO0tBQVEsRUFBRWUsUUFBUTtBQUNoRCxHQUFFO0FBRUssTUFBTU8sZ0JBQWdCdEIsdUNBQVEsQ0FBQztJQUNwQ3VCLFFBQVF2Qix1Q0FBUSxHQUFHd0IsSUFBSTtJQUN2QlosU0FBU1osdUNBQVEsR0FBR0ssR0FBRyxDQUFDO0FBQzFCLEdBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb2NpYWxib29rLy4vc3JjL2xpYi92YWxpZGF0aW9ucy50cz80MzJkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHogfSBmcm9tICd6b2QnXHJcblxyXG5leHBvcnQgY29uc3QgcmVnaXN0ZXJTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgbmFtZTogei5zdHJpbmcoKS5taW4oMiksXHJcbiAgdXNlcm5hbWU6IHouc3RyaW5nKCkubWluKDMpLnJlZ2V4KC9eW2EtejAtOV9dKyQvaSwgJ1NvbG8gbGV0dGVyZS9udW1lcmkvXycpLFxyXG4gIGVtYWlsOiB6LnN0cmluZygpLmVtYWlsKCksXHJcbiAgcGFzc3dvcmQ6IHouc3RyaW5nKCkubWluKDYpXHJcbn0pXHJcblxyXG5leHBvcnQgY29uc3QgbG9naW5TY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgZW1haWw6IHouc3RyaW5nKCkuZW1haWwoKSxcclxuICBwYXNzd29yZDogei5zdHJpbmcoKS5taW4oNilcclxufSlcclxuXHJcbmV4cG9ydCBjb25zdCBwb3N0U2NoZW1hID0gei5vYmplY3Qoe1xyXG4gIGNvbnRlbnQ6IHouc3RyaW5nKCkubWluKDEpLFxyXG4gIG1lZGlhVXJsOiB6LnN0cmluZygpLnVybCgpLm9wdGlvbmFsKCkub3Ioei5saXRlcmFsKCcnKS50cmFuc2Zvcm0oKCkgPT4gdW5kZWZpbmVkKSksXHJcbiAgbWVkaWFUeXBlOiB6LmVudW0oWydpbWFnZScsICd2aWRlbyddKS5vcHRpb25hbCgpXHJcbn0pXHJcblxyXG5leHBvcnQgY29uc3QgY29tbWVudFNjaGVtYSA9IHoub2JqZWN0KHtcclxuICBwb3N0SWQ6IHouc3RyaW5nKCkuY3VpZCgpLFxyXG4gIGNvbnRlbnQ6IHouc3RyaW5nKCkubWluKDEpXHJcbn0pXHJcbiJdLCJuYW1lcyI6WyJ6IiwicmVnaXN0ZXJTY2hlbWEiLCJvYmplY3QiLCJuYW1lIiwic3RyaW5nIiwibWluIiwidXNlcm5hbWUiLCJyZWdleCIsImVtYWlsIiwicGFzc3dvcmQiLCJsb2dpblNjaGVtYSIsInBvc3RTY2hlbWEiLCJjb250ZW50IiwibWVkaWFVcmwiLCJ1cmwiLCJvcHRpb25hbCIsIm9yIiwibGl0ZXJhbCIsInRyYW5zZm9ybSIsInVuZGVmaW5lZCIsIm1lZGlhVHlwZSIsImVudW0iLCJjb21tZW50U2NoZW1hIiwicG9zdElkIiwiY3VpZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/validations.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/zod","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ffollow-request%2Froute&page=%2Fapi%2Ffollow-request%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffollow-request%2Froute.ts&appDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CMauroDiCarlo%5CPerso%5CSocialBook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();