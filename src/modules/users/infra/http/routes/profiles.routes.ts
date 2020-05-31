import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthentication';

const profilesRouter = Router();
const profileController = new ProfileController();

profilesRouter.use(ensureAuthenticated);

profilesRouter.get('/', profileController.show);
profilesRouter.put('/', profileController.update);

export default profilesRouter;
