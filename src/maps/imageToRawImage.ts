import {Image, RawImage} from "../types";
import {formatISO} from "date-fns";

const rawImageToImage = async (image: Image): Promise<RawImage> => ({
    id: image.id,
    url: image.url,
    avatar: image.avatar,
    profile_type: image.profileType,
    profile_id: image.profileId,
    created_at: image.createdAt ? formatISO(image.createdAt) : '',
    updated_at: image.updatedAt ? formatISO(image.updatedAt) : null,
});

export default rawImageToImage;
