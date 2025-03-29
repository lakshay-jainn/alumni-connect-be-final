import { prisma } from "../libs/prisma.js";
import { generateResetToken, setUser, verifyResetToken } from "../services/jwt.js";
import { compare, hash } from "bcrypt";
import { sendEmail } from "../services/email.js";
import { deQueue } from "../jobs/emailJob.js";

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
        email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found with this email" });
    }

    const token = await generateResetToken(user.id,user.password);

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password?token=${token}`;

    const message = `
      <p>You requested a password reset. Click the link below to continue:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    // email service
    const options = {
      email: user.email,
      subject: "Password changed request received",
      message,
    }

    sendEmail(options);
    deQueue(options)

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send reset link", error, e: error.message });
  }
}

export async function handleUserResetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    const decoded = await verifyResetToken(token);

    if(!decoded) {
      return res.status(400).json({message: "Invalid token"})
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
    });

    if (!user || user.password !== decoded.hash) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id: user.id
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed", error, e: error.message });
  }
}
