import {ChangeEvent, FC, PropsWithChildren} from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Fab from "@mui/material/Fab";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export type AvatarChangeEvent = {
    file?: File,
    avatar?: string
}

type InteractableAvatarProps = {
    alt: string,
    onChange: ({ file, avatar }: AvatarChangeEvent) => void | Promise<void>,
    src: string,
};

export const InteractableAvatar: FC<PropsWithChildren<InteractableAvatarProps>> = (props) => {
    const {
        onChange,
        alt,
        src,
        children,
    } = props;

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        const avatar = file ? URL.createObjectURL(file) : undefined;

        await onChange({ file, avatar });
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            badgeContent={
                <Fab color="primary" aria-label="Upload Picture" component="label">
                    <input hidden accept="image/*" type="file" onChange={handleChange}/>
                    <PhotoCameraIcon/>
                </Fab>
            }
        >
            <Avatar alt={alt} src={src} sx={{width: 200, height: 200}}>
                {src ? null : children}
            </Avatar>
        </Badge>
    );
}
