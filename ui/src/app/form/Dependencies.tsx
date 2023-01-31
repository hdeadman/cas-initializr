import React, { Fragment } from "react";
import {
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dependency } from "../data/Dependency";
import DependencySelector from "./DependencySelector";
import { useAppDispatch } from "../store/hooks";
import {
    setDependencies,
    useMappedOverlayDependencies,
    useOverlayDependencies,
} from "../store/OverlayReducer";
import { Action, useCommand } from "../core/Keyboard";

export default function Dependencies() {
    const selectedDependencies = useMappedOverlayDependencies();
    const selected = useOverlayDependencies();
    const dispatch = useAppDispatch();

    const remove = (id: string) => {
        dispatch(setDependencies(selected.filter((s: string) => s !== id)));
    };

    const clear = () => {
        dispatch(setDependencies([]));
    };

    

    const { label, keys, modifier, modifierIcon } = useCommand(Action.CLEAR);

    useHotkeys(`${modifier}+${keys}`, () => clear(), { preventDefault: true }, [
        clear,
    ]);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <DependencySelector
                    onSelectedChange={(sel: string[]) =>
                        dispatch(setDependencies(sel))
                    }
                />
                {selected?.length > 0 && (
                    <Button
                        variant="outlined"
                        onClick={() => clear()}
                        startIcon={<DeleteForeverIcon />}
                    >
                        {label} (
                        {React.createElement(modifierIcon, {
                            fontSize: "small",
                        })}
                        +{keys})
                    </Button>
                )}
            </div>
            <List dense>
                {selectedDependencies.map(
                    (s: Dependency | undefined, idx: number) => (
                        <Fragment key={idx}>
                            {s !== undefined ? (
                                <ListItem
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => remove(s.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={s.name}
                                        secondary={s.description}
                                    />
                                </ListItem>
                            ) : (
                                <Fragment></Fragment>
                            )}
                        </Fragment>
                    )
                )}
            </List>
        </>
    );
}
