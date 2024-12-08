export const oauthTemplate = `

def get_token_{{name}}(self):
	self.client.verify = False
	with self.client.get("/keycloak/config", catch_response=True) as response:
		url = '{{url}}'

		params = {
			'client_id': '{{clientID}}',
			'response_type': '{{responseType}}',
			'grant_type': '{{grantType}}',
			'username' : '{{username}}',
			'password': '{{password}}'
			}
		x = requests.post(url, params, verify=False).content.decode('utf-8')
	return json.loads(x)

def {{name}}(self):
	if 'access_token' not in self.{{name}}_oauth_token:
		self.{{name}}_oauth_token = get_token_{{name}}(self)

	self.client.verify = False

	if self.{{name}}_oauth_token['expires_in'] <= 0:
		self.{{name}}_oauth_token = get_token_{{name}}(self)

	self.client.headers = {
		'content-type': 'application/json',
		'Authorization' : 'Bearer ' + str(self.{{name}}_oauth_token['access_token'])
	}`;
