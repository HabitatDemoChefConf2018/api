'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	port: 8080,
	bodyLimit: '100kb',
	corsHeaders: ['Link'],
	sites: [
		{{~#eachAlive bind.site.members as |member|}}
			{ id: '{{member.sys.hostname}}', name: '{{member.sys.hostname}}', uri: 'http://{{member.sys.ip}}:{{member.cfg.port}}' },
		{{~/eachAlive}}
	],
	apis: [
		{{~#eachAlive svc.members as |member|}}
			{ id: '{{member.sys.hostname}}', name: '{{member.sys.hostname}}', uri: 'http://{{member.sys.ip}}:{{member.cfg.port}}' },
		{{~/eachAlive}}
	]
};
