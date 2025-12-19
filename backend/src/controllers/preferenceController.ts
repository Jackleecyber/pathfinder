import { Request, Response } from 'express';
import { APIResponse } from '@shared/types';

export class PreferenceController {
  async getPreferences(req: Request, res: Response) {
    // TODO: Implement get preferences
    res.json({ success: true, data: {} });
  }

  async updatePreferences(req: Request, res: Response) {
    // TODO: Implement update preferences
    res.json({ success: true, message: 'Preferences updated' });
  }
}
