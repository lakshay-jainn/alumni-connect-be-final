import { prisma } from "../libs/prisma.js";
import { generateResetToken, setUser, verifyResetToken } from "../services/jwt.js";
import { compare, hash } from "bcrypt";
import { sendEmail } from "../services/email.js";
import { signUpSchema,signInSchema,forgetPasswordSchema, resetPasswordSchema} from "../config/zodSchema.js";

export async function handleUserSignupController(req, res) {
  try {

    // const { username, email, password, isAlumni } = req.body;
    

    const validatedBody = signUpSchema.parse(req.body);

    const { username, email, password, isAlumni } = validatedBody;

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

    await prisma.profile.create({
      data: {
        userId: user.id,
        role: isAlumni ? "ALUMNI" : "STUDENT",
      },
    })

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
  //validate user like password length and any other thing like capatlisation
  //validate email format
  try {
    const validatedBody = signInSchema.parse(req.body);
    const { email, password } = validatedBody;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

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
    const validatedBody = forgetPasswordSchema.parse(req.body);
    const { email } = validatedBody;

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

    //sending mail but not waiting for it to finish
    sendEmail(options);
    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send reset link", error, e: error.message });
  }
}

export async function handleUserResetPassword(req, res) {
  try {
    const validatedBody = resetPasswordSchema.parse(req.body);
    const { token, newPassword } = validatedBody;

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

