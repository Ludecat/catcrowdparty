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

Add and configure multiple `.env` files accordingly using `.env.example` templates .

# Start

You can start each application from the root directory seperately by running `npm run start:frontend` and `npm run start:backend`.
The frontend is available at port `2424` and backend at `4848`,

# Docker

`docker-compose up --build`
`docker-compose up -d`

# Add new dependency

This repository uses `npm workspaces`. Npm workpaces allows developers to manage multiple packages to be managed from the root directory (e.g. local `@ccp` namespace).
Therefore it is an absolute requirement to only install dependencies from the root directory.

Use `npm install <packagename> -w <workspace-name>` to install dependencies to one application located in `applications`.

# Docs

Tech Stack, Flow Chart and Presentation are located in [docs](docs).

# LudeCat Gaming Events

https://lude.cat/  
https://www.facebook.com/ludecatgaming  
https://www.twitch.tv/ludecat
