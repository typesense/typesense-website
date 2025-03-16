<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import Prism from "prismjs";
import "prismjs/components/prism-markup-templating";
import "prism-themes/themes/prism-night-owl.css";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-php";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-powershell";
import "prismjs/plugins/autolinker/prism-autolinker";
import "prismjs/plugins/autolinker/prism-autolinker.css";
import startCase from "lodash.startcase";
import CopyIcon from "@/assets/icons/copy.svg";

const props = defineProps({
  stateId: {
    type: String,
    default: "code-block",
  },
  underlineLinks: {
    type: Boolean,
    default: false,
  },
});

const activeTabStore = useState(props.stateId, () => "");
const slots = useSlots();
const tabs = ref<
  {
    language: string;
    displayLanguage: string;
    content: string;
  }[]
>([]);

const copyStatus = ref<string>("");
const copyTimeout = ref<number | null>(null);

const activeTab = computed({
  get: () => activeTabStore.value,
  set: (val) => {
    activeTabStore.value = val;
  },
});

// Get the current active tab content
const activeTabContent = computed(() => {
  const currentTab = tabs.value.find(
    (tab) => tab.displayLanguage === activeTab.value,
  );
  return currentTab?.content || "";
});

const setCodeLanguage = (displayLanguage: string) => {
  activeTab.value = displayLanguage;
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(activeTabContent.value);
    copyStatus.value = "Copied!";

    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value);
    }

    // Reset copy status after 2 seconds
    copyTimeout.value = window.setTimeout(() => {
      copyStatus.value = "";
    }, 2000);
  } catch (err) {
    copyStatus.value = "Failed to copy";
  }
};

// Set the first tab as active when tabs are loaded
watch(
  tabs,
  (newTabs) => {
    if (newTabs.length > 0 && !activeTab.value) {
      activeTab.value = newTabs[0].displayLanguage;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!slots.default) return;

  tabs.value = slots
    .default()
    .filter((el) => el.type === "pre")
    .map((el) => {
      return {
        language: el.props?.["data-language"],
        displayLanguage:
          el.props?.["data-display-language"] ||
          startCase(el.props?.["data-language"]),
        content: el.children as string,
      };
    });

  // Set first tab as active if we have tabs
  if (tabs.value.length > 0 && !activeTab.value) {
    activeTab.value = tabs.value[0].displayLanguage;
  }

  nextTick(() => {
    Prism.highlightAll();
  });
});

onBeforeUnmount(() => {
  if (copyTimeout.value) {
    clearTimeout(copyTimeout.value);
  }
});
</script>
<template>
  <div class="flex flex-col gap-1.5 rounded-tl-3xl bg-[#f1f1f1] px-4 pt-1.5">
    <div class="flex justify-between">
      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.displayLanguage"
          class="tab-button"
          :class="{ active: activeTab === tab.displayLanguage }"
          @click="setCodeLanguage(tab.displayLanguage)"
        >
          {{ tab.displayLanguage }}
        </button>
      </div>
      <button
        class="tab-button copy-btn flex gap-2.5 tracking-[-0.56px] !text-text-primary"
        @click="copyToClipboard"
      >
        {{ copyStatus || "Copy Code" }}<CopyIcon v-if="!copyStatus" />
      </button>
    </div>
    <div
      v-for="tab in tabs"
      :key="tab.displayLanguage"
      class="tab-pane hidden overflow-auto rounded-t-xl"
      :class="{ active: activeTab === tab.displayLanguage }"
    >
      <pre><code
          :class="[`language-${tab.language}`, underlineLinks ? 'underline-links' : '']"
        >{{ tab.content }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.tab-button {
  @apply cursor-pointer rounded-lg bg-bg px-2.5 py-1.5 text-sm leading-[1.1] text-text-muted;
}
.copy-btn {
  @apply bottom-4 right-4 max-md:absolute;
  font-family: "Fira Code", "Inter", sans-serif;
}

.tab-button.active {
  @apply bg-primary text-text-inverted;
}

.tab-pane.active {
  display: flex;
  flex: 1;
}

pre {
  @apply p-6;
  flex: 1;
  /* background-color: #151228 !important; */
  overflow: auto;
  margin: 0;
  border-radius: 0 !important;
}
pre > * {
  font-family: "Fira Code", "Inter", sans-serif !important;
  /* background-color: #151228 !important; */
}
</style>
