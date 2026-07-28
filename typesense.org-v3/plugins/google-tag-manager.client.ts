export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.afterEach(async (to) => {
    if (typeof to.name !== "string") return;

    const viewName = typeof to.meta.gtm === "string" && to.meta.gtm ? to.meta.gtm : to.name;
    await Promise.resolve();

    const additionalEventData = (to.meta.gtmAdditionalEventData ?? {}) as Record<string, unknown>;
    let fullUrl = router.options?.history?.base ?? "";

    if (!fullUrl.endsWith("/")) fullUrl += "/";
    fullUrl += to.fullPath.startsWith("/") ? to.fullPath.substring(1) : to.fullPath;

    const browserWindow = window as typeof window & {
      dataLayer?: Record<string, unknown>[];
    };
    const dataLayer = (browserWindow.dataLayer ??= []);

    dataLayer.push({
      ...additionalEventData,
      event: "nuxtRoute",
      "content-name": fullUrl,
      "content-view-name": viewName,
    });
  });
});
