import CloseIcon from "@mui/icons-material/Close";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import ReplayIcon from "@mui/icons-material/Replay";
import UndoIcon from "@mui/icons-material/Undo";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import { FC } from "react";


type Props = {
    open: boolean;
    handleClose: () => void;
}
export const ControlsDialog: FC<Props> = ({ open, handleClose }) => {


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>

                <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>

                    <Typography variant="h6" component="h2">
                        Controls
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <KeyboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={
                            <span>
                                <b>Space: </b>
                                Next Player
                            </span>
                        } />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ReplayIcon />
                        </ListItemIcon>
                        <ListItemText primary={
                            <span>
                                <b>Enter: </b>
                                Reverse Card
                            </span>
                        } />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <UndoIcon />
                        </ListItemIcon>
                        <ListItemText primary={
                            <span>
                                <b>Escape: </b>
                                Undo
                            </span>
                        } />
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
};