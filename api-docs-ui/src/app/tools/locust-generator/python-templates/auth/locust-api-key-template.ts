export const apiKeyTemplate = `
def {{name}}(self):
	self.client.verify = False
	self.client.headers = {
		'content-type': 'application/json',
		'{{key}}': '{{value}}'
	}`;
