import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "Authorization manquante" });

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;

    if (!secret) {
    return res.status(500).json({ error: "JWT secret non configuré" });
  }

    try {
        const decoded = jwt.verify(
            token,
            secret
        ) as TokenPayload;

        req.user = decoded; // Ajout sur req.user → défini dans express.d.ts

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
};

export const authorizedRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
};

export const authorizedGroup = (group: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const groups = req.user?.groups || [];
        if (!Array.isArray(groups)|| !groups.includes(group)) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
};

