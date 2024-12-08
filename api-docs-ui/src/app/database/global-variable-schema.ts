export const globalSchema = {
	/*  Increase the schema version by 1 if the schema changed and add the strategy to migrateStrategy */
	version: 0,
	primaryKey: 'key',
	type: 'object',
	properties: {
		key: {
			type: 'string',
			maxLength: 100,
		},
		value: {
			type: 'string'
		},
	},
	required: [''],
};
