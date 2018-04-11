/*
 * Controller for navigation.
 */
const Navigation = require('../model/navigation');

class NavigationC {
  list(req, res) {
    const fields = ['title', 'page', 'post', 'link', 'tag', 'use', 'created_at', 'last_updated', '_id'];
    const query = Navigation.find({}).select(fields.join(' '))
      .populate('page').populate('post')
      .populate('tag')
      .populate('user', '-password');
    query.exec((err, results) => {
      res.json(results);
    });
  }

  update(req, res) {
    if (req.body.nav) {
      // Remove all entries.
      Navigation.remove({}, () => {
        // Adding everything back into the database.
        const nav = JSON.parse(req.body.nav);
        for (let i = 0; i < nav.length; i++) {
          const new_link = new Navigation({
            title: nav[i].title,
            page: (nav[i].page) ? nav[i].page : null,
            post: null,
            tag: null,
            user: null,
            link: (nav[i].link) ? nav[i].link : null,
          });

          new_link.save(() => {});
        }

        res.json({
          error: 0,
        });
      });
    } else {
      res.json({
        error: 1,
      });
    }
  }
}

module.exports = NavigationC;
