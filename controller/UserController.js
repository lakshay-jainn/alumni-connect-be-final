import { prisma } from "../libs/prisma.js";
import { setUser } from "../service/auth.js";
import { compare, hash } from "bcrypt";

export async function handleUserSignup(req, res) {
  const { username, email, password } = req.body;

  try {
    const exsistingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exsistingUserByEmail) {
      return res.json({
        user: null,
        message: "User exists same email",
      });
    }

    const exsistingUserByUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (exsistingUserByUsername) {
      return res.json({
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
      },
    });
    const token = setUser(user);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 3600000, // 1 hour
    });
    res.send("Data inserted");
  } catch (error) {
    console.log(error);
    res.send("not worked");
  }
}

export async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  //validate user like password length and any other thing

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordvalid = compare(password , user.password);

    if(!isPasswordvalid){
      return res.status(404).json({message: "Incorrect password"});
    }

    const token = setUser(user);

    // res.json({token}) // if we use header 
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    res.send(true);
  } catch (error) {
    console.log("Error while query", error);
  }
}
