//
// Rest Api
//  "/logs"              get = gives DB list [returns list]
//  "/logs"              post = add new DB to the list (db name comes from req.body.db.trim()) [returns list]
//
//  "/logs/:db"          get = gives content of specific DB (db name comes from req.params) [returns list - db content]
//  "/logs/:db"          post = add post to specific DB (db name comes from req.params) [returns list - db content]
//  "/logs/:db/:id"      delete = delete post from specific DB (db name comes from req.params, id of deleted item comes from params) [returns list - db content]
//  "/logs/:db"          put = edit post of a specific DB (db name comes from req.params) [returns list - db content]
//

const express = require('express');
const router = express.Router();
const {
  getDB,
  postDB,
  getContent,
  postContent,
  deleteContent,
  putContent,
  initialize,
} = require('./dbHandler');

initialize(); // initializing DB dir (Json files Directory)

router.get('/', (req, res) => {
  const data = getDB();
  res.send(data);
});

router.post('/', (req, res) => {
  const respose = postDB(req.body.db.trim());
  res.send(respose);
});

router.get('/:db', async (req, res) => {
  const data = await getContent(req.params.db);
  res.send(data);
});

router.post('/:db', async (req, res) => {
  const data = await postContent(req.params.db, req.body);
  res.send(data);
});

router.delete('/:db/:id', async (req, res) => {
  const data = await deleteContent(req.params.db, req.params.id);
  res.send(data);
});

router.put('/:db', async (req, res) => {
  const data = await putContent(req.params.db, req.body);
  res.send(data);
});

module.exports = router;
