angular.module('firebase.config', [])
    .constant('FBURL', 'https://<your-firebase-here>.firebaseio.com')
    .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

.constant('loginRedirectPath', '/login');