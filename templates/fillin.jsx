/* eslint-disable multiline-ternary */
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function Fillin(props) {
  const { _graphic, _wordsWithBlanks, _items, _isEnabled, onItemSelect } = props;

  return (
    <div className='component__inner fillin__inner'>
      <templates.header {...props} />

      <div className='fillin__widget component__widget'>
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
        </div>
      </div>
      <div className='btn__container'></div>
    </div>
  );
}
