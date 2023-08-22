import ItemsQuestionModel from 'core/js/models/itemsQuestionModel';
import ItemModel from 'core/js/models/itemModel';
export default class FillinModel extends ItemsQuestionModel {
  setUpItems() {
    const distractors = this.get('_distractors') || [];
    const text = this.get('text') || '';
    const correctResponses = [];
    const _items = text.match(/\[.*?\]/g).map((word, index) => {
      const text = word.replace(/\[|\]/g, '');
      correctResponses.push({ index, text });
      return {
        _index: index,
        text,
        _shouldBeSelected: true,
        _isPartlyCorrect: false,
        _isActive: false
      };
    });
    this.set({ correctResponses, _selectable: correctResponses.length, _isRandom: true });

    distractors.forEach((distractor, index) => {
      _items.push({
        _index: _items.length + index,
        text: distractor,
        _shouldBeSelected: false,
        _isPartlyCorrect: false,
        _isActive: false
      });
    });

    const wordsWithBlanks = text.split(' ').map((word) => {
      const wordWithBlank = {
        _index: -1,
        type: 'text',
        text: word,
        _isActive: true
      };
      if (word.includes('[')) {
        wordWithBlank.type = 'blank';
        wordWithBlank.text = '';
        wordWithBlank._isActive = false;
      }
      return wordWithBlank;
    });

    this.setChildren(new Backbone.Collection(_items, { model: ItemModel }));

    this.set({ _wordsWithBlanks: wordsWithBlanks });
  }

  canSubmit() {
    const activeItems = this.getActiveItems();
    return activeItems.length === this.get('_selectable');
  }

  restoreUserAnswers() {
    if (!this.get('_isSubmitted')) return;

    const itemModels = this.getChildren();
    const userAnswer = this.get('_userAnswer');
    userAnswer.forEach((index, count) => {
      const itemModel = itemModels.find((item) => item.get('_index') === index);
      itemModel.toggleActive(true);

      const wordsWithBlanks = this.get('_wordsWithBlanks');
      const indexBlank = wordsWithBlanks.findIndex((item) => item._index === index);
      wordsWithBlanks[indexBlank] = {
        _index: index,
        text: itemModel.get('text'),
        type: 'blank',
        _isActive: true
      };
      const correctResponse = this.get('correctResponses').find((correctResponse) => correctResponse.index === index);

      if (!correctResponse) return;
      const isCorrect = count === correctResponse.index || correctResponse.text.toUpperCase() === this.getItem(count).get('text').toUpperCase();
      itemModel.set('_shouldBeSelected', isCorrect);
    });

    this.setQuestionAsSubmitted();
    this.markQuestion();
    this.setScore();
    this.setupFeedback();
  }

  storeUserAnswer() {
    const wordsWithBlanks = this.get('_wordsWithBlanks');
    this.set(
      '_userAnswer',
      wordsWithBlanks.filter((item) => item.type === 'blank' && item._index !== -1).map((item) => item._index)
    );
  }

  setWordWithBlanks() {
    if (this.get('_isCorrectAnswerShown')) {
      let index = 0;
      const wordsWithBlanks = this.get('text')
        .split(' ')
        .map((word) => {
          const wordWithBlank = {
            _index: -1,
            type: 'text',
            text: word,
            _isActive: true
          };
          if (word.includes('[')) {
            wordWithBlank.type = 'blank';
            wordWithBlank.text = this.get('correctResponses')[index].text;
            wordWithBlank._isActive = true;
            index++;
          }
          return wordWithBlank;
        });
      this.set('_wordsWithBlanks', wordsWithBlanks);
    } else {
      const userAnswer = this.get('_userAnswer');
      let index = 0;
      const wordsWithBlanks = this.get('text')
        .split(' ')
        .map((word) => {
          const wordWithBlank = {
            _index: -1,
            type: 'text',
            text: word,
            _isActive: true
          };
          if (word.includes('[')) {
            wordWithBlank.type = 'blank';
            wordWithBlank.text = this.getItem(userAnswer[index]).get('text');
            wordWithBlank._isActive = true;
            index++;
          }
          return wordWithBlank;
        });
      this.set('_wordsWithBlanks', wordsWithBlanks);
    }
  }

  updateWordWithBlanks(item) {
    const itemModel = this.getItem(item._index);
    const shouldSelect = !itemModel.get('_isActive');
    const wordsWithBlanks = this.get('_wordsWithBlanks');
    const wordsWithBlanksCopy = [...wordsWithBlanks];
    const indexBlank = shouldSelect
      ? wordsWithBlanksCopy.findIndex((item) => item.text === '')
      : wordsWithBlanksCopy.findIndex((item) => item._index === itemModel.get('_index'));

    if (indexBlank === -1) {
      const lastActiveItem = this.getLastActiveItem();

      lastActiveItem.toggleActive(false);

      const indexLastActiveItem = wordsWithBlanksCopy.findIndex((item) => item._index === lastActiveItem.get('_index'));
      wordsWithBlanksCopy[indexLastActiveItem] = {
        _index: -1,
        text: '',
        type: 'blank',
        _isActive: false
      };
      wordsWithBlanksCopy[wordsWithBlanksCopy.findIndex((item) => item.text === '')] = {
        _index: itemModel.get('_index'),
        text: itemModel.get('text'),
        type: 'blank',
        _isActive: true
      };
      itemModel.toggleActive(shouldSelect);

      this.set('_wordsWithBlanks', wordsWithBlanksCopy);
    } else {
      const blank = {
        _index: shouldSelect ? itemModel.get('_index') : -1,
        text: shouldSelect ? itemModel.get('text') : '',
        type: 'blank',
        _isActive: shouldSelect
      };
      wordsWithBlanksCopy[indexBlank] = blank;
      this.set('_wordsWithBlanks', wordsWithBlanksCopy);
      itemModel.toggleActive(shouldSelect);
    }

    const blanks = wordsWithBlanksCopy.filter((item) => item.type === 'blank' && item._index !== -1);
    blanks.forEach((blank, index) => {
      const itemModel = this.getItem(blank._index);

      const correctResponse = this.get('correctResponses').find((correctResponse) => correctResponse.index === blank._index);
      if (!correctResponse) return;
      const isCorrect = index === correctResponse.index || correctResponse.text.toUpperCase() === this.getItem(index).get('text').toUpperCase();
      itemModel.set('_shouldBeSelected', isCorrect);
    });
  }
}
