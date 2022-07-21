import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from '../model/User.js';

export const getAllBlogs = async (req, res, next) => {
   let blogs;
   try {
        blogs = await Blog.find();

   } catch (error) {
        console.log(error);
   }
    if(!blogs){
        return res.status(404).json({message: "No blogs found"});
    }
    return res.status(200).json({blogs});
}

export const addBlog = async (req, res, next) => {
     const {title, description, image, user} = req.body;

     let existingUser;

     try {
          existingUser = await User.findById(user);
     } catch (error) {
          console.log(error);
     }

     if(!existingUser){
          return res.status(404).json({message: "User not found"});
     }

     let newBlog = new Blog({
          title,
          description,
          image,
          user
     });
    
     try {
          const session = await mongoose.startSession();
          session.startTransaction();
          await newBlog.save({session});
          existingUser.blogs.push(newBlog);
          await existingUser.save({session});
          await session.commitTransaction();
     } catch (error) {
          console.log(error);
          return res.status(500).json({message: "Something went wrong"});
     }
     if(!newBlog){
          return res.status(500).json({message: "Something went wrong"});
     }
     return res.status(201).json({newBlog});
}

export const updateBlog = async (req, res, next) => {
     const {title, description, image, user} = req.body;
     let updatedBlog;
     try {
          updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
               title,
               description,
               image,
               user
          });
     } catch (error) {
          console.log(error);
     }
     if(!updatedBlog){
          return res.status(500).json({message: "Something went wrong"});
     }
     return res.status(200).json({updatedBlog});
}

export const getBlogById = async (req, res, next) => {
     let blog;
     try {
          blog = await Blog.findById(req.params.id);
     } catch (error) {
          console.log(error);
     }
     if(!blog){
          return res.status(404).json({message: "No blog found"});
     }
     return res.status(200).json({blog});
}

export const deleteBlog = async (req, res, next) => {
     const id = req.params.id;

     let blog;
     try {
       blog = await Blog.findByIdAndRemove(id).populate("user");
       await blog.user.blogs.pull(blog);
       await blog.user.save();
     } catch (err) {
       console.log(err);
     }
     if (!blog) {
       return res.status(500).json({ message: "Unable To Delete" });
     }
     return res.status(200).json({ message: "Successfully Delete" });
}

export const getByUserId = async (req, res, next) => {
     const userId = req.params.id;
     let userBlogs;
     try {
       userBlogs = await User.findById(userId).populate("blogs");
     } catch (err) {
       return console.log(err);
     }
     if (!userBlogs) {
       return res.status(404).json({ message: "No Blog Found" });
     }
     return res.status(200).json({ user: userBlogs });
};
   