import { Request, Response, NextFunction } from "express";
import {
  createMemberSchema,
  registerMemberSchema,
  updateMemberSchema,
} from "../models/members.schema.js";
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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createMemberSchema.parse(req.body);
      const member = await membersService.createMember(validated);
      res.status(201).json({ success: true, data: member });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateMemberSchema.parse(req.body);
      const updated = await membersService.updateMember(id, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await membersService.deleteMember(id);
      res.status(200).json({ success: true, message: "Sócio removido com sucesso" });
    } catch (err) {
      next(err);
    }
  }
}

export const membersController = new MembersController();
