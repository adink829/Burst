import React, { Component } from 'react'
import questions from './questions'
import Answers from './answers'
import Prompt from './prompt'
import Topics from './topics'
import SourcesMenu from './sources-menu'
import { updateUserThunk } from '../store/user'
import { connect } from 'react-redux'

class Quiz extends Component {
  constructor() {
    super()
    this.state = {
      questions: [],
      score: 0,
      question: {},
      count: 0,
      hasSubmittedQuiz: false,
      hasSubmittedSources: false,
      hasSubmittedTopics: false,
      sources: [],
      topics: [],
      currentSource: 0,
      currentSourceName: '',
      sourceNames: [],
      currentId: 0
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    try {
      await this.setState({
        questions,
        question: questions[0]
      })
    } catch (err) {
      console.err(err.message)
    }
  }

  async handleSubmit(evt) {
    try {
      evt.preventDefault()
    } catch (err) {
      console.error(err.message)
    }
  }

  handleChange(evt) {
    this.setState({
      currentSourceName: evt.target.value
    })
  }

  async handleClick(evt) {
    //update score on state with question value if in quiz portion
    if (!this.state.hasSubmittedQuiz) {
      this.setState({
        score: (this.state.score += +evt.target.value),
        count: (this.state.count += 1)
      })
      //keep displaying quiz questions until end of questions array
      if (this.state.count < this.state.questions.length) {
        this.setState({ question: questions[this.state.count] })
      } else {
        //if question number is same as length, questions are finished and quiz is submitted
        let finalScore = Math.round(this.state.score / 2)
        this.setState({ score: finalScore, hasSubmittedQuiz: true })
      }
      //if quiz is submitted, but topics haven't been submitted, show topics component
    } else if (this.state.hasSubmittedQuiz && !this.state.hasSubmittedTopics) {
      if (evt.target.name === 'submit') {
        this.setState({ hasSubmittedTopics: true })
      } else {
        !this.state.topics.includes(evt.target.value)
          ? this.setState({
            topics: [...this.state.topics, evt.target.value]
          })
          : this.setState({
            topics: this.state.topics.filter(topic => {
              if (topic !== evt.target.value) return topic
            })
          })
      }
    } else if (!this.hasSubmittedSources && evt.target.name === 'add-source') {
      await this.setState({
        sourcesNames: [...this.state.sourceNames, this.state.currentSourceName]
      })
      await this.setState({ currentSource: 0 })
      //add current source on state to all sources array
    } else {
      await this.props.updateUserThunk({
        arrayOfSources: this.state.sources,
        arrayOfTopics: this.state.topics,
        poliOriId: this.state.score,
        userId: this.props.user.id
      })
      this.setState({ hasSubmittedSources: true })
      this.props.history.push(`/news/${this.props.user.id}`)
    }
  }
  //update question on state, so view changes

  render() {
    if (!this.state.hasSubmittedQuiz) {
      const question = this.state.question
      return (
        <div id={question.id}>
          <Prompt prompt={question.prompt} />
          <Answers
            answers={question.answers}
            handleClick={this.handleClick}
            handleSubmit={this.handleSubmit}
          />
        </div>
      )
    } else if (this.state.hasSubmittedQuiz && this.state.hasSubmittedTopics) {
      return (
        <SourcesMenu
          handleClick={this.handleClick}
          handleChange={this.handleChange}
          sourceNames={this.state.sourceNames}
          sources={this.state.sources}
        />
      )
    } else {
      return <Topics handleClick={this.handleClick} />
    }
  }
}

const mapState = state => ({
  user: state.user
})
const mapDispatch = dispatch => {
  return {
    updateUserThunk: userPrefObj => dispatch(updateUserThunk(userPrefObj))
  }
}

export default connect(
  mapState,
  mapDispatch
)(Quiz)
