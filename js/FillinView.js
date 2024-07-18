import QuestionView from 'core/js/views/questionView';

class FillinView extends QuestionView {
  preinitialize() {
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  setupQuestion() {
    if (this.model.get('_isSubmitted')) return;
    this.model.setupRandomisation();
  }

  onQuestionRendered() {
    this.setReadyStatus();
  }

  showCorrectAnswer() {
    this.model.set('_isCorrectAnswerShown', true);
    this.model.setWordWithBlanks();
  }

  hideCorrectAnswer() {
    this.model.set('_isCorrectAnswerShown', false);
    this.model.setWordWithBlanks();
  }

  onItemSelect(item) {
    this.model.updateWordWithBlanks(item);
  }
}

FillinView.template = 'fillin.jsx';

export default FillinView;
