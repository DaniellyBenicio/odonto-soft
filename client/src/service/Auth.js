import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, name } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("username", name);
    return { token, name };
  } catch (error) {
    const message = error.response?.data?.message || "Falha na autenticação";
    throw new Error(message);
  }
};

export const logout = (setAuthenticated) => {
  try {
    localStorage.removeItem("token");
    setAuthenticated(false);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
