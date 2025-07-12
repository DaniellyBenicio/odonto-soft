import db from "../../models/index.js";
import bcrypt from "bcryptjs";
const { Op } = db.Sequelize;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, accessType } = req.body;

    const creator = await db.User.findByPk(req.userId);
    if (!creator) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!name || !email || !password || !accessType) {
      return res.status(400).json({ error: "Nome, email, senha e tipo de acesso são obrigatórios." });
    }

    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
      return res.status(400).json({ error: "O nome deve conter apenas letras e espaços." });
    }

    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    if (creator.accessType === "admin") {
    } else if (creator.accessType === "atendente") {
      if (accessType !== "paciente") {
        return res.status(403).json({ error: "Atendente só pode cadastrar pacientes." });
      }
    } else {
      return res.status(403).json({ error: "Você não tem permissão para cadastrar usuários." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      accessType,
    });

    const { password: _, ...userData } = user.toJSON();

    res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, accessType } = req.body;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (email && email !== user.email) {
      const exists = await db.User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }
      user.email = email;
    }

    if (name) {
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
        return res.status(400).json({
          error: "O nome deve conter apenas letras e espaços.",
        });
      }
      user.name = name;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (accessType) {
      user.accessType = accessType;
    }

    await user.save();

    const { password: _, ...userData } = user.toJSON();

    res.json({ message: "Usuário atualizado com sucesso.", user: userData });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { name, page = 1, limit = 10, order = "asc" } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    const { count, rows } = await db.User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["name", order === "asc" ? "ASC" : "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.json({
      users: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.destroy();

    res.json({ message: "Usuário excluído com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};
