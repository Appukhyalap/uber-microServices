const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

let register = async(req , res) => {
    try{
        const {name , email , password} = req.body;

        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({message: "user already exists"});
        }

        const hash = await bcrypt.hash(password , 10);
        const newUser = await userModel.create({name , email , password: hash});
        await newUser.save();

        const token = jwt.sign({id: newUser._id , email: newUser.email} , process.env.JWT_SECRET , {expiresIn: "1h"}); 
        res.cookie('token' , token);
    }
    catch(err) {
        return res.status(500).json({message: err.message});
    }
}

let loginUser = async (req, res, next) => {
       try {
        const { email, password } = req.body;
        const user = await userModel
            .findOne({ email })
            .select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        delete user._doc.password;

        res.cookie('token', token);

        res.send({ token, user });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }

}

let logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        await blacklisttokenModel.create({ token });
        res.clearCookie('token');
        res.send({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

let userProfile = async(req , res) => {
    try{
        res.send(req.user);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    register,
    loginUser,
    logout,
    userProfile
}