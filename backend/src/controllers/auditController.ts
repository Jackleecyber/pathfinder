import { Request, Response } from 'express';
import { APIResponse } from '@shared/types';

export class AuditController {
  async getLogs(req: Request, res: Response) {
    // TODO: Implement get audit logs
    res.json({ success: true, data: [] });
  }
}
