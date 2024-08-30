/* eslint-disable multiline-ternary */
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Fillin(props) {
  const { _graphic, _wordsWithBlanks, _items, _isEnabled, _isInteractionComplete, onItemSelect, hasUndoButton } = props;
  const undo = () => {
    _wordsWithBlanks.forEach((word) => {
      if (word.type === 'blank' && word._isActive) {
        onItemSelect(word);
      }
    });
  };
  //
  const hasItemActive = _items?.some((item) => item._isActive);
  return (
    <div className='component__inner fillin__inner'>
      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'fillin__widget',
          hasUndoButton && 'has-undo-btn',
          !_isEnabled && 'is-disabled',
          _isInteractionComplete && 'is-complete is-submitted show-user-answer'
        ])}
      >
        <templates.image {..._graphic} classNamePrefixes={['component', 'fillin']} attributionClassNamePrefixes={['component', 'fillin']} />

        <div className='fillin__items-blanks'>
          {_wordsWithBlanks?.map((word, index) => {
            return (
              <div key={index} className={classes(['fillin__text', word.type])}>
                {word.type === 'text' ? (
                  <span className=''>{word.text}</span>
                ) : (
                  <button
                    className={classes(['btn-text', !word._isActive && 'is-disabled'])}
                    disabled={!word._isActive || !_isEnabled}
                    onClick={(e) => onItemSelect(word)}
                  >
                    <span>{word.text}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className='fillin__options'>
          {_items?.map((word, index) => {
            return (
              <button
                className={classes(['fillin__option btn-text', word._isActive && 'is-disabled'])}
                disabled={word._isActive || !_isEnabled}
                key={index}
                onClick={(e) => onItemSelect(word)}
              >
                <span>{word.text}</span>
              </button>
            );
          })}
          {hasUndoButton && (
            <button
              className={classes(['fillin__btn-undo btn-icon'], !hasItemActive && 'is-disabled')}
              onClick={(e) => undo()}
              disabled={!hasItemActive}
            >
              <span className='icon icon-video-replay'></span>
            </button>
          )}
        </div>
      </div>
      <div className='btn__container'></div>
    </div>
  );
}
