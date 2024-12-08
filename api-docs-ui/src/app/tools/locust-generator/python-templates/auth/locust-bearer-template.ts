export const bearerTemplate = `
def {{name}}(self):
	self.client.verify = False
	self.client.headers = {
		'content-type': 'application/json',
		'Authorization' : 'Bearer {{token}}'
	}`;
