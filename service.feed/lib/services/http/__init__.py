from requests import request
from lib.utils import get_logger


class BaseHTTPService:
    logger = get_logger(__name__)

    def fetch(self, url, method='GET', payload=None, headers={}):
        ok, data, status = False, dict(
            status='error', message='An Internal Error Occured'), 500
        _headers = {
            'Content-Type': 'application/json'
        }
        _headers.update(headers)
        try:
            res = request(method, url, json=payload, headers=_headers)
            if res.status_code == 200:
                ok = True
            data = res.json()
            status = res.status_code
        except Exception as e:
            self.logger.exception(e)
        return ok, data, status

from .users import UserService
