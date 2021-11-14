from django.http.response import JsonResponse
from django.test import TestCase
from config.tests import mock_request
from config.models import UserModel, Profiles
from profiles.views import ProfileView
from rest_framework.authtoken.models import Token
import uuid
import json

# Create your tests here.


class ChangeNickNameTestCase(TestCase):
    def setUp(self) -> None:
        self.user = UserModel.objects.create_user(
            username='홍길동', password='123')
        self.profile = Profiles.objects.create(name='홍길동', user=self.user)

        key = str(uuid.uuid4())[:40]

        self.token = Token.objects.create(key=key, user=self.user)

    def test_nickname_not_given(self):
        nickname_not_given: JsonResponse = mock_request(
            self.user, self.token, params={'user': self.user.id, 'profile': self.profile.id}, view_name='profile_view', view=ProfileView, mode='put')
        self.assertEquals(nickname_not_given.status_code,
                          400, '닉네임이 주어지지 않았다면 400')

    def test_nickname_too_long(self):
        nickname = 'a' * 200

        nickname_too_long: JsonResponse = mock_request(
            self.user, self.token, params={'user': self.user.id, 'profile': self.profile.id}, data={'nickname': nickname}, view_name='profile_view', view=ProfileView, mode='put')

        self.assertEquals(nickname_too_long.status_code,
                          400, '닉네임이 너무 길면 400')

    def test_nickname_has_changed(self):

        nickname = 'a' * 20
        nickname_changed: JsonResponse = mock_request(
            self.user, self.token, params={'user': self.user.id, 'profile': self.profile.id}, data={'nickname': nickname}, view_name='profile_view', view=ProfileView, mode='put')

        self.assertEquals(nickname_changed.status_code, 200, '닉네임이 주어지면 200')

        changed_nickname = UserModel.objects.get(id=self.user.id).username

        self.assertEquals(changed_nickname, nickname, '사용자 이름이 닉네임으로 바뀌어야 한다')

        response: dict = json.loads(nickname_changed.content)

        self.assertEquals(response.get('nickname', None), changed_nickname)
