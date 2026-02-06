import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
    {
        name: { type: String, required: true },
        heading: { type: String, required: false }, // User asked for Heading, using name or this
        subheading: { type: String, required: false },
        buttonName: { type: String, required: false },
        images: [
            {
                docName: { type: String },
                docPath: { type: String },
                originalName: { type: String },
            },
        ],
        isDelete: { type: Boolean, required: true, default: false },
        isActive: { type: Boolean, required: true, default: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "admins", required: true },
        modifiedBy: { type: Schema.Types.ObjectId, ref: "admins", required: true },
    },
    { timestamps: true }
);

const BannersModel = mongoose.model("banners", adminSchema);
export default BannersModel;
