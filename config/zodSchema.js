import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .regex(/^[A-Za-z]+$/, "Only letters are allowed")
    .min(3, { message: "Username muust be atleast 3 character" })
    .max(15, { message: "Username must be less than 15 character" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 character" })
    .max(20, { message: "Password must be less than 20 character" }),
  isAlumni: z.boolean().optional(),
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
    enrollmentNumber: z.string().regex(/^\d+$/, "Only numbers are allowed").optional(),
    skills: z.array(z.string().regex(
        /^[a-zA-Z0-9,\s]+$/,
        "Skills must be plain text with letters, numbers, and commas only"
      ).transform((str) => str.trim())).optional(),

    basic: z
      .object({
        firstName: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("First name is required").optional(),
        lastName: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("last name is requried").optional(),
        username: z.string().regex(/^[A-Za-z]+$/, "Only letters are allowed").nonempty("Username is required").optional(),
        email: z.string().email("Invalid email address").optional(),
        mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits").optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        userType: z.enum(["ALUMNI", "STUDENT"]).optional(),
        course: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("Course is required").optional(),
        courseSpecialization: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
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
        course: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("Course is required").optional(),
        qualification: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .nonempty("Qualification is required")
          .optional(),
        college: z.string().regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed").nonempty("College name is required").optional(),
        courseType: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .nonempty("Course type cannot be empty")
          .optional(),
        percentage: z
          .number()
          .min(0, "Percentage cannot be less than 0")
          .max(100, "Percentage cannot be greater than 100")
          .optional(),
        cgpa: z
          .number()
          .min(0, "CGPA cannot be less than 0")
          .max(10, "CGPA cannot be greater than 10")
          .optional(),
        rollNumber: z
          .string()
          .regex(/^\d+$/, "Only numbers are allowed")
          .nonempty("roll number can not be empty")
          .optional(),
        specialization: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .nonempty("Course specialization is required")
          .optional(),
        duration: z
          .object({
            startYear: z.string().nonempty("StartDate is required").optional(),
            endYear: z.string().optional("End date is required").optional(),
          }).optional()
      }).strict({
        message: "Request body contains invalid fields"
      })),

      workExperience: z
    .record(
      z.string(), 
      z.object({
        designation: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .nonempty("Designation is required")
          .optional(),
        organisation: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .nonempty("Company name is required")
          .optional(),
        employmentType: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .nonempty("Employment type is required")
          .optional(),
        startDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
          .nonempty("Start date is required")
          .optional(),
        endDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
          .optional(),
        currentlyWorking: z.boolean().optional(),
        location: z
          .string()
          .regex(/^[A-Za-z\s]+$/, "Only plain text (letters and spaces) is allowed")
          .optional(),
        remote: z.boolean().optional(),
        skills: z
          .array(
            z
              .string()
              .regex(/^[a-zA-Z0-9,\s]+$/, "Skills must be plain text with letters, numbers, and commas only")
          )
          .optional(),
        description: z
          .string()
          .regex(/^[a-zA-Z0-9,\s]+$/, "Only letters, numbers, spaces, and commas are allowed")
          .optional(),
      })
    )
    .optional()
 })
      