import User from "../models/user.model.js";


export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            email,
            password,
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            res.status(400).json({ message: "invalid credentials" });
        }

        res.status(201).json({
            message: "user login Successfully",
            success: true,
            user: {
                id: user._id,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}
