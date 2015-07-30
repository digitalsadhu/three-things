# Three Things

## Development

- `cp .env-example .env`
- fill in env variables in .env
- `npm run start:dev`

## Deploying to production

- copy build bundle from client app into the ./client folder and commit
- `git remote add heroku https://git.heroku.com/threethings.git`
- `git push heroku master`
- visit `https://threethings.herokuapp.com`
