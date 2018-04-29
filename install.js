import Bcrypt from 'bcrypt';

import Prompt from 'prompt';

import Post from './app/model/post';

import User from './app/model/user';

import Tag from './app/model/tag';

import Image from './app/model/image';

import Content from './app/model/content';

import Page from './app/model/page';

import Config from '../config/server.json';

import Db from './app/database';

console.log('\x1b[47m\x1b[35m', 'ribbon Setup', '\x1b[0m');

/*
 * Check if a user exists in the database.
 */
const query = User.find({});

query.exec(async (fidn_err, find_results) => {
  if (find_results.length > 0) {
    console.log('\x1b[47m\x1b[31m', 'ribbon is already installed.', '\x1b[0m');
    process.exit();
  } else {
    console.log('\x1b[47m\x1b[30m', 'Administration Details', '\x1b[0m');
    Prompt.start();
    const Schema = {
      properties: {
        username: {
          description: 'Enter your username',
          required: true,
          default: 'admin',
        },
        email: {
          description: 'Enter your email',
          required: true,
          default: 'admin@admin.com',
        },
        password: {
          description: 'Enter your password',
          required: true,
          hidden: true,
          replace: '*',
          default: 'password',
        },
      },
    };

    Prompt.get(Schema, async (prompt_err, prompt) => {
      // Add admin authentication details.
      const new_user = await new User({
        username: prompt.username,
        password: await Bcrypt.hash(prompt.password, Config.hash.salt_rounds),
        email: prompt.email,
      }).save();

      // Add first page.
      const new_page = await new Page({
        title: 'First Page',
        url: 'First-Page',
        description: 'This is the first page for the website!',
        created_by: Db.Types.ObjectId(new_user.id),
        image: null,
      }).save();

      // Add content boxes for the first page.
      const content = await new Content({
        title: 'First Box',
        content: 'First box contents.',
        page_id: Db.Types.ObjectId(new_page._id),
        content_column: 3,
        created_by: Db.Types.ObjectId(new_user.id),
      }).save();

      // Add default image into database.
      const image = await new Image({
        title: 'photo-1499336315816-097655dcfbda.jpg',
        file_name: 'photo-1499336315816-097655dcfbda.jpg',
        created_by: Db.Types.ObjectId(new_user.id),
      }).save();

      //  Add first tag into database.
      const new_tag = await new Tag({
        title: 'Example Tag',
        url: 'Example-Tag',
        content: 'A tag for blog entries.',
      }).save();

      // Add first post into database.
      const post = await new Post({
        title: 'First Post',
        url: 'First-Post',
        content: 'This is the first post for the blog!',
        image: Db.Types.ObjectId(image._id),
        created_by: Db.Types.ObjectId(new_user._id),
        tag: Db.Types.ObjectId(new_tag._id),
      }).save();

      console.log('\x1b[42m\x1b[30m', `You can access the administrators panel by visiting '<website_url>/ribbon' and logging in using the email '${prompt.email}'.`, '\x1b[0m');
      process.exit();
    });
  }
});
