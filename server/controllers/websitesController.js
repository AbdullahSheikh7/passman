import Website from "../models/websiteModel.js"
import Auth from "../models/authModel.js";

export const getAllAuthsController = async (req, res) => {
  try {
    const websites = await Website.find({}).populate("auths")

    return res.status(200).json({
      count: websites.length,
      data: websites,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
}

export const addAuthController = async (req, res) => {
  try {
    if (!req.body.website || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: 'Send all required fields: website, email and password',
      });
    }

    const result = await Website.addNewAuth(req.body.website, req.body.email, req.body.password);

    return res.status(201).json(result);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
}

export const editOneAuthController = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        message: 'Send all required fields: email and password',
      });
    }

    const { id } = req.params;
    const { email, password } = req.body

    await Auth.updateOne(id, email, password);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}

export const deleteAuthController = async (req, res) => {
  try {
    const { id } = req.params
    await Auth.deleteOne(id)
    return res.status(200).json({ message: "Password deleted successfully" })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}

export const deletePasswordController = async (req, res) => {
  try {
    const { id } = req.params
    await Website.deleteAll(id)
    return res.status(200).json({ message: "Password deleted successfully" })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}
