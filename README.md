# Cat Crowd Party

An HTML5 stream overlay.

# Requirments

npm 7.x.x+ (this project uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces))  
node js 16.x.x

Recommenend way: [nvm](https://github.com/nvm-sh/nvm)

# Setup

Cat Crowd Party monorepo consists of `backend`, `frontend` and `common` which shares sourcecode imported by `backend` and `frontend` located under `applications/`.  
Never import `backend` modules from `frontend` and vice versa to avoid cicular dependencies. Never import modules from `backend` and `frontend` in `common` package.

Run `npm install` from the root directory to install dependencies for each application.  
Run `npm run build:all` from the root directory to build each application at once.

# Start

You can start each application from the root directory seperately by running `npm run start:frontend` and `npm run start:backend`.
The frontend is available at port `2424` and backend at `5000`,

# Docker

`docker-compose up --build`

# Docs

Tech Stack, Flow Chart and Presentation are located in [docs](docs).

# LudeCat Gaming Events

https://lude.cat/  
https://www.facebook.com/ludecatgaming  
https://www.twitch.tv/ludecat

# Credits

Placeholder Hot Air Balloon: https://www.appgamekit.com/documentation/utilities/0_image_joiner.htm
