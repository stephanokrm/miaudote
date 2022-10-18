import {FC, useState} from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";

type InteractableAvatarProps = {
    alt: string,
    onDelete: () => void,
    src: string,
    disabled?: boolean,
    loading?: boolean,
};

export const InteractableImage: FC<InteractableAvatarProps> = (props: InteractableAvatarProps) => {
    const {
        onDelete,
        alt,
        src,
        disabled = false,
        loading = false,
    } = props;

    const [focused, setFocused] = useState<boolean>(false);

    const onMouseOver = () => {
        setFocused(true);
    };

    const onMouseLeave = () => {
        setFocused(false);
    };

    return (
        <Box position="relative" onMouseEnter={onMouseOver} onMouseLeave={onMouseLeave}>
            {(focused || loading || disabled) && (
                <Box
                    position="absolute"
                    top={0}
                    right={0}
                    width="100%"
                    height="100%"
                    zIndex={1}
                    borderRadius="25px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Fab color="error" onClick={onDelete} disabled={disabled}>
                        {loading ? (
                            <CircularProgress color="secondary"/>
                        ) : (
                            <DeleteForeverIcon/>
                        )}
                    </Fab>
                </Box>
            )}
            <Image
                style={{
                    borderRadius: '25px',
                }}
                loading="lazy"
                src={src}
                alt={alt}
                height={250}
                width={250}
            />
        </Box>
    );
}