// Augments interface for hot reloading for Snowpack
interface ImportMeta {
    hot: {
        accept: () => void;
        dispose: (fn: () => void) => void;
    };
    env: {
      [key: string]: string;
    }
}
