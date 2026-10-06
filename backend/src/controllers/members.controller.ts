import { Request, Response, NextFunction } from "express";
import { registerMemberSchema } from "../models/members.schema.js";
import { membersService } from "../services/members.service.js";

export class MembersController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerMemberSchema.parse(req.body);
      const result = await membersService.register(validated);
      res.status(201).json({
        success: true,
        message: "Cadastro realizado com sucesso!",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const members = await membersService.getAllMembers();
      res.status(200).json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  }
}

export const membersController = new MembersController();
