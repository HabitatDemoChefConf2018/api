export default {
	port: 8080,
	bodyLimit: '100kb',
	corsHeaders: ['Link'],
	sites: [
		{ id: '1', name: 'sites_001', uri: 'http://localhost:8090' }
	],
	apis: [
		{ id: '1', name: 'api_001', uri: 'http://localhost:8082' }
	],
}
