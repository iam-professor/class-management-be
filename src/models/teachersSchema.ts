import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface ITeacher {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  isVerified: boolean;
}

const teacherSchema = new Schema<ITeacher>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.methods.generateAuthToken = function (userId: string): string {
  const jwtSecret = process.env.JWT_SECRETE;
  if(!jwtSecret){
    throw new Error('jwt secrete is not defined.')
  }
  return jwt.sign({ _id: userId }, jwtSecret, { expiresIn: "200d" });
};

const Teacher = model<ITeacher>("teachers", teacherSchema);

export default Teacher;
