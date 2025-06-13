import jwt from 'jsonwebtoken';
import userModel from '../Model/userModel.js'; 

const secretKey = process.env.secretKey;

const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const splitToken = token.split(" ")[1];
    console.log("hnkj",secretKey)

    const decoded = jwt.verify(splitToken, secretKey);
    console.log("<<<decoded>>>", decoded);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  // Optionally, you can attach the user to the request object
    next();
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid token");
  }
};

export default VerifyToken;
