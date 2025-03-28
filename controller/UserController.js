import { prisma } from "../libs/prisma.js";
import { setUser } from "../services/auth.js";
import { compare, hash, genSalt } from "bcrypt";
import {v4} from "uuid"
import { checkDateHourDiff } from "../utils/moment.js";

export async function handleUserSignupController(req, res) {
  try {
    const { username, email, password, isAlumni } = req.body;
    const exsistingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (exsistingUserByEmail) {
      return res.status(400).json({
        user: null,
        message: "User exists with same email",
      });
    }
    const exsistingUserByUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (exsistingUserByUsername) {
      return res.status(400).json({
        user: null,
        message: "User exists with the same username",
      });
    }
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        role: isAlumni ? "ALUMNI" : "STUDENT",
      },
    });

    if (user.role === "ALUMNI") {
      await prisma.alumniProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else if (user.role === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    const token = setUser(user);

    res.status(201).json({ token, message: "User succesfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
}

export async function handleUserLoginController(req, res) {
  //validate user like password length and any other thing
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordvalid = await compare(password, user.password);

    if (!isPasswordvalid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = setUser(user);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong from our side" });
  }
}

export async function handleUserForgetPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found with this email" });
    }

    const gibrish = await genSalt(10)

    const token = await hash(v4(), 12)
    
    const url = `http://localhost:5173/reset-password?token=${token}`
    // email service

    await prisma.user.update({
      where: {email},
      data: {
        passwordResetToken: token,
        tokenSendAt: new Date().toISOString()
      }
    })
    console.log("password link", url)
    res.status(200).json({message: "Password reset link sent successfully"})

  } catch (error) {
    res.status(500).json({message: "Failed to send reset link"})
  }
}

export async function handleUserResetPassword(req,res) {
  try {
    const {token, newPassword} = req.body;
    console.log("from 134",token)
    const resetToken = await prisma.user.findUnique({
      where: {
        passwordResetToken: token
      }
    })
    console.log("from 140",resetToken)

    if(!resetToken) {
      return res.status(400).json({message: "Invalid or expired token"})
    }

    // Checking difference 2h
    const hoursDiff = checkDateHourDiff(resetToken.tokenSendAt)
    if(hoursDiff > 2) {
      return res.status(422).json({
        message: "Token expired"
      })
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        tokenSendAt: null
      },
      where: {
        email: resetToken.email
      }
    })

    res.status(200).json({message: "Password reset successfully"})

  } catch (error) {
    res.status(500).json({message: "Failed" , error , e : error.message})
  }
}
