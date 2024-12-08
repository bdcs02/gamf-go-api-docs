export const requestSchema = {
	/*  Increase the schema version by 1 if the schema changed and add the strategy to migrateStrategy */
	version: 1,
	primaryKey: 'name',
	type: 'object',
	properties: {
		name: {
			type: 'string',
			maxLength: 100,
		},
		config: {
			type: 'object'
		},
		version: {
			type: 'string',
		},
		createDate: {
			type: 'string',
			format: 'date-time',
		},
		method: {
			type: 'string',
			maxLength: 100,
		},
	},
	attachments: {
		encrypted: false
	},
	required: ['name', 'config', 'version', 'createDate', 'method'],
};
