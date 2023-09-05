import { Request, Response } from 'express';

class SiteController {
  index(req: Request, res: Response) {
    return res.send('home or other');
  }
}

module.exports = new SiteController();
