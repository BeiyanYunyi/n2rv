import { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback: FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <h1>网页出错了</h1>
    <pre>{error.message}</pre>
    <p>提交给开发人员时请附上 F12-Console（控制台） 里的内容</p>
    <button onClick={resetErrorBoundary} type="button">
      返回前页
    </button>
  </div>
);

const AppErrorBoundary: FC = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      window.history.back();
    }}
  >
    {children}
  </ErrorBoundary>
);

export default AppErrorBoundary;
