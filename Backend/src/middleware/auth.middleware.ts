import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Authorization manquante" });

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(500).json({ error: "JWT secret non configuré" });
    }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "JWT secret non configuré" });
    }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

export const authorizedRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        if (req.user.professionnelProfile != null && roles.includes("Professionnel")) {
            return next();
        }
        if (req.user.groupesModerateur.length != 0 && roles.includes("Modérateur")) {
            return next();
        }
        else 
            return res.status(403).json({ error: "Accès refusé" });
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

