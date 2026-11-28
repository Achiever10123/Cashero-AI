const DISMISS_EVENT = "dismissed";

export function mountPwaInstallPrompt() {
  const userAgent = navigator.userAgent;
  const isIPhone = /\biPhone\b|\biPod\b/i.test(userAgent);
  const isAndroidPhone =
    /\bAndroid\b/i.test(userAgent) && /\bMobile\b/i.test(userAgent);
  if ((!isIPhone && !isAndroidPhone) || isStandalone()) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `<aside class="pwa-install-banner" id="pwa-install-banner" aria-label="Install Cashero">
      <span class="pwa-install-icon" aria-hidden="true"><i class="fa-solid fa-mobile-screen-button"></i></span>
      <div class="pwa-install-copy">
        <strong>Get Cashero on your phone</strong>
        <span>Install the app for quick, full-screen access.</span>
      </div>
      <button class="pwa-install-action" id="pwa-install-action" type="button">Install</button>
      <button class="pwa-install-dismiss" id="pwa-install-dismiss" type="button" aria-label="Dismiss install banner">&times;</button>
    </aside>
    <dialog class="pwa-install-help" id="pwa-install-help" aria-labelledby="pwa-install-help-title">
      <div class="pwa-install-help-content">
        <button class="pwa-install-dismiss pwa-install-help-close" type="button" aria-label="Close install instructions">&times;</button>
        <h2 id="pwa-install-help-title">Add Cashero to your Home Screen</h2>
        <p>${isIPhone ? "In Safari, tap the Share button, then choose “Add to Home Screen” and confirm." : "Open your browser menu, then choose “Install app” or “Add to Home screen” and confirm."}</p>
        <button class="pwa-install-action" id="pwa-install-help-done" type="button">Got it</button>
      </div>
    </dialog>`,
  );

  const banner = document.getElementById("pwa-install-banner");
  const action = document.getElementById("pwa-install-action");
  const help = document.getElementById("pwa-install-help");
  let deferredPrompt = null;

  const dismissBanner = () => {
    banner.hidden = true;
  };
  const showInstructions = () => help.showModal();

  window.addEventListener("beforeinstallprompt", (event) => {
    if (!isAndroidPhone) return;
    event.preventDefault();
    deferredPrompt = event;
    action.textContent = "Install";
  });

  window.addEventListener("appinstalled", dismissBanner);

  action.addEventListener("click", async () => {
    if (!deferredPrompt) {
      showInstructions();
      return;
    }

    const installPrompt = deferredPrompt;
    deferredPrompt = null;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        dismissBanner();
      } else {
        action.textContent = "How to install";
      }
    } catch (error) {
      action.textContent = "How to install";
      console.error("Could not open the PWA install prompt.", error);
    }
  });

  document
    .getElementById("pwa-install-dismiss")
    .addEventListener("click", dismissBanner);
  document
    .querySelector(".pwa-install-help-close")
    .addEventListener("click", () => help.close());
  document
    .getElementById("pwa-install-help-done")
    .addEventListener("click", () => help.close());
  help.addEventListener("click", (event) => {
    if (event.target === help) help.close();
  });
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true
  );
}
