const Post = require('../models/postModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const Question = require('../models/questionModel')
const Answer = require('../models/answerModel')
const AnsComment = require('../models/ansCommentModel')

module.exports.newComment = async (req, res) => {
  try {
    const { userId, postId } = req.params
    const post = await Post.findById(postId)
    if (post) {
      const { body } = req.body
      const comment = await Comment.create({ body })
      comment.author = userId
      post.comments.push(comment._id)
      await comment.save()
      const pst = await post.save()
      if (pst)
        res.json({ message: 'comment created sucessfully', status: true })
    } else {
      res.json({ mesage: "Post doesn't exists", status: false })
    }
  } catch (error) {
    console.log(error)
    res.json({ mesage: 'Comment unsucessful', status: false })
  }
}

module.exports.updateComment = async (req, res) => {
  try {
    const { postId, commentId, userId } = req.params
    const comment = await Comment.findById(commentId)
    const post = await Post.findById(postId)
    if (comment && post && comment.author == userId) {
      const { body } = req.body
      comment.body = body
      await comment.save()
    } else {
      res.json({ message: "Post or comment doesn't exists", status: false })
    }
  } catch (error) {
    console.log(error)
    res.json({ message: error.meesage, status: false })
  }
}

module.exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId, userId } = req.body
    const post = await Post.findById(postId)
    const comment = await Comment.findById(commentId)
    if (
      comment &&
      post &&
      (post.userId == userId || comment.author == userId)
    ) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: commentId },
      })
      await Comment.findByIdAndDelete(commentId)
      res.json({ message: 'comment deleted sucessfully', status: true })
    } else
      res.json({ message: "Post or comment doesn't exists", status: false })
  } catch (error) {
    console.log(error)
    res.json({ message: error.meesage, status: false })
  }
}

//ansCommentController

module.exports.newAnsComment = async (req, res) => {
  try {
    const { userId, questionId, answerId } = req.params
    const question = await Question.findById(questionId)
    const answer = await Answer.findById(answerId)
    if (question) {
      const { body } = req.body
      const comment = await AnsComment.create({ body })
      comment.author = userId
      comment.question = questionId
      comment.answer = answerId
      answer.comments.push(comment._id)
      await comment.save()

      const ans = await answer.save()

      if (ans)
        res.json({ message: 'comment created sucessfully', status: true })
    } else {
      res.json({ mesage: "Question or Answer doesn't exists", status: false })
    }
  } catch (error) {
    console.log(error)
    res.json({ mesage: 'Comment unsucessful', status: false })
  }
}

module.exports.updateAnsComment = async (req, res) => {
  try {
    const { userId, questionId, answerId, commentId } = req.params
    const question = await Question.findById(questionId)
    const answer = await Answer.findById(answerId)
    const comment = await AnsComment.findById(commentId)

    if (question && answer && comment.author == userId) {
      const { body } = req.body
      comment.body = body
      await comment.save()
      res.json({ message: 'Comment Updated Sucessfully', status: true })
    } else {
      res.json({ message: "Question or Answer doesn't exists", status: false })
    }
  } catch (error) {
    console.log(error)
    res.json({ message: error.meesage, status: false })
  }
}
