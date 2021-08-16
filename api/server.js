const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const store = require('connect-session-knex')(session)

const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router')
const server = express();

server.use(session({
  name: 'chocolatechip',
  secret: 'this should come from an env var',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: new store({
    knex: require('../data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter )

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;