/*
 * Controller for navigation.
 */
import Navigation from '../model/navigation';

class NavigationC {
  list(req, res) {
    Navigation.list((err, results) => {
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

export default NavigationC;
