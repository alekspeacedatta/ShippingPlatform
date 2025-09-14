export const toNumOrNull = (s: string) => (s === '' ? null : Number(s));
export const n = (v: number | null | undefined) => v ?? 0;
