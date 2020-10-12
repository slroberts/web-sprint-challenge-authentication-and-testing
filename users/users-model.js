const db = require('../database/dbConfig.js');

module.exports = {
  add,
  findBy,
};

async function add(user) {
  const [id] = await db('users').insert(user, 'id');
  return db('users').where({ id }).first();
}

async function findBy(filter) {
  const user = await db('users').where(filter);
  return user;
}
