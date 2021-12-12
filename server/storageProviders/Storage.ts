import StorageProvider from '../../types/StorageProvider';
import SequelizeStorageProvider from './SequelizeStorageProvider';

const Storage: StorageProvider = new SequelizeStorageProvider();

export default Storage;
