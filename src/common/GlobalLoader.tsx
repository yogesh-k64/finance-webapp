import DotLoader from "./DotLoader";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useLoader } from "../store/AppConfigReducer";

const GlobalLoader = () => {
  const loader = useSelector(useLoader);

  if (!loader) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <DotLoader />
    </Box>
  );
};

export default GlobalLoader;
