import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },
        submittedBy: {
            type: String,
            required: true
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
