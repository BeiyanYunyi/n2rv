import SQLStorageProvider from '../storageProviders/SQLStorageProvider';
import StorageProvider from '../types/StorageProvider';

const Storage: StorageProvider = new SQLStorageProvider();

export default Storage;
