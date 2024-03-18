const messageModel = require("../models/messageModel");
const usermodel = require("../models/usermodel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const senderUser = await usermodel.findById(from); // Assuming UserModel is your user model
    if (!senderUser) {
      return res.status(400).json({ msg: "Sender user not found." });
    }

    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: senderUser,
    });

    if (data) {
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    console.error("Error adding message:", ex);
    next(ex); // Pass the error to the error handling middleware
  }
};




module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
}