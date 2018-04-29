/*
 * Controller for navigation.
 */
import Navigation from '../model/navigation';

class NavigationC {
  async list(req, res) {
    try {
      res.json(await Navigation.list());
    } catch (err) {
      req.log.error(err);
      res.json({
        error: 1,
      });
    }
  }

  async update(req, res) {
    if (req.body.nav) {
      try {
        const remove = await Navigation.remove({});

        const nav = JSON.parse(req.body.nav);
        // console.log(nav);
        for (let i = 0; i < nav.length; i++) {
          const new_link = new Navigation({
            title: nav[i].title,
            page: (nav[i].page) ? nav[i].page : null,
            post: null,
            tag: null,
            user: null,
            link: (nav[i].link) ? nav[i].link : null,
          });

          new_link.save(() => { });
        }

        res.json({
          error: 0,
        });
      } catch (err) {
        req.log.error(err);
        res.json({
          error: 1,
        });
      }
    } else {
      res.json({
        error: 1,
      });
    }
  }
}

export default NavigationC;
