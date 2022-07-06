const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const filePathPrimary = path.normalize(
  path.join(process.cwd(), 'logs')
);
const filePath = path.normalize(
  path.join(filePathPrimary, 'selectDB')
);

const dbPath = (db) => {
  return path.join(filePath, `${db}.json`);
};

const validateDB = (name) => {
  const dbList = getDB();
  return dbList.includes(`${name}.json`);
};

const validatePost = (post) => {
  return post.title.trim() && post.content.trim();
};

const getDB = () => {
  return fs.readdirSync(filePath);
};

const postDB = (name) => {
  if (!validateDB(name)) {
    fs.writeFileSync(dbPath(name), JSON.stringify([]));
  }
  return getDB();
};

const getContent = async (db) => {
  if (!validateDB(db)) return [];
  return await readDB(db);
};

const postContent = async (db, post) => {
  if (!validateDB(db)) return [];
  if (!validatePost(post)) return [];
  const id = uuidv4();
  const date = new Date();
  const { title, content } = post;
  const newPost = { title, content, date, id, db };
  const list = await readDB(db);
  list.unshift(newPost);
  const newList = await writeDB(db, list);
  return newList;
};

const deleteContent = async (db, id) => {
  if (!validateDB(db)) return [];
  const oldList = await readDB(db);
  const list = oldList.filter((item) => {
    return item.id !== id;
  });
  const newList = await writeDB(db, list);
  return newList;
};

const putContent = async (db, post) => {
  // console.log('typing the post : ', post);
  if (!validateDB(db)) return [];
  if (!validatePost(post)) return [];
  const oldList = await readDB(db);
  const list = oldList.map((item) => {
    if (item.id === post.id)
      return {
        ...item,
        title: post.title,
        content: post.content,
      };
    else return item;
  });
  const newList = await writeDB(db, list);
  return newList;
};

const readDB = (db) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath(db), 'utf-8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const writeDB = (db, array) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbPath(db), JSON.stringify(array), (err) => {
      if (err) reject(err);
      resolve(array);
    });
  });
};

const initialize = () => {
  let dirExist = fs.existsSync(filePathPrimary);
  if (!dirExist) fs.mkdirSync(filePathPrimary);
  dirExist = fs.existsSync(filePath);
  if (!dirExist) fs.mkdirSync(filePath);
};

module.exports = {
  getDB,
  postDB,
  getContent,
  postContent,
  deleteContent,
  putContent,
  initialize,
};
