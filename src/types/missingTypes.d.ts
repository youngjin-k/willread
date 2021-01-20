declare module '*.png';
declare module '*.jpg';

declare namespace urlRegexSafe {
  interface Options {
    readonly exact?: boolean;
    readonly strict?: boolean;
  }
}

declare function urlRegexSafe(options?: urlRegexSafe.Options): RegExp;

export = urlRegexSafe;
