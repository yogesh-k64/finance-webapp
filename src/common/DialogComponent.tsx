import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { useIsMobile } from "../store/AppConfigReducer";

interface DialogComponentProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const DialogComponent = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
  fullWidth = true
}: DialogComponentProps) => {
  const isMobile = useSelector(useIsMobile);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={isMobile}
      className="custom-dialog"
    >
      <DialogTitle className="dialog-title">
        <CloseIcon onClick={onClose} />
        <span>{title}</span>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
