import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        answers: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);
export default Response;
