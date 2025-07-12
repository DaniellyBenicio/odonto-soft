import React, { useState } from "react";
import {
  TextField,
  Container,
  Button,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/Auth.js";
import { jwtDecode } from "jwt-decode";

const Login = ({ onLogin = () => {} }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token);

        const decoded = jwtDecode(response.token);
        localStorage.setItem("username", decoded.username);
        localStorage.setItem("accessType", decoded.accessType);

        if (decoded.accessType === "Admin") {
          navigate("/users");
        } else {
          navigate("/MainScreen");
        }

        onLogin();
      } else {
        setError("Credenciais inválidas");
      }
    } catch (err) {
      setError("Credenciais Inválidas!");
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 900,
          height: "70vh",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        {/* Seção lateral roxa */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#6A0DAD",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            textAlign: "center",
          }}
        >
          {/* Espaço para a logo */}
          <Box
            sx={{
              width: 140,
              height: 70,
              mb: 3,
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              userSelect: "none",
            }}
          >
            LOGO
          </Box>

          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Clínica Monte
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "80%" }}>
            Excelência em saúde bucal e cuidado personalizado.
          </Typography>
        </Box>

        {/* Seção do formulário */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 4, fontWeight: "bold", color: "#6A0DAD" }}
          >
            Entrar
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", maxWidth: 300 }}
          >
            <Typography variant="subtitle1" sx={{ color: "#666666", mb: 1 }}>
              E-mail
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!email && !isEmailValid()}
              helperText={!!email && !isEmailValid() ? "Email inválido" : ""}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#6A0DAD",
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#d32f2f",
                  },
                },
              }}
              InputProps={{
                startAdornment: <Person sx={{ color: "#666666", mr: 1 }} />,
              }}
            />
            <Typography variant="subtitle1" sx={{ color: "#666666", mb: 1 }}>
              Senha
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#6A0DAD",
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#d32f2f",
                  },
                },
              }}
              InputProps={{
                startAdornment: <Lock sx={{ color: "#666666", mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={passwordVisibility}
                      edge="end"
                      sx={{ color: "#666666" }}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !isEmailValid() || !password}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                backgroundColor: "#6A0DAD",
                "&:hover": { backgroundColor: "#5A0A9A" },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: "#6A0DAD",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Recuperar Senha?
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
