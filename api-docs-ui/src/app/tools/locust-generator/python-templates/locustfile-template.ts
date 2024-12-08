export const locustfileTemplate = `from locust import HttpUser, between
import requests
import common.auth

{{imports}}
import time
import gevent
from locust.runners import STATE_STOPPING, STATE_STOPPED, STATE_CLEANUP

class QuickstartUser(HttpUser):
	requests.packages.urllib3.disable_warnings()

	tasks = [
{{tasks}}		]

	{{auth}}
`;
