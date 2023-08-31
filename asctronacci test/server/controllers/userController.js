const { User } = require("../models");
const { comparePassword, encodeToken } = require("../helpers/crypto");
const { OAuth2Client } = require("google-auth-library");
const { createToken } = require("../helpers/jwt");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class userController {
  static async register(req, res) {
    try {
      const { userName, email, password, memberType } = req.body;
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }
      if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
      }
      const emailAlreadyExist = await User.findOne({ where: { email } });
      if (emailAlreadyExist) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }

      const user = await User.create({
        userName,
        email,
        password,
        memberType,
      });
      res.status(201).json({
        message: `user with email ${user.email} has been created`,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }
      if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Email or Password is wrong" });
        return;
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Email or Password is wrong" });
        return;
      }

      const token = encodeToken({ id: user.id });
      res.status(200).json({
        access_token: token,
        memberType: user.memberType, 
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async googleLogIn(req, res) {
    try {
      let google_token = req.headers["google-token"]; 
      console.log(google_token);

      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      let user = await User.findOne({
        where: { email: payload.email },
      });
      if (!user) {
        user = await User.create({
          userName: payload.name,
          email: payload.email,
          password: String(Math.random()),
          memberType: "C",
        });
      }
      let payload_access_token = {
        id: user.id,
      };
      let access_token = createToken(payload_access_token);
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = userController;
