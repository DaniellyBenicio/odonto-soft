import jwt from "jsonwebtoken";
import db from "../models/index.js"; 

export async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.userId = user.id;
    req.userAccessType = user.accessType;

    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.userAccessType) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!allowedRoles.includes(req.userAccessType)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}
