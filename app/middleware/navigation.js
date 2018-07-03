import Navigation from '../model/navigation';

async function navigation(req, res, next) {
  // Get Navigation.
  const fields = ['title', 'post', 'page', 'tag', 'user', 'link', 'created_at', '_id'];
  res.locals.navigation = await Navigation.find({}).select(fields.join(' ')).populate('page post tag').populate('user', '-password');
  next();
}

export default navigation;
