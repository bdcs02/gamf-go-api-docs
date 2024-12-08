export const modulMethodTemplate = `
	task({{task}})
	def {{name}}(self):
		{{auth}}{{faker}}{{call}}{{responseHandler}}
`;
