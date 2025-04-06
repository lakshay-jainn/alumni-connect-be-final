import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .regex(/^[A-Za-z0-9]+$/, {
      message: "Only letters and numbers are allowed. No spaces or special characters.",
    })
    .min(2, { message: "Username muust be atleast 3 character" })
    .max(15, { message: "Username must be less than 15 character" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(5, { message: "Password must be atleast 5 character" })
    .max(20, { message: "Password must be less than 20 character" }),
  isAlumni: z.boolean().optional(),
  firstName: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
    .nonempty("First name is required"),
  lastName: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
    .nonempty("Last name is required")
    .optional(),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 character" })
    .max(20, { message: "Password must be less than 20 character" }),
});

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 character" })
    .max(20, { message: "Password must be less than 20 character" }),
  token: z.string(),
});

export const baseProfileSchema = z
  .object({
    profileCompletionPercentage: z.string().regex(/^(100|[1-9]?[0-9])%$/, {
      message: "Must be a percentage between 0% and 100%",
    }).optional(),
    enrollmentNumber: z.string().regex(/^[A-Za-z0-9]+$/, {
      message: "Only letters and numbers allowed. No spaces or special characters.",
    }).optional(),
    skills: z.array(z.string().regex(
        /^[a-zA-Z0-9,\s]+$/,
        "Skills must be plain text with letters, numbers, and commas only"
      ).transform((str) => str.trim())).optional(),

    basic: z
      .object({
        firstName: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("First name is required").optional(),
        lastName: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("last name is requried").optional(),
        // username: z.string().regex(/^[A-Za-z0-9]+$/, {
        //   message: "Only letters and numbers are allowed. No spaces or special characters.",
        // }).nonempty("Username is required").optional(),
        // email: z.string().email("Invalid email address").optional(),
        mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits").optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        userType: z.enum(["ALUMNI", "STUDENT"]).optional(),
        course: z.string().nonempty("Course is required").optional(),
        courseSpecialization: z
          .string()
          .nonempty("Course specialization is required")
          .optional(),
      })
      .strict({
        message: "Request body contains invalid fields",
      })
      .optional(),

    about: z
      .string()
      .regex(/^[A-Za-z0-9\s.,!?'"()\-:]+$/, "Only letters, numbers, spaces, and common punctuation allowed")
      .min(5, {
        message: "30 characters minimum",
      })
      .max(1000, {
        message: "1000 characters maximum",
      })
      .optional(),

      education: z
      .record(
        z.string(),
        z.object({
          course: z.string().nonempty("Course is required").optional(),
          qualification: z
            .string()
            .nonempty("Qualification is required")
            .optional(),
          college: z.string().nonempty("College name is required").optional(),
          courseType: z
            .string()
            .nonempty("Course type cannot be empty")
            .optional(),
          percentage: z
            .string()
            .regex(/^(100|[1-9]?[0-9])%$/, {
              message: "Must be a percentage between 0% and 100%",
            })
            .optional(),
          cgpa: z
            .string()
            .regex(/^10$|^([0-9])$/, {
              message: "Value must be a number between 0 and 10 ",
            })
            .optional(),
          rollNumber: z
            .string()
            .regex(/^\d+$/, "Only numbers are allowed")
            .nonempty("roll number can not be empty")
            .optional(),
          specialization: z
            .string()
            .nonempty("Course specialization is required")
            .optional(),
          duration: z
            .object({
              startYear: z.string().nonempty("StartDate is required").optional(),
              endYear: z.string().optional("End date is required").optional(),
            }).optional()
        }).strict({
          message: "Request body contains invalid fields"
        }).optional()).optional(),
      workExperience: z
    .record(
      z.string(), 
      z.object({
        designation: z
          .string()
          .nonempty("Designation is required")
          .optional(),
        organisation: z
          .string()
          .nonempty("Company name is required")
          .optional(),
        employmentType: z
          .string()
          .nonempty("Employment type is required")
          .optional(),
        startDate: z
          .string()
          .nonempty("Start date is required")
          .optional(),
        endDate: z
          .string()
          .nonempty("End date is required")
          .optional(),
        currentlyWorking: z.boolean().optional(),
        location: z
          .string()
          .optional(),
        remote: z.boolean().optional(),
        skills: z.array(z.string().regex(
          /^[a-zA-Z0-9,\s]+$/,
          "Skills must be plain text with letters, numbers, and commas only"
        ).transform((str) => str.trim())).optional(),  
        description: z
          .string()
          .regex(/^[a-zA-Z0-9,\s]+$/, "Only letters, numbers, spaces, and commas are allowed")
          .optional(),
      })
    )
    .optional()
 })
      