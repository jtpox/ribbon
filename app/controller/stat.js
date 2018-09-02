import Stat from '../model/stat';

class StatC {
  async post(req, res) {
    const days = (req.params.days != null) ? req.param.days : 7;
    try {
      res.json(await Stat.post(req.params.id, days));
    } catch (err) {
      req.log.error(err);
    }
  }

  async pageArray(req, res) {
    /*
     * Get a range of dates.
     */
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Get date for a week ago.
    const endDate = new Date();
    let dateRange = [];
    while (startDate < endDate) {
      dateRange.push([
        new Date(startDate.setDate(startDate.getDate() + 1)).toLocaleDateString('en-US'),
        0,
      ]);
    }

    const days = (req.params.days != null) ? req.param.days : 7;
    const stats = await Stat.page(req.params.id, days);
    stats.forEach((item, index) => {
      let date = new Date(item.created_at).toLocaleDateString('en-US');
      dateRange.forEach((day, dayIndex) => {
        if (day[0] === date) {
          dateRange[dayIndex][1] += 1;
        }
      });
    });
    // console.log(dateRange);
    res.json(dateRange);
  }

  /*
   * There must be some better way to do this.
   */
  async pageBrowser(req, res) {
    const days = (req.params.days != null) ? req.param.days : 7;
    const stats = await Stat.page(req.params.id, days);
    // console.log(stats);

    /*
     *  Sort browsers.
     */
    const browsers = [];
    const browserStats = [];
    stats.forEach((item, index) => {
      if (browsers.indexOf(item.browser) === -1) {
        browsers.push(item.browser);
        browserStats.push([
          item.browser,
          0,
        ]);
      }
    });
    // console.log(browsers);

    stats.forEach((item, index) => {
      browserStats.forEach((browserItem, browserIndex) => {
        if (browserItem[0] === item.browser) {
          browserStats[browserIndex][1] += 1;
        }
      });
    });
    res.json(browserStats);
  }

  async pageOs(req, res) {
    const days = (req.params.days != null) ? req.param.days : 7;
    const stats = await Stat.page(req.params.id, days);
    // console.log(stats);

    /*
     *  Sort browsers.
     */
    const os = [];
    const osStats = [];
    stats.forEach((item, index) => {
      if (os.indexOf(item.os) === -1) {
        os.push(item.os);
        osStats.push([
          item.os,
          0,
        ]);
      }
    });
    // console.log(os);

    stats.forEach((item, index) => {
      osStats.forEach((browserItem, osIndex) => {
        if (browserItem[0] === item.os) {
          osStats[osIndex][1] += 1;
        }
      });
    });
    res.json(osStats);
  }

  async page(req, res) {
    const days = (req.params.days != null) ? req.param.days : 7;
    try {
      res.json(await Stat.page(req.params.id, days));
    } catch (err) {
      req.log.error(err);
    }
  }
}

export default StatC;
