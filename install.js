const Post = require('./app/model/post');
const User = require('./app/model/user');
const Tag = require('./app/model/tag');
const Image = require('./app/model/image');
const Content = require('./app/model/content');
const Page = require('./app/model/page');

const Config = require('./config/server');

const Db = require('./app/database');
const Bcrypt = require('bcrypt');
const Prompt = require('prompt');

/*
 * Check if a user exists in the database.
 */
const query = User.find({});
query.exec((find_err, results) => {
  if (results.length > 0) {
    // Do not run install if a user exists.
    console.log('ribbon is already installed.');
    process.exit();
  } else {
    console.log('Administration details for ribbon back-end.');
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

    Prompt.get(Schema, (prompt_err, prompt_result) => {
      if (prompt_err) {
        console.log(prompt_err);
        process.exit();
      }
      /*
       * Adding the user to the database.
       */
      Bcrypt.hash(prompt_result.password, Config.hash.salt_rounds, (hash_err, hash) => {
        const user = new User({
          username: prompt_result.username,
          password: hash,
          email: prompt_result.email,
        });
        user.save((user_save_err, new_user) => {
          // Create a new page.
          const page = new Page({
            title: 'First Page',
            url: 'First-Page',
            description: 'This is the first page for the website!',
            created_by: Db.Types.ObjectId(new_user.id),
            image: null,
          });

          page.save((page_save_err, new_page) => {
            // Create content for the new page.
            const content = new Content({
              title: 'First Box',
              content: 'First box contents.',
              page_id: Db.Types.ObjectId(new_page._id),
              content_column: 3,
              created_by: Db.Types.ObjectId(new_user.id),
            });

            content.save();
          });

          // Add an image to the database.
          const image = new Image({
            title: 'photo-1499336315816-097655dcfbda.jpg',
            file_name: 'photo-1499336315816-097655dcfbda.jpg',
            created_by: Db.Types.ObjectId(new_user.id),
          });

          image.save();
          // Create a new tag entry.
          const tag = new Tag({
            title: 'Example Tag',
            url: 'Example-Tag',
            content: 'A tag for blog entries.',
          });

          tag.save((tag_save_err, new_tag) => {
            // Create a new post using this tag.
            const post = new Post({
              title: 'First Post',
              url: 'First-Post',
              content: 'This is the first post for the blog!',
              image: null,
              created_by: Db.Types.ObjectId(new_user._id),
              tag: Db.Types.ObjectId(new_tag._id),
            });

            post.save();
          });
          console.log(`You can access the administrators panel by visiting '<website_url>/ribbon' and logging in using the email '${prompt_result.email}'.`);
          console.log('Exit the setup by pressing CTRL+C.');
        });
      });
    });
  }
});
