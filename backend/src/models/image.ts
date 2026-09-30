import * as mongodb from "mongodb";

export type ImageMode = 'text-to-image' | 'image-to-image' | 'sketch-to-image' | 'inpaint' | 'upload';

export interface Image {
    _id?: mongodb.ObjectId;
    userId?: mongodb.ObjectId;
    // Auth0 user id (user.sub) of the creator
    ownerId?: string;
    name?: string;
    // Legacy: server file path of uploaded images. New records use imageUrl.
    imageData?: string;
    imageUrl?: string;
    mode?: ImageMode;
    prompt?: string;
    negativePrompt?: string;
    parameters?: Record<string, unknown>;
    sourceImageUrl?: string;
    createdAt?: Date;
}
