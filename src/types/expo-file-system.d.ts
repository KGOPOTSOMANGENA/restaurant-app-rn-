declare module 'expo-file-system' {
  export const documentDirectory: string | null;
  export function copyAsync(options: { from: string; to: string }): Promise<void>;
  export function moveAsync(options: { from: string; to: string }): Promise<void>;
  export function deleteAsync(uri: string): Promise<void>;
}