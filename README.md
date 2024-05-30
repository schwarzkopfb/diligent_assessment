# diligent_assessment

This is my submission to a competition to work at Diligent as a Senior Software Engineer.

Try it out live! Deployed here: https://diligent-assessment.schwarzkopfb.codes<br/>
Task description: https://github.com/dil-ajanek/tech_assessment/blob/main/README.md

## Overview

### Application structure

This repository consists of 3 main folders and some configuration and manifest files.

- `prisma` dir contains the database schema and initial "migration" `sql` file for a PostgreSQL datastore - used by the backend.
- `public` is the classic "wwwroot", containing static assets served directly and a special `index.html` which is used as a template for the final client html.
- in `src` there are two subdirectories: `client` and `server` containing the source files for the frontend
  and the backend respectively.

The client is based on `React` with `TypeScript`, `Bootstrap` and `Sass` for styling - bundled by `webpack`.

The server is also written in `TypeScript` on top of `Koa` because that's a quite powerful, light-weight
web framework with amazing performance and flexibility.

#### Database

The project is backed by PostgreSQL. Prisma ORM is chosen because of it's compatibility with AWS Aurora and the easy, reliable management of migrations as well as its superior development experience with Node.js.

<img width="709" alt="Screen Shot 2024-05-30 at 12 40 34 PM" src="https://github.com/schwarzkopfb/diligent_assessment/assets/1900242/06562153-7835-4694-913a-ebfda9418a84">

### Getting started

First install the dependencies listed in `package.json`:

```sh
$ npm install
```

Then build both the server and the client code:

```sh
$ npm run build
```

this will emit the transpiled and bundled client and server code into the `dist` folder.

To be able to connect to The Movie Database, you'll need an access token for their API
and also a PostgreSQL database should be available somewhere.
You have to set `DATABASE_URL` and `TMDB_API_READ_ACCESS_TOKEN` in the shell you're going to
run the application.

Once the build step is done, and the configuration is ready, you can start it up by executing:

```sh
$ npm start
```

A minimal but useful development logger is also included.

You can override the default port `3000` with the `PORT` environment variable. But if all the above steps
succeeded, now your server is ready to accept connections at `http://0.0.0.0:3000/`.

If you're planning to actively develop the project there is also

```sh
$ npm run dev
```

which starts up incremental compilers with watchers, so you can try out your work locally right after
saving file changes in the project.

Due to the standard structure of the project, it's directly deployable to Cloud providers like Heroku and easily adjustable to Serverless hosting providers to be able to cost efficiently run it on the edge.

Scalability and performance were the main architectural approaches, as you can experience it yourself on the live deployment - that's powered by a single Heroku Eco Dyno only but is quite responsive and fast.

I tried to a bit over-comment the source to help the reviewer go through it faster.

Hope you'll like it! 🤞 ✌️

## License

[MIT](/LICENSE)
