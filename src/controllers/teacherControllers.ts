import { Request, Response } from "express";
import Teacher from "../models/teachersSchema";
import bcrypt from "bcryptjs";
import Activity from "../models/activitiesSchema";

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email: email });

    if (existingTeacher) {
      return res.status(400).json({
        message: "Teacher already exists with this email.",
        registration: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new teacher
    const newTeacher = new Teacher({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false, // Set default verification status
    });

    // Save the new teacher to the database
    await newTeacher.save();

    // Respond with success
    res.status(201).json({
      message: "Teacher registered successfully.",
      registration: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
      registration: false,
    });
  }
};


export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const user: any = await Teacher.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Invalid username", login: false });
      }
  
      // Verify password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid password", login: false });
      }
  
      // If username and password are correct, generate a token
      const token = user.generateAuthToken(user._id);
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        token: token,
        login: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  

// Create a new activity
export const createActivity = async (req: any, res: Response) => {
  const { activityName, steps, expectedOutCome } = req.body;

  console.log("Req.body ")
  const teacher = req.user._id
  try {
    const newActivity = new Activity({
      activityName,
      steps,
      expectedOutCome,
      teacher,
    });

    await newActivity.save();

    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
      success:true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create activity"
    });
  }
};

// Get all activities
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate("teacher", "fullName email");

    res.status(200).json({
      message: "Activities retrieved successfully",
      activities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve activities"
    });
  }
};

// Get a single activity by ID
export const getActivityById = async (req: any, res: Response) => {
  const { id } = req.user;

  try {
    const activity = await Activity.findById(id).populate("teacher", "fullName email");

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    res.status(200).json({
      message: "Activity retrieved successfully",
      activity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve activity"
    });
  }
};

// Update an activity by ID
export const updateActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { activityName, steps, expectedOutCome, teacher } = req.body;

  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { activityName, steps, expectedOutCome, teacher },
      { new: true, runValidators: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update activity"
    });
  }
};

// Delete an activity by ID
export const deleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    res.status(200).json({
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete activity"
    });
  }
};

