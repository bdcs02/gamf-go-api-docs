export const modulTemplate = `from locust import task, TaskSet
import logging
import common.auth
from faker import Faker

class {{name}}(TaskSet):
{{tasks}}`;
