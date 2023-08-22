import components from 'core/js/components';
import FillinView from './FillinView';
import FillinModel from './FillinModel';

export default components.register('fillin', {
  model: FillinModel,
  view: FillinView
});
