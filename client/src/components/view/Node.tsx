import { FilterConfig } from '../../../../shared/types';
import { Id } from '../../features/createViewSlice';
import { Decorator } from './Decorator';
import { Filter } from './Filter';

export const Node = (props: { filter: FilterConfig; parentId: Id }) => {
  const { filter, parentId } = props;

  switch (filter.type) {
    case 'and':
      return <Decorator filter={filter} parentId={parentId} />;
    case 'or':
      return <Decorator filter={filter} parentId={parentId} />;
    case 'equals':
      return <Filter filter={filter} parentId={parentId} />;
    default:
      throw new Error('Unknown filter config');
  }
};
