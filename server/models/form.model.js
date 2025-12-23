import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["text", "textarea", "multiple-choice", "checkbox", "dropdown"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    options: {
        type: [String],
        default: undefined
    }
});

const formSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        published: {
            type: Boolean,
            default: false
        },
        questions: [questionSchema]
    },
    { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
export default Form; 
