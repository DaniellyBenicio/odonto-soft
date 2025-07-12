import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  Toolbar,
  AppBar,
  Box,
} from "@mui/material";
import { Menu, People, ExitToApp, Warning } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { logout } from "../service/Auth.js";

const Sidebar = ({ setAuthenticated }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [accessType, setAccessType] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setAccessType(localStorage.getItem("accessType") || "");

    // destacar menu ativo
    if (location.pathname === "/users") setSelectedItem("users");
  }, [location.pathname]);

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleItemClick = (path, item) => {
    setSelectedItem(item);
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const getListItemStyle = (selected, item) => ({
    backgroundColor: selected === item ? "#4CAF50" : "transparent",
    "&:hover": {
      backgroundColor: selected === item ? "#4CAF50" : "#388E3C",
    },
  });

  const handleLogout = () => {
    logout(setAuthenticated);
    handleCloseConfirmDialog();
    setTimeout(() => navigate("/login"), 100);
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowY: "auto",
        paddingBottom: "20px",
      }}
    >
      <Box>
        <List>
          <Divider sx={{ backgroundColor: "white", marginBottom: 1 }} />

          <Typography
            variant="subtitle1"
            sx={{ color: "white", marginTop: "10px", textAlign: "center" }}
          >
            Bem vindo(a), {username || "usuário"}!
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#ddd",
              display: "block",
              textAlign: "center",
              mt: "5px",
            }}
          >
            ({accessType})
          </Typography>

          <Divider
            sx={{ backgroundColor: "white", marginBottom: 1, marginTop: "5px" }}
          />

          {accessType === "admin" && (
            <ListItem
              button
              onClick={() => handleItemClick("/users", "users")}
              sx={getListItemStyle(selectedItem, "users")}
            >
              <People sx={{ mr: 1 }} />
              <ListItemText primary="Usuários" />
            </ListItem>
          )}
        </List>
      </Box>

      <Box>
        <ListItem
          button
          onClick={handleOpenConfirmDialog}
          sx={getListItemStyle(selectedItem, "exit")}
        >
          <ExitToApp sx={{ mr: 1 }} />
          <ListItemText primary="Sair" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: "#087619",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 240,
                backgroundColor: "#087619",
                color: "white",
                top: "64px",
                height: "calc(100% - 64px)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              backgroundColor: "#087619",
              color: "white",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "9px",
            width: isMobile ? "100%" : "390px",
            mx: isMobile ? 2 : "auto",
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Warning sx={{ fontSize: 55, color: "#FFA000" }} />
          </Box>
          <Typography textAlign="center">
            Tem certeza que deseja sair?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            gap: 2,
            padding: isMobile ? "16px" : "23px 70px",
            marginTop: "-20px",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleLogout}
            sx={{
              color: "white",
              backgroundColor: "#087619",
              padding: "5px 25px",
              "&:hover": { backgroundColor: "#066915" },
            }}
          >
            Sim
          </Button>
          <Button
            onClick={handleCloseConfirmDialog}
            sx={{
              color: "white",
              backgroundColor: "#F01424",
              padding: "5px 25px",
              "&:hover": { backgroundColor: "#D4000F" },
            }}
          >
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
