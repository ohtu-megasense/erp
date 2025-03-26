import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@mui/material';

interface UpdateConfirmationDialogProps {
  isOpen: boolean;
  text: string;
  setIsOpen: (newState: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const UpdateConfirmationDialog = ({
  isOpen,
  text,
  setIsOpen,
  onSave,
  onCancel
}: UpdateConfirmationDialogProps) => {
  const theme = useTheme();
  const isAtleastSm = useMediaQuery(theme.breakpoints.up('sm'));

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  const handleSave = () => {
    onSave();
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} fullScreen={false} onClose={handleCancel}>
        <DialogTitle>Update confirmation</DialogTitle>
        <DialogContent
          dividers
          sx={{
            minWidth: isAtleastSm ? 400 : undefined
          }}
        >
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
