import { Request, Response } from "express";
import ServiceAuth, { TLoginPayload } from "../../services/ServiceAuth";
import { IUsers } from "../../models/Users";

class ControllerAuth {
  constructor() {}
  async login(req: Request, res: Response) {
    const payload: TLoginPayload = {
      username: req.body.username,
      password: req.body.password,
    };

    try {
      const response = await ServiceAuth.login(payload);
      if (!response.success) {
        return res.status(403).json({
          data: response.data,
        });
      }
      const token = ServiceAuth.generateToken(response.data as IUsers);

      res.status(200).json({
        data: { token },
      });
    } catch (error) {
      res.status(500).json({
        data: error,
      });
    }
  }

  async registerAdmin(req: Request, res: Response) {
    try {
      await ServiceAuth.register({
        email: req.body.email,
        password: req.body.password,
        role: "admin",
        username: req.body.username,
      });
      res.status(201).json({
        message: "create admin success",
      });
    } catch (error) {
      res.status(500).json({
        message: "failed create admin",
      });
    }
  }

  async registerMember(req: Request, res: Response) {
    try {
      await ServiceAuth.register({
        email: req.body.email,
        password: req.body.password,
        role: "member",
        username: req.body.username,
      });

      res.status(201).json({
        message: "create member success",
      });
    } catch (error) {
      res.status(500).json({
        message: "failed create member",
      });
    }
  }

  async user(req: Request, res: Response) {
    const id: any = (req as Request).user?.id;
    try {
      const response = await ServiceAuth.getUserById(id);

      res.status(201).json({
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "failed get user",
      });
    }
  }
}

export default new ControllerAuth();
