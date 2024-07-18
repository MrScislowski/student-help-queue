# Deployment Instructions

## URL references

| App              | Hosted URL                                                     | Git remote              | Heroku URL                                             |
| ---------------- | -------------------------------------------------------------- | ----------------------- | ------------------------------------------------------ |
| student-frontend | https://help-queue-student-frontend-71154636b8a6.herokuapp.com | heroku-student-frontend | https://git.heroku.com/help-queue-student-frontend.git |
| teacher-frontend | https://help-queue-teacher-frontend-239b686a3dfd.herokuapp.com | heroku-teacher-frontend | https://git.heroku.com/help-queue-teacher-frontend.git |
| admin-frontend   | https://help-queue-admin-frontend-a43b988e9d22.herokuapp.com   | heroku-admin-frontend   | https://git.heroku.com/help-queue-admin-frontend.git   |
| backend          | https://help-queue-backend-cb8730ae9c9f.herokuapp.com          | heroku-backend          | https://git.heroku.com/help-queue-backend.git          |

## Pushing to Heroku

(When you want to trigger a rebuild of the Heroku app):

`git commit --allow-empty -m "Trigger Heroku rebuild"`

| App              | Git command                                                               | Debug command                                          |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| student-frontend | `git subtree push --prefix student-frontend heroku-student-frontend main` | `heroku logs --tail --app help-queue-student-frontend` |
| teacher-frontend | `git subtree push --prefix teacher-frontend heroku-teacher-frontend main` | `heroku logs --tail --app help-queue-teacher-frontend` |
| admin-frontend   | `git subtree push --prefix admin-frontend heroku-admin-frontend main`     | `heroku logs --tail --app help-queue-admin-frontend`   |
| backend          | `git subtree push --prefix backend heroku-backend main`                   | `heroku logs --tail --app help-queue-backend`          |