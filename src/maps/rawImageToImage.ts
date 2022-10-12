import {Image, RawImage} from "../types";

const rawImageToImage = async (rawImage: RawImage): Promise<Image> => ({
    id: rawImage.id,
    path: rawImage.path,
    profileType: rawImage.profile_type,
    profileId: rawImage.profile_id,
    createdAt: null,
    createdAtISO: rawImage.created_at,
    updatedAt: null,
    updatedAtISO: rawImage.updated_at,
});

export default rawImageToImage;
