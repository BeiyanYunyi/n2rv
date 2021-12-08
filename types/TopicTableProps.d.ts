import AppSetStateAction from './AppSetStateAction';
import { TopicWhileGetAll } from './Topic';

export default interface TopicTableProps {
  topicList: TopicWhileGetAll[];
  loading: boolean;
  setLoading: AppSetStateAction<boolean>;
  page: number;
  setPage: AppSetStateAction<number>;
  lastPage: number;
}
