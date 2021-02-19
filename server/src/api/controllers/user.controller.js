const mongoose = require("mongoose");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user.model");

const funcsUtils = require("../utils/funcs");
const APIError = require("../utils/APIError");

const { saltRounds, jwtSecret, email } = require("../../constants");
const roles = require("../../constants/userRoles");

/**
 * Reset user password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const userEmail = req.body.email;

    const checkUser = await User.findOne({ email: userEmail });
    if (!checkUser)
      return next(new APIError({
        message: `Email '${userEmail}' not found!`,
        status: httpStatus.CONFLICT
      }));


    const userPassword = funcsUtils.generatePassword();

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const transporter = nodemailer.createTransport({
      host: email.host,
      port: 2525,
      auth: {
        user: email.user,
        pass: email.pass
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Torterra" <${email.from}>`,
      to: checkUser.email,
      subject: "Reset Password",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Torterra - Reset Password</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td bgcolor="#50935e" style="text-align: center; font-family: Arial, sans-serif; font-size: 24px; padding: 40px 30px 40px 30px; color: #ffffff">
                      <b>Torterra</b>
                    </td>
                    </tr>
                    <tr>
                    <td bgcolor="#ffffff" style="color: #1a1f23; padding: 40px 30px 40px 30px; font-family: Arial, sans-serif; font-size: 16px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                        <td>
                          Access Credentials:
                        </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px 0 30px 0; font-size: 14px;">
                            <b>Email: </b>${checkUser.email} <br>
                            <b>Password:</b> ${userPassword}
                          </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    <tr>
                    <td bgcolor="#cfcfcf" style="color: #ffffff; padding: 15px 40px 15px 40px; text-align: center; font-family: Arial, sans-serif; font-size: 16px;" >
                      &copy;${new Date().getFullYear()} Torterra
                    </td>
                    </tr>
                  </table>
                </td>
                </tr>
              </table>
            </td>
          </tr>
          </table>
        </body>
        </html>`
    });

    const updateOps = {
      password: hashedPassword
    };

    await User.findOneAndUpdate({ _id: checkUser.id }, { $set: updateOps });
    const updatedUser = await User.findById(checkUser.id);
    //message: `A new mensage was send for your email: ${updatedUser.email}`,
    res.status(httpStatus.OK).jsonp({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
      createdAt: updatedUser.createdAt
    });
  } catch (err) {
    next(err);
  }
};

/**
 * User login 
 */
exports.login = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    // check if email exists
    const user = await User.findOne({ email: userEmail });
    if (!user)
      return next(new APIError({
        message: "Credenciais erradas!",
        status: httpStatus.BAD_REQUEST
      }));


    // check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return next(new APIError({
        message: "Credenciais erradas!",
        status: httpStatus.BAD_REQUEST
      }));

    
    // const expire = 1; // one day
    // var expireAt = new Date();
    // expireAt.setDate(expireAt.getDate() + expire);
    // expireAt = expireAt.getTime();
    //   console.log(expireAt);
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1 days' });

    res.status(httpStatus.OK).jsonp({
      message: "Auth Success!",
      authToken: token
    });

    /*var expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 1);
    console.log(expireAt);
    
    res.cookie('authToken', token, {
      expires: expireAt,
      secure: false, // set to true if your using https
      httpOnly: true,
    });
    res.status(httpStatus.OK).jsonp({
      message: "Auth Success!"
      // authToken: token 
    }); */

  } catch (err) {
    next(err);
  }
};

/**
 * Get all users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { query, options } = funcsUtils.queryParser(req.query);
    options.select = {
      name: 1,
      email: 1,
      role: 1,
      updatedAt: 1
    }
    const result = await User.paginate(query, options);
    res.status(200).jsonp(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Register users
 */
