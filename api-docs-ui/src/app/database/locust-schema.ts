export const locustSchema = {
	/*  Increase the schema version by 1 if the schema changed and add the strategy to migrateStrategy */
	version: 1,
	primaryKey: 'name',
	type: 'object',
	properties: {
		name: {
			type: 'string',
			maxLength: 100
		},
		config: {
			type: 'object'
		}
	},
	attachments: {
		encrypted: false
	},
	required: ['config']
};
