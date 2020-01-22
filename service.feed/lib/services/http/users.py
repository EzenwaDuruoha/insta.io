from lib.services.http import BaseHTTPService

class UserService(BaseHTTPService):
    def __init__(self, url: str):
        self.url = url
    
    def get_user_followers(self, id):
        endpoint = f'{self.url}/api/v1/admin/social/stats/following'
        _headers = { 'X-Api-Key': 'hey' }
        return self.fetch(endpoint, 'POST', dict(id=id), _headers)
