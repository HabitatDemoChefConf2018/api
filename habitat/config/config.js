export default {
	port: {{cfg.port}},
	bodyLimit: '100kb',
	corsHeaders: ['Link'],
	sites: [
  {{~#eachAlive bind.site.members as |member|}}
    { id: '{{member.sys.member_id}}', name: '{{member.sys.hostname}}', uri: 'http://{{member.sys.hostname}}:{{member.cfg.port}}' },
  {{~/eachAlive}}
	]
}