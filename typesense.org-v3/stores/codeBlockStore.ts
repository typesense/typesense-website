import { defineStore } from "pinia";

export const useCodeBlockStore = defineStore("codeBlock", {
  state: () => ({
    activeLanguages: {} as Record<string, string>,
  }),

  actions: {
    setCodeLanguage({
      codeBlockStateId,
      codeLanguage,
    }: {
      codeBlockStateId: string;
      codeLanguage: string;
    }) {
      this.activeLanguages[codeBlockStateId] = codeLanguage;
    },

    getActiveLanguage(stateId: string): string | undefined {
      return this.activeLanguages[stateId];
    },
  },
});