exports.register = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const userName = req.body.name;
    let userRole = parseInt(req.body.role) || roles.User;
    
    
    if (userRole !== roles.User && userRole !== roles.Admin) {
      userRole = roles.User;
    }
    
    const checkUser = await User.findOne({ email: userEmail });
    if (checkUser)
      return next(new APIError({
        message: `E-mail: '${userEmail}' already exists!`,
        status: httpStatus.CONFLICT
      }));


    const userPassword = funcsUtils.generatePassword();

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const transporter = nodemailer.createTransport({
      host: email.host,
      port: 2525,
      auth: {
        user: email.user,
        pass: email.pass
      }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Torterra" <${email.from}>`,
      to: userEmail,
      subject: "New User",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Torterra - New User</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                    <td bgcolor="#50935e" style="text-align: center; font-family: Arial, sans-serif; font-size: 24px; padding: 40px 30px 40px 30px; color: #ffffff">
                      <b>Torterra</b>
                    </td>
                    </tr>
                    <tr>
                    <td bgcolor="#ffffff" style="color: #1a1f23; padding: 40px 30px 40px 30px; font-family: Arial, sans-serif; font-size: 16px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                        <td>
                          New user, access credentials below:
                        </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px 0 30px 0; font-size: 14px;">
                            <b>Email: </b>${userEmail} <br>
                            <b>Password:</b> ${userPassword} <br>
                            <br>
                            <b>It is recommended that you change the password!</b>
                          </td>
                        </tr>
                      </table>
                      </td>
                    </tr>
                    <tr>
                    <td bgcolor="#cfcfcf" style="color: #ffffff; padding: 15px 40px 15px 40px; text-align: center; font-family: Arial, sans-serif; font-size: 16px;" >
                      &copy;${new Date().getFullYear()} Torterra
                    </td>
                    </tr>
                  </table>
                </td>
                </tr>
              </table>
            </td>
          </tr>
          </table>
        </body>
        </html>
      `
    });

    const user = new User({
      _id: mongoose.Types.ObjectId(),
      name: userName,
      email: userEmail,
      password: hashedPassword,
      role: userRole
    });

    const savedUser = await user.save();

    res.status(httpStatus.CREATED).jsonp({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Path users
 */
exports.patchUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    const updateOps = {};
    if (req.body.name)
      updateOps.name = req.body.name.trim();

    const currentUser = await User.findById(req.user.userId);
    const result = await User.findById(id);

    if (req.body.role != undefined && Number.isInteger(req.body.role) && (currentUser.role === roles.Root || currentUser.role === roles.Admin)) {
      updateOps.role = req.body.role;
    }

    if (req.body.password != undefined) {
      const newPassword = req.body.password;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      updateOps.password = hashedPassword;
    }
    
    if (!result)
      return next(new APIError({
        message: "User not found!",
        status: httpStatus.NOT_FOUND
      }));

    await User.findById(id).updateOne({ _id: id }, { $set: updateOps });
    const updateUser = await User.findById(id).select({
      "_id": 1,
      "name": 1,
      "role": 1,
      "email": 1,
      "updatedAt": 1
    });
    res.status(httpStatus.OK).jsonp(updateUser);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete user  
 */
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await User.findById(id);

    if (!result)
      return next(new APIError({
        message: "User not found!",
        status: httpStatus.NOT_FOUND
      }));
    
    const currentUser = await User.findById(req.user.userId);
    if (id === String(currentUser._id) || currentUser.role === roles.Root) { // root and  himselfs delets user accounts
        const deleteUser = await User.remove({ _id: id });
        res.status(httpStatus.OK).jsonp({
          docs: deleteUser
        });
    } else {
      return next(new APIError({
        message: "You don't have permissions!",
        status: httpStatus.UNAUTHORIZED
      }));
    }


  } catch (err) {
    next(err);
  }
};

/**
 * Current user info
 */
exports.getUserInfo = async (req, res, next) => {
  try {
    const result = await User.findById(req.user.userId);
    res.status(200).jsonp({
      _id: result._id,
      name: result.name,
      email: result.email,
      role: result.role
    });
  } catch (err) {
    next(err);
  }
};


/* exports.updatePassword = async (req, res, next) => {
  try {
    const logedUserId = req.user.userId;
    const logedUser = await User.findOne({ _id: logedUserId });
    if (!logedUser)
      return next(new APIError({
        message: "Utilizador não encontrado!",
        status: httpStatus.BAD_REQUEST
      }));


    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    // check if password is correct
    const validPassword = await bcrypt.compare(oldPassword, logedUser.password);
      console.log("AA");
    if (!validPassword)
      return next(new APIError({
        message: "Old user password are wrong!",
        status: httpStatus.BAD_REQUEST
      }));


    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateOps = {
      password: hashedPassword
    };

    await User.findById(logedUser.id).updateOne({ _id: logedUser.id }, { $set: updateOps });
    const updatedUser = await User.findById(logedUser.id);
    res.status(httpStatus.OK).jsonp({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
      createdAt: updatedUser.createdAt
    });
  } catch (err) {
    next(err);
  }
}; */




