export const toNumOrNull = (s: string) => (s === '' ? null : Number(s));
export const n = (v: number | null | undefined) => v ?? 0;
export const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');
