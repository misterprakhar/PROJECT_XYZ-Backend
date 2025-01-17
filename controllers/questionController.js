const User = require("../models/userModel");
const Question = require("../models/questionModel")
const Comment = require("../models/commentModel")
const Answer = require("../models/answerModel")

module.exports.createQuestion = async (req,res) => {
    try{
        const {userId, img, title, description} = req.body;
        const question = await Question.create({
            userId,
            img,
            title,
            description
        })
        const user = await User.findById(userId);
        user.questions.push(question._id);
        await user.save();
        res.json({ message: "Question Created sucessfully", status: true, question });
    }catch(error){
        console.log(error);
    }
}

module.exports.updateQuestion = async (req,res) => {
    try{
        const {userId, questionId} = req.params
        const {img, title, description} = req.body;
        const question = await Question.findById(questionId);
        if(question.userId == userId){
            const questionUp = await Question.findByIdAndUpdate(question, {
                img,
                title,
                description
            },{new: true})
            res.send({message: "Question Updated successfully", status: true, questionUp})
        }
        else{
            res.send({message: "You are not authorised to perform this action", status: false})
        }
    }catch(error){
        console.log(error)
    }
}


module.exports.deleteQuestion = async (req, res) => {
  try {
    const { userId, questionId } = req.params;
    const question = await Question.findById(questionId);
    if (question.userId == userId) {
      await User.findByIdAndUpdate(userId, { $pull: { questions: questionId } });
      await Question.findByIdAndDelete(questionId);

      res.json({ message: "Question Deleted sucessfully", status: true });
    } else {
      res.json({
        message: "You are not authorized to perform this action",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.allQuestions = async (req, res) => {
  try {
    const question = await Question.find({}).populate({
      path: "answers",
      populate: { path: "comments"}
    });
    res.json({ message: "sucessful", status: true, question });
  } catch (error) {
    console.log(error);
  }
};


module.exports.newAnswer = async (req,res) => {
  try{
    const {userId, questionId} = req.params;
    
    const question = await Question.findById(questionId);
    if(question){
      const { body } = req.body;
    const answer = await Answer.create({body});
    console.log(answer._id);
    question.answers.push(answer._id);
    answer.author = userId
   await answer.save();
    const ques = await question.save();
    
    res.json({
      message: "Answer Created sucessfully",
      status: true,
      answer,
    });}else{
      res.json({ mesage: "Question doesn't exists", status: false });
    }
  }catch(error){
    console.log(error);
  }
}

module.exports.updateAnswer=async(req,res)=>{
  try {
    const {questionId,answerId,userId}=req.params
  const answer=await Answer.findById(answerId)
  const question=await Question.findById(questionId)
  if(answer && question && (answer.author==userId)){
    const{ body }= req.body;
    answer.body=body;
    await answer.save();
    res.json({ message: "Answer Updated sucessfully", status: true });
  }else{
    res.json({message:"Answer or Question doesn't exists",status:false})
  }
}catch(error){
    console.log(error)
    res.json({message:error.meesage,status:false})
  }
}