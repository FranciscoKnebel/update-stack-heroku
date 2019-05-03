# Update Stack Heroku

CLI to update your Heroku apps stacks from "cedar-14" (deprecated May 2018 and at end-of-life) stack to "heroku-18" (supported until April 2023).

## Prerequisites
- Node
- Git
- Heroku CLI

## How to use it
- Login to Heroku CLI.

- Get list of apps that need to be updated:
> heroku plugins:install apps-table
> heroku apps:table --filter="STACK=cedar-14"

- Parse list of apps into a comma separated list
> Ex: app1,app2,app3

- Create a `.env` file or set your environment with the key HEROKU_APPS containing your app array.

- Execute `./cli.js` to run.

### For GitHub autodeploy users

Pushing doesn't work if app was auto-built from GitHub, since `heroku git:clone` will return an empty repository.
This will set the stack of your apps to `heroku-18` but you will need to deploy **MANUALLY** for each app at Heroku App Dashboard > Deploy > Manual Deploy.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details
